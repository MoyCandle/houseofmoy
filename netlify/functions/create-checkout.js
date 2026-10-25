// Netlify Function: creates a Yoco card-payment checkout.
//
// The browser sends the cart; this function re-prices every item from
// src/pricing.js (so nobody can change prices in their browser), asks
// Yoco for a secure payment page, and sends back its link.
//
// Needs ONE environment variable set in Netlify (never in this code):
//   YOCO_SECRET_KEY = sk_live_...   (or sk_test_... while testing)
// Netlify → Site configuration → Environment variables.

import { priceForCartItem, courierFeeFor, unitsForCartItem, BUNDLES, sizeLabel } from "../../src/pricing.js";

const YOCO_CHECKOUT_URL = "https://payments.yoco.com/api/checkouts";
const MAX_ITEMS = 30;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const clean = (v, max = 120) => String(v ?? "").trim().slice(0, max);

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const secretKey = process.env.YOCO_SECRET_KEY;
  if (!secretKey) {
    console.error("YOCO_SECRET_KEY is not set in Netlify environment variables.");
    return json(500, { error: "Card payments aren't set up yet. Please choose EFT." });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0 || items.length > MAX_ITEMS) {
    return json(400, { error: "Your cart is empty or too large." });
  }

  // Re-price every line on the server.
  let subtotal = 0;
  let units = 0;
  const lines = [];
  for (const raw of items) {
    const item = {
      candleId: Number(raw?.candleId),
      size: Number(raw?.size),
      isDiffuser: Boolean(raw?.isDiffuser),
      bundle: raw?.bundle && BUNDLES[raw.bundle] ? raw.bundle : null,
    };
    const price = priceForCartItem(item);
    if (price == null) return json(400, { error: "One of the items in your cart isn't available." });
    subtotal += price;
    units += unitsForCartItem(item);
    const what = item.bundle ? BUNDLES[item.bundle].name : item.isDiffuser ? "diffuser" : sizeLabel(item.size);
    lines.push(`${clean(raw?.brand, 40)} ${what}${raw?.jarColor ? " " + clean(raw.jarColor, 10) : ""} R${price}`);
  }
  const courier = courierFeeFor(units);
  const total = subtotal + courier;

  const c = body?.customer || {};
  const customer = {
    name: clean(c.name, 80),
    email: clean(c.email, 120),
    phone: clean(c.phone, 30),
    address: clean(c.address, 250),
  };
  if (!customer.name || !customer.email) return json(400, { error: "Please fill in your details." });

  const orderRef = clean(body?.orderRef, 40) || `MOY-${Date.now()}`;
  const site = process.env.URL || new URL(req.url).origin;

  const yocoRes = await fetch(YOCO_CHECKOUT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
      "Idempotency-Key": orderRef,
    },
    body: JSON.stringify({
      amount: total * 100, // Yoco wants cents
      currency: "ZAR",
      successUrl: `${site}/?payment=success&ref=${encodeURIComponent(orderRef)}`,
      cancelUrl: `${site}/?payment=cancelled&ref=${encodeURIComponent(orderRef)}`,
      failureUrl: `${site}/?payment=failed&ref=${encodeURIComponent(orderRef)}`,
      // Shows on the payment in your Yoco portal, so you always have the
      // delivery details even if the customer closes their browser early.
      metadata: {
        orderRef,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        deliveryAddress: customer.address,
        items: lines.join(" | ").slice(0, 480),
        courier: `R${courier}`,
      },
    }),
  });

  const data = await yocoRes.json().catch(() => ({}));
  if (!yocoRes.ok || !data.redirectUrl) {
    console.error("Yoco checkout failed", yocoRes.status, data);
    return json(502, { error: "Couldn't reach the card payment service. Please try again or choose EFT." });
  }

  return json(200, { redirectUrl: data.redirectUrl, checkoutId: data.id, total, courier, orderRef });
};
