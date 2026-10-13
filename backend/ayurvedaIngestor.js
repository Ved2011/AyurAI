#!/usr/bin/env node
/**
 * ============================================================================
 * Ayurveda Food Ingestor Worker (Open Food Facts ETL Pipeline)
 * ============================================================================
 * Paginates through the Open Food Facts API (3M+ food products catalog).
 * Extracts raw ingredients, applies boundary-aware Ayurvedic ontology rules,
 * and bulk UPSERTs records into PostgreSQL (ON CONFLICT (id) DO NOTHING).
 *
 * Implements rate limiting and exponential backoff to ensure reliable ingestion
 * without IP throttling.
 */

const { Pool } = require("pg");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

// ---------- PostgreSQL Connection Pool ----------
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT || "5432", 10),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "Hello@123",
  database: process.env.PGDATABASE || "ayurai",
  max: 10,
  idleTimeoutMillis: 30000,
});

// ---------- Ingestion Configuration ----------
const BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const PAGE_SIZE = 1000;
const RATE_LIMIT_DELAY_MS = parseInt(process.env.INGESTOR_DELAY_MS || "1200", 10);
const MAX_CONSECUTIVE_ERRORS = 5;
const USER_AGENT = "AyurAI-AyurvedicEngine/1.0 (https://github.com/Ved2011/AyurAI; contact: dev@ayurai.internal)";

// ---------- Boundary-Aware Ayurvedic Ontology Dictionaries ----------
// Word boundary (\b) prevents substring false positives (e.g., 'eggplant' != 'egg', 'buttermilk' != 'butter')
const REGEX_MAP = {
  dairy: /\b(milk|dairy|cream|cheese|cheddar|mozzarella|parmesan|butter|buttermilk|ghee|curd|yogurt|yoghurt|casein|caseinate|whey|lactose|paneer|custard|sour\s+cream|ice\s+cream)\b/i,
  fermented: /\b(fermented|vinegar|yeast|yeast\s+extract|alcohol|wine|beer|kombucha|sauerkraut|kimchi|miso|pickled?|sourdough|kefir|tempeh|cider|natto|shoyu)\b/i,
  nightshade: /\b(tomato|tomatoes|potato|potatoes|eggplant|eggplants|brinjal|aubergine|bell\s+peppers?|capsicum|chili|chilis|chillies|paprika|cayenne|tomatillo|tobacco|goji\s+berries|ashwagandha)\b/i,

  // Potency (Virya)
  potencyHot: /\b(chili|peppercorn|black\s+pepper|cayenne|mustard|garlic|onion|ginger|cinnamon|clove|nutmeg|vinegar|alcohol|fermented|seafood|fish|shellfish|beef|pork|lamb|bacon|turmeric|cumin|asafoetida|hing)\b/i,
  potencyCold: /\b(milk|coconut|cucumber|mint|peppermint|spearmint|melon|watermelon|cantaloupe|banana|grape|grapes|apple|pear|coriander|fennel|cardamom|rose|ghee|cane\s+sugar|aloe|fennel\s+seed)\b/i,

  // Six Tastes (Shad Rasa)
  tasteSweet: /\b(sugar|sucrose|fructose|glucose|dextrose|honey|syrup|molasses|rice|wheat|oats|milk|cream|banana|date|dates|ghee|sweet\s+potato)\b/i,
  tasteSour: /\b(lemon|lime|citric\s+acid|ascorbic\s+acid|vinegar|acetic\s+acid|sour|yogurt|tamarind|tomato|cranberry|sour\s+cream|lactic\s+acid)\b/i,
  tasteSalty: /\b(salt|sodium|sea\s+salt|rock\s+salt|brine|salted|sodium\s+chloride|monosodium\s+glutamate|msg)\b/i,
  tastePungent: /\b(chili|peppers?|black\s+pepper|mustard|horseradish|wasabi|ginger|garlic|raw\s+onion|radish|capsicum|cayenne)\b/i,
  tasteBitter: /\b(coffee|cocoa|cacao|dark\s+chocolate|turmeric|fenugreek|bitter\s+gourd|karela|dandelion|kale|chicory|hops|grapefruit)\b/i,
  tasteAstringent: /\b(pomegranate|green\s+tea|black\s+tea|tannins?|artichoke|persimmon|cranberry|raw\s+banana|beans|lentils|okra)\b/i,
};

/**
 * Classifies an ingredient text string into Ayurvedic attributes
 */
function classifyItem(name, ingredientsRaw) {
  const corpus = `${name || ""} ${ingredientsRaw || ""}`.toLowerCase();

  const isDairy = REGEX_MAP.dairy.test(corpus);
  const isFermented = REGEX_MAP.fermented.test(corpus);
  const isNightshade = REGEX_MAP.nightshade.test(corpus);

  // Potency scoring
  const hasHot = REGEX_MAP.potencyHot.test(corpus);
  const hasCold = REGEX_MAP.potencyCold.test(corpus);
  let potency = "neutral";
  if (hasHot && !hasCold) {
    potency = "hot";
  } else if (hasCold && !hasHot) {
    potency = "cold";
  } else if (hasHot && hasCold) {
    // Both triggers: default to dominant heating metabolic imprint
    potency = "hot";
  }

  // Tastes detection
  const detectedTastes = [];
  if (REGEX_MAP.tasteSweet.test(corpus)) detectedTastes.push("sweet");
  if (REGEX_MAP.tasteSour.test(corpus)) detectedTastes.push("sour");
  if (REGEX_MAP.tasteSalty.test(corpus)) detectedTastes.push("salty");
  if (REGEX_MAP.tastePungent.test(corpus)) detectedTastes.push("pungent");
  if (REGEX_MAP.tasteBitter.test(corpus)) detectedTastes.push("bitter");
  if (REGEX_MAP.tasteAstringent.test(corpus)) detectedTastes.push("astringent");

  const tastes = detectedTastes.length > 0 ? detectedTastes.join(",") : "neutral";

  return {
    potency,
    tastes,
    isDairy,
    isFermented,
    isNightshade,
  };
}

/**
 * Polite sleep helper for rate limiting
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Batch multi-row UPSERT helper for high-throughput database insertion
 */
async function batchUpsert(client, items) {
  if (!items || items.length === 0) return 0;

  // Build parameterized batch query
  const values = [];
  const valueClauses = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const offset = i * 8;
    valueClauses.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`
    );
    values.push(
      item.id,
      item.name,
      item.ingredients_raw,
      item.potency,
      item.tastes,
      item.is_dairy,
      item.is_fermented,
      item.is_nightshade
    );
  }

  const query = `
    INSERT INTO food_items (
      id, name, ingredients_raw, potency, tastes, is_dairy, is_fermented, is_nightshade
    )
    VALUES ${valueClauses.join(", ")}
    ON CONFLICT (id) DO NOTHING;
  `;

  const res = await client.query(query, values);
  return res.rowCount || 0;
}

/**
 * Main pagination loop
 */
async function runIngestor() {
  console.log("==========================================================");
  console.log("Starting Ayurvedic Food Ingestor (Open Food Facts ETL)...");
  console.log(`Page Size: ${PAGE_SIZE} | Rate Delay: ${RATE_LIMIT_DELAY_MS}ms`);
  console.log("==========================================================");

  let client;
  try {
    client = await pool.connect();
    console.log("Connected to PostgreSQL successfully.");

    // Auto-create schema if needed
    await client.query(`
      CREATE TABLE IF NOT EXISTS food_items (
        id VARCHAR(128) PRIMARY KEY,
        name TEXT NOT NULL,
        ingredients_raw TEXT,
        potency VARCHAR(32),
        tastes VARCHAR(128),
        is_dairy BOOLEAN DEFAULT FALSE,
        is_fermented BOOLEAN DEFAULT FALSE,
        is_nightshade BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_food_items_potency ON food_items (potency);
      CREATE INDEX IF NOT EXISTS idx_food_items_flags ON food_items (is_dairy, is_fermented, is_nightshade);
    `);

    let page = parseInt(process.env.START_PAGE || "1", 10);
    const maxPages = process.env.MAX_PAGES ? parseInt(process.env.MAX_PAGES, 10) : Infinity;
    let consecutiveErrors = 0;
    let totalInserted = 0;

    while (page <= maxPages) {
      const url = `${BASE_URL}?search_simple=1&action=process&json=1&page_size=${PAGE_SIZE}&page=${page}`;
      console.log(`[Page ${page}] Fetching ${url} ...`);

      let response;
      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/json",
          },
        });
      } catch (networkErr) {
        consecutiveErrors++;
        console.error(`[Page ${page}] Network failure (${networkErr.message}). Backing off...`);
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          console.error("Max consecutive network failures reached. Aborting worker.");
          break;
        }
        await sleep(5000 * consecutiveErrors);
        continue;
      }

      if (response.status === 429) {
        console.warn(`[Page ${page}] Rate limit hit (HTTP 429). Exponential cooling for 15s...`);
        await sleep(15000);
        continue;
      }

      if (!response.ok) {
        consecutiveErrors++;
        console.error(`[Page ${page}] API returned HTTP ${response.status}. Retrying...`);
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) break;
        await sleep(5000 * consecutiveErrors);
        continue;
      }

      // Reset error counter on healthy response
      consecutiveErrors = 0;

      const data = await response.json();
      const products = data.products || [];

      if (products.length === 0) {
        console.log(`[Page ${page}] No more products returned. Ingestion complete!`);
        break;
      }

      // Transform products
      const parsedItems = [];
      for (const p of products) {
        const id = p.code || p._id || p.id;
        const name = (p.product_name || p.product_name_en || p.generic_name || "").trim();
        const ingredientsRaw = (p.ingredients_text || p.ingredients_text_en || "").trim();

        // Skip products without identifier or name
        if (!id || !name) continue;

        const classification = classifyItem(name, ingredientsRaw);

        parsedItems.push({
          id: String(id),
          name: name.substring(0, 1000),
          ingredients_raw: ingredientsRaw || null,
          potency: classification.potency,
          tastes: classification.tastes,
          is_dairy: classification.isDairy,
          is_fermented: classification.isFermented,
          is_nightshade: classification.isNightshade,
        });
      }

      // Bulk UPSERT in sub-batches of 250 to respect query parameter limits
      let pageInserted = 0;
      const CHUNK_SIZE = 250;
      for (let i = 0; i < parsedItems.length; i += CHUNK_SIZE) {
        const chunk = parsedItems.slice(i, i + CHUNK_SIZE);
        const inserted = await batchUpsert(client, chunk);
        pageInserted += inserted;
      }

      totalInserted += pageInserted;
      console.log(
        `[Page ${page}] Processed ${products.length} products. Successfully UPSERTed ${pageInserted} new records. (Cumulative: ${totalInserted})`
      );

      page++;

      // Polite rate limit delay to prevent IP bans
      await sleep(RATE_LIMIT_DELAY_MS);
    }

    console.log(`Ingestion cycle completed. Total new items recorded: ${totalInserted}`);
  } catch (err) {
    console.error("Fatal ingestion error:", err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runIngestor();
}

module.exports = {
  runIngestor,
  classifyItem,
  REGEX_MAP,
};
