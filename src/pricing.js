// ── Moy prices (Rand) ───────────────────────────────────────────
// Single source of truth. The shop page AND the Yoco card-payment
// function both read from here, so a customer can never be charged
// a different amount from what the site shows.
// To change a price: edit it here, save, and push.

export const CANDLE_PRICES = {
  1: { 200: 250, 300: 350 }, // Mymer
  2: { 200: 250, 300: 350 }, // Woestyn
  3: { 200: 250, 300: 350 }, // Feestelik
  4: { 200: 250, 300: 350 }, // Roosevelt (essential oil)
  5: { 200: 250, 300: 350 }, // Sosie
  6: { 200: 250, 300: 350 }, // Baka
};

export const DIFFUSER_PRICE = 300;

// ── What customers see for each candle size ──
// The keys (200 / 300) are internal IDs used by the cart and Yoco
// checkout — don't change them. Change the labels here instead.
export const SIZE_LABEL = { 200: "Small 160g", 300: "Large 300g" };
export const sizeLabel = (size) => SIZE_LABEL[size] || `${size}g`;

// ── Gift sets ──
// Each set = the items listed, minus BUNDLE_DISCOUNT.
// e.g. Moy Trio = small + large candle + diffuser = R900 - R50 = R850
export const BUNDLE_DISCOUNT = 50;
export const BUNDLES = {
  trio:         { name: "The Moy Trio",         parts: [200, 300, "diffuser"], giftBox: true,  desc: "Small 160g + Large 300g candle + 200ml diffuser" },
  "300-diff":   { name: "Candle & Diffuser",    parts: [300, "diffuser"],      giftBox: false, desc: "Large 300g candle + 200ml diffuser" },
  "200-diff":   { name: "Petite & Diffuser",    parts: [200, "diffuser"],      giftBox: false, desc: "Small 160g candle + 200ml diffuser" },
  "200-300":    { name: "Candle Duo",           parts: [200, 300],             giftBox: false, desc: "Small 160g + Large 300g candle" },
};

export const COURIER_FEE = 75;
export const FREE_COURIER_FROM = 3; // items (each item in a set counts)

export const courierFeeFor = (itemCount) => (itemCount >= FREE_COURIER_FROM ? 0 : COURIER_FEE);

const partPrice = (sizes, part) => (part === "diffuser" ? DIFFUSER_PRICE : sizes[part]);

export const priceForBundle = (candleId, bundleId) => {
  const sizes = CANDLE_PRICES[candleId];
  const b = BUNDLES[bundleId];
  if (!sizes || !b) return null;
  return b.parts.reduce((sum, p) => sum + partPrice(sizes, p), 0) - BUNDLE_DISCOUNT;
};

// How many physical items a cart line is (a trio counts as 3)
export const unitsForCartItem = (item) => (item.bundle && BUNDLES[item.bundle] ? BUNDLES[item.bundle].parts.length : 1);

// Price of one cart line, or null if it isn't a real product/size.
export const priceForCartItem = ({ candleId, size, isDiffuser, bundle }) => {
  if (bundle) return priceForBundle(candleId, bundle);
  const sizes = CANDLE_PRICES[candleId];
  if (!sizes) return null;
  if (isDiffuser) return DIFFUSER_PRICE;
  return sizes[size] ?? null;
};
