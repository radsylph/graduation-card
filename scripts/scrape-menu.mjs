// One-off scraper for the Aliño Restaurante menu.
//
// Usage:  node scripts/scrape-menu.mjs
//
// Fetches https://alinorestaurante.com, parses the server-rendered product
// grid, and writes the result to `src/data/menu.json`. Re-run it whenever the
// restaurant's menu changes; the output is committed so the site never depends
// on a live request at build time.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ORIGIN = "https://alinorestaurante.com";
const SOURCE_URL = ORIGIN;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "src", "data", "menu.json");

const NAMED_ENTITIES = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  aacute: "á",
  eacute: "é",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
  Aacute: "Á",
  Eacute: "É",
  Iacute: "Í",
  Oacute: "Ó",
  Uacute: "Ú",
  Ntilde: "Ñ",
  auml: "ä",
  euml: "ë",
  iuml: "ï",
  ouml: "ö",
  uuml: "ü",
};

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&([a-zA-Z]+);/g, (match, name) =>
      name in NAMED_ENTITIES ? NAMED_ENTITIES[name] : match,
    );
}

/** "$ 5.00" -> 5 */
function parsePrice(raw) {
  if (!raw) return null;
  const value = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : null;
}

function parseCard(card) {
  const name = card.match(/class="p-name">([\s\S]*?)<\/div>/)?.[1];
  const desc = card.match(/class="p-desc">([\s\S]*?)<\/div>/)?.[1];
  const img = card.match(/<img[^>]*\bsrc="([^"]+)"/)?.[1];
  const href = card.match(/href="([^"]+)"/)?.[1];
  // Match the exact "price" or "price price-promo" class, not "price-old".
  const price = card.match(
    /class="price(?: price-promo)?">([\s\S]*?)<\/div>/,
  )?.[1];
  const oldPrice = card.match(/class="price-old">([\s\S]*?)<\/span>/)?.[1];
  const promo = /promo-ribbon/.test(card);

  return {
    name: decodeEntities(name?.trim() ?? ""),
    description: desc ? decodeEntities(desc.trim()) : "",
    price: parsePrice(price),
    oldPrice: parsePrice(oldPrice),
    promo,
    image: img ? new URL(img, ORIGIN).toString() : null,
    href: href ? new URL(href, ORIGIN).toString() : null,
  };
}

async function main() {
  const response = await fetch(SOURCE_URL, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status}`);
  }
  const html = await response.text();

  const categories = [];
  const sectionRe =
    /<section class="cat-sec[^"]*"\s*id="(\d+)"[^>]*>([\s\S]*?)<\/section>/g;

  for (const match of html.matchAll(sectionRe)) {
    const [, id, body] = match;

    const name = body.match(
      /class="sec-title"[\s\S]*?<span>([\s\S]*?)<\/span>/,
    )?.[1];
    if (!name) continue;

    const items = [];
    const cardRe = /<a class="prod-card"[\s\S]*?<\/a>/g;
    for (const card of body.matchAll(cardRe)) {
      items.push(parseCard(card[0]));
    }

    categories.push({ id, name: decodeEntities(name.trim()), items });
  }

  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);
  writeFileSync(
    OUT_PATH,
    `${JSON.stringify({ categories }, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `Wrote ${categories.length} categories, ${totalItems} items -> ${OUT_PATH}`,
  );
  for (const category of categories) {
    console.log(`  - ${category.name}: ${category.items.length} items`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
