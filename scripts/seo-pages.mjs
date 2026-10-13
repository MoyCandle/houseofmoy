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
