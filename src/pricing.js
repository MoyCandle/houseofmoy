// ── Moy prices (Rand) ───────────────────────────────────────────
// Single source of truth. The shop page AND the Yoco card-payment
// function both read from here, so a customer can never be charged
// a different amount from what the site shows.
// To change a price: edit it here, save, and push.

export const CANDLE_PRICES = {
  1: { 200: 250, 300: 350 }, // Mymer
  2: { 200: 250, 300: 350 }, // Woestyn
  3: { 200: 250, 300: 350 }, // Feestelik
  4: { 200: 280, 300: 380 }, // Roosevelt (essential oil)
  5: { 200: 250, 300: 350 }, // Sosie
  6: { 200: 250, 300: 350 }, // Baka
};

export const DIFFUSER_PRICE = 300;

export const COURIER_FEE = 75;
export const FREE_COURIER_FROM = 3; // items

export const courierFeeFor = (itemCount) => (itemCount >= FREE_COURIER_FROM ? 0 : COURIER_FEE);

// Price of one cart line, or null if it isn't a real product/size.
export const priceForCartItem = ({ candleId, size, isDiffuser }) => {
  const sizes = CANDLE_PRICES[candleId];
  if (!sizes) return null;
  if (isDiffuser) return DIFFUSER_PRICE;
  return sizes[size] ?? null;
};
