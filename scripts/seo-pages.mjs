// Runs after `vite build`. Gives every page its own HTML file with the right
// Google title, description and link, and writes sitemap.xml.
// Page titles/descriptions live in src/App.jsx (ROUTES) — keep these in step.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://houseofmoy.co.za";
const pages = {
  "/our-process": {
    title: "Our Process | How Moy Candles Are Made",
    description: "Soy-coconut wax, wooden cross-wicks and our signature two-stage pour. See how every Moy candle is crafted by hand in South Africa.",
  },
  "/candle-care": {
    title: "Candle Care Tips | Moy Candles",
    description: "How to get the best burn from your Moy candle: first burn, trimming wooden wicks, burn times, safety and diffuser care.",
  },
  "/shop": {
    title: "Shop Scented Candles & Diffusers | Moy Candles",
    description: "Shop Moy's hand-poured scented candles and reed diffusers: Sosie, Feestelik, Roosevelt, Baka, Woestyn and Mymer. Delivered across South Africa.",
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const base = readFileSync("dist/index.html", "utf8");

for (const [path, { title, description }] of Object.entries(pages)) {
  const html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${SITE}${path}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}${path}$2`);
  mkdirSync(`dist${path}`, { recursive: true });
  writeFileSync(`dist${path}/index.html`, html);
}

const today = new Date().toISOString().slice(0, 10);
const urls = ["/", ...Object.keys(pages)];
writeFileSync("dist/sitemap.xml",
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
console.log("SEO pages + sitemap written:", urls.join(", "));

// ── Facebook / Instagram Shop catalogue feed ─────────────────────
// Writes dist/catalog.csv from the same candle data and prices the
// shop page uses. Meta Commerce Manager fetches it daily from
// https://houseofmoy.co.za/catalog.csv, so the Facebook Shop updates
// itself every time the site is deployed.
const { candles, candleOrder } = await import("../src/candles.js");
const { DIFFUSER_PRICE, BUNDLES, priceForBundle, sizeLabel, isSoldOut } = await import("../src/pricing.js");

const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const img = (p) => SITE + encodeURI(p);
const zar = (n) => `${Number(n).toFixed(2)} ZAR`;
const scentLine = (c) => `Top: ${c.notes.top}. Middle: ${c.notes.middle}. Base: ${c.notes.base}.`;

const rows = [];
for (const c of [...candles].sort((a, b) => candleOrder.indexOf(a.brand) - candleOrder.indexOf(b.brand))) {
  const base = {
    link: `${SITE}/shop#candle-${c.id}`, brand: "Moy Candles", condition: "new",
    availability: isSoldOut(c.id) ? "out of stock" : "in stock", item_group_id: `moy-${c.id}`, scent: c.brand,
  };
  const about = [c.mood, c.story, scentLine(c), "Hand-poured in South Africa."].filter(Boolean).join(" ");
  for (const [size, s] of Object.entries(c.sizes)) {
    rows.push({ ...base, id: `moy-${c.id}-${size}g`, title: `${c.brand} ${c.tagline} Scented Candle ${sizeLabel(size)}`,
      description: `${about} ${sizeLabel(size)} candle, about ${s.burn} burn time. ${s.space}.`,
      price: zar(s.price), image_link: img(c.img), size: sizeLabel(size), product_type: "Candles > Scented Candles" });
  }
  rows.push({ ...base, id: `moy-${c.id}-diffuser`, title: `${c.brand} ${c.tagline} Diffuser 200ml`,
    description: `${about} 200ml diffuser in the ${c.brand} scent.`,
    price: zar(DIFFUSER_PRICE), image_link: img("/Diffuser.jpg"), size: "200ml", product_type: "Home Fragrance > Diffusers" });
  const trio = BUNDLES.trio;
  rows.push({ ...base, id: `moy-${c.id}-trio`, title: `${trio.name} Gift Set: ${c.brand} ${c.tagline}`,
    description: `${trio.desc} in the ${c.brand} scent, in a gift box. ${scentLine(c)} Hand-poured in South Africa.`,
    price: zar(priceForBundle(c.id, "trio")), image_link: img(c.giftImages?.trio || c.img), size: "Gift set", product_type: "Gift Sets" });
}
const cols = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand", "item_group_id", "size", "scent", "product_type"];
writeFileSync("dist/catalog.csv", [cols.join(","), ...rows.map(r => cols.map(k => csv(r[k])).join(","))].join("\n") + "\n");
console.log(`Catalogue feed written: catalog.csv (${rows.length} products)`);
