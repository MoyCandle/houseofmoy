// ── Moy candles ─────────────────────────────────────────────────
// Single source of truth for every scent. The shop page AND the
// Facebook/Instagram catalogue feed (scripts/seo-pages.mjs) read
// from here, so the Facebook Shop always matches the website.
import { CANDLE_PRICES } from "./pricing.js";

export const publicCandleImages = {
  Mymer: "/Mymer.jpeg",
  Woestyn: "/Woestyn.png",
  Feestelik: "/Feestelik.jpeg",
  Sosie: "/Sosie.jpeg",
  Baka: "/Baka.png",
  Roosevelt: { white: "/Roosevelt White.jpeg" },
};

export const candleOrder = ["Sosie", "Feestelik", "Roosevelt", "Baka", "Woestyn", "Mymer"];

export const candles = [
  {
    id: 1, brand: "Mymer", tagline: "Gentle Reverie",
    logo: publicCandleImages.Mymer, img: publicCandleImages.Mymer,
    mood: "The emotion of stillness without emptiness. It's peace with depth. It's softness with strength.",
    notes: { top: "Pineapple, Melon, Bergamot", middle: "Lavender, Jasmine", base: "Amber, Cedarwood" },
    story: null,
    sizes: { 200:{ price:CANDLE_PRICES[1][200], burn:"25 hrs", space:"Intimate small space" }, 300:{ price:CANDLE_PRICES[1][300], burn:"40 hrs", space:"Suitable for bigger areas" } },
  },
  {
    id: 2, brand: "Woestyn", tagline: "Wild Stillness",
    logo: publicCandleImages.Woestyn, img: publicCandleImages.Woestyn,
    mood: "Warm, cozy and intimate. Perfect for those stay-at-home Friday nights when all you want to do is unwind and indulge in some me-time.",
    notes: { top: "Earthy, herbaceous", middle: "Woody, floral", base: "Woody warmth that deepens as it burns" },
    story: "As the candle burns, the fragrance evolves and the notes blend together in harmony — complex and alluring, both grounding and uplifting.",
    sizes: { 200:{ price:CANDLE_PRICES[2][200], burn:"25 hrs", space:"Intimate small space" }, 300:{ price:CANDLE_PRICES[2][300], burn:"40 hrs", space:"Suitable for bigger areas" } },
  },
  {
    id: 3, brand: "Feestelik", tagline: "Warm Embrace",
    logo: publicCandleImages.Feestelik, img: publicCandleImages.Feestelik,
    mood: "A whimsical accomplice to stolen moments of indulgence.",
    notes: { top: "Juicy crisp pear", middle: "Creamy baked-good warmth", base: "Warm amber, sweet vanilla" },
    story: "Be transported to a sugar-dusted haven where even the air tastes like a hug from your grandmother's oven.",
    sizes: { 200:{ price:CANDLE_PRICES[3][200], burn:"25 hrs", space:"Intimate small space" }, 300:{ price:CANDLE_PRICES[3][300], burn:"40 hrs", space:"Suitable for bigger areas" } },
  },
  {
    id: 4, brand: "Roosevelt", tagline: "Poised Elegance",
    logo: publicCandleImages.Roosevelt.white,
    img: publicCandleImages.Roosevelt.white,
    images: { white: publicCandleImages.Roosevelt.white },
    essentialOil: true,
    mood: "Romantic solace — a rather serene and comforting one.",
    notes: { top: "Invigorating citrus", middle: "Floral romance", base: "Warm woody depth" },
    story: "Be transported to a world of enchantment and love, surrounded by the intoxicating scent of love and magic.",
    sizes: { 200:{ price:CANDLE_PRICES[4][200], burn:"25 hrs", space:"Intimate small space" }, 300:{ price:CANDLE_PRICES[4][300], burn:"40 hrs", space:"Suitable for bigger areas" } },
  },
  {
    id: 5, brand: "Sosie", tagline: "Blush Radiance",
    logo: publicCandleImages.Sosie, img: publicCandleImages.Sosie,
    mood: "\u201CRooms of spectacular opulence.\u201D Evokes feelings of joy, happiness and contentment.",
    notes: { top: "Crisp citrus, fruity", middle: "Floral, fruity", base: "Sweet, bubbly musk" },
    story: "Transport your space to a world of elegance and celebration.",
    sizes: { 200:{ price:CANDLE_PRICES[5][200], burn:"25 hrs", space:"Intimate small space" }, 300:{ price:CANDLE_PRICES[5][300], burn:"40 hrs", space:"Suitable for bigger areas" } },
  },
  {
    id: 6, brand: "Baka", tagline: "Rooted Clarity",
    logo: publicCandleImages.Baka, img: publicCandleImages.Baka,
    mood: "Be transported to a secluded Mediterranean terrace at dusk, where citrus trees perfume the air, warm stone walls hold the day's heat, and a soft breeze carries the promise of an unforgettable night.",
    notes: { top: "Lime, Basil, Mandarin, Orange zest", middle: "Black pepper, Geranium, Lilac, Thyme", base: "Moss, Patchouli, Musk, White Cedar" },
    story: null,
    sizes: { 200:{ price:CANDLE_PRICES[6][200], burn:"25 hrs", space:"Intimate small space" }, 300:{ price:CANDLE_PRICES[6][300], burn:"40 hrs", space:"Suitable for bigger areas" } },
  },
];
