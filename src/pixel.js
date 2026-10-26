// ── Meta Pixel (Facebook / Instagram) ───────────────────────────
// Tells Meta when someone adds to cart, starts checkout or orders,
// so ads can reach people who looked at a candle and measure sales.
// The Pixel itself loads in index.html. The product IDs here match
// the catalogue feed (scripts/seo-pages.mjs), so Meta knows which
// product each event is about.

// One cart item → the same ID it has in catalog.csv
export const pixelIdFor = (item) => {
  if (item.bundle) return `moy-${item.candleId}-${item.bundle}`;
  if (item.isDiffuser) return `moy-${item.candleId}-diffuser`;
  return `moy-${item.candleId}-${item.size}g`;
};

const send = (event, params) => {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") window.fbq("track", event, params);
  } catch { /* never let tracking break the shop */ }
};

const forItems = (items) => ({
  content_ids: items.map(pixelIdFor),
  content_type: "product",
  contents: items.map(i => ({ id: pixelIdFor(i), quantity: 1, item_price: i.price })),
  num_items: items.length,
  value: items.reduce((sum, i) => sum + i.price, 0),
  currency: "ZAR",
});

export const trackAddToCart = (item) => send("AddToCart", forItems([item]));
export const trackInitiateCheckout = (items) => send("InitiateCheckout", forItems(items));
export const trackPurchase = (items) => send("Purchase", forItems(items));
