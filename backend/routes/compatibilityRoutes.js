/**
 * ============================================================================
 * Ayurvedic Food Compatibility API Routes (Viruddha Ahara Engine)
 * ============================================================================
 * Endpoints:
 * - POST /api/compatibility/evaluate
 * - GET  /api/compatibility/product/:barcode
 * - POST /api/compatibility/benchmark
 * - GET  /api/compatibility/dravyas
 */

const express = require("express");
const {
  CANONICAL_DRAVYAS,
  offMapper,
  combinatorialEngine,
  evaluateMeal,
} = require("../services/ayurFoodCompatibilityEngine");

const router = express.Router();

/**
 * POST /api/compatibility/evaluate
 * Evaluates compatibility across multiple food items with optional context
 * (is_heated, is_night_time, user_dosha)
 */
router.post("/evaluate", (req, res) => {
  const { items = [], context = {}, is_heated = false, is_night_time = false } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "Items array is required and must contain at least 1 food item.",
      example: {
        items: [
          { name_or_tag: "milk", quantity_grams: 200 },
          { name_or_tag: "fish", quantity_grams: 150 },
        ],
        context: { is_heated: false, is_night_time: false, user_dosha: "pitta" },
      },
    });
  }

  const resolvedItems = [];
  const unresolved = [];

  for (const it of items) {
    const rawQuery = typeof it === "string" ? it : it.name_or_tag || it.name || it.tag || "";
    const grams = typeof it === "object" ? Number(it.quantity_grams || it.quantity || 100) : 100;
    const dravya = offMapper.resolve(rawQuery);

    if (dravya) {
      resolvedItems.push({
        dravya,
        quantity_grams: isNaN(grams) ? 100 : grams,
      });
    } else {
      unresolved.push(rawQuery);
    }
  }

  if (resolvedItems.length === 0) {
    return res.status(404).json({
      error: "None of the submitted items could be resolved to canonical Ayurvedic dravyas.",
      unresolved_items: unresolved,
      available_examples: CANONICAL_DRAVYAS.map((d) => d.name_common),
    });
  }

  // Combine context flags
  const evalOptions = {
    is_heated: Boolean(context.is_heated !== undefined ? context.is_heated : is_heated),
    is_night_time: Boolean(context.is_night_time !== undefined ? context.is_night_time : is_night_time),
    user_dosha: context.user_dosha || null,
  };

  const report = evaluateMeal(resolvedItems, evalOptions);

  return res.json({
    ...report,
    unresolved_items: unresolved.length > 0 ? unresolved : undefined,
  });
});

/**
 * GET /api/compatibility/product/:barcode
 * Fetches product from Open Food Facts API v2 and evaluates recipe internal compatibility
 */
router.get("/product/:barcode", async (req, res) => {
  const { barcode } = req.params;
  if (!barcode) {
    return res.status(400).json({ error: "Barcode parameter is required." });
  }

  try {
    const product = await offMapper.fetchProduct(barcode);
    const dravyas = offMapper.mapToDravyas(product);

    if (dravyas.length === 0) {
      // Fallback: analyze product name directly
      const fallbackD = offMapper.resolve(product.product_name);
      if (fallbackD) dravyas.push(fallbackD);
    }

    const items = dravyas.map((d) => ({
      dravya: d,
      quantity_grams: d.default_serving_grams,
    }));

    const report = evaluateMeal(items);

    return res.json({
      barcode,
      product_name: product.product_name,
      brands: product.brands,
      image_url: product.image_url,
      nova_group: product.nova_group,
      detected_ingredients: dravyas.map((d) => ({
        id: d.id,
        name_common: d.name_common,
        name_sanskrit: d.name_sanskrit,
        category: d.category,
        virya: d.virya,
        vipaka: d.vipaka,
      })),
      compatibility_report: report,
    });
  } catch (err) {
    console.error("Error evaluating Open Food Facts product:", err);
    return res.status(500).json({
      error: "Failed to evaluate Open Food Facts product.",
      details: err.message,
    });
  }
});

/**
 * POST /api/compatibility/benchmark
 * Runs high-speed combinatorial benchmark across 1M+ combinations using O(1) TypedArray matrix
 */
router.post("/benchmark", (req, res) => {
  const count = parseInt(req.body.count || req.query.count || "1000000", 10);
  const result = combinatorialEngine.testBatch(Math.min(count, 10000000));
  return res.json({
    engine: "AyurFood O(1) Matrix Benchmark",
    authoritative_grounding: "NIIMH CCRAS / Charaka Samhita Sutrasthana 26",
    ...result,
  });
});

/**
 * GET /api/compatibility/dravyas
 * Catalog of canonical NIIMH dravyas for search and autocomplete
 */
router.get("/dravyas", (req, res) => {
  return res.json({
    total: CANONICAL_DRAVYAS.length,
    dravyas: CANONICAL_DRAVYAS.map((d) => ({
      id: d.id,
      name_common: d.name_common,
      name_sanskrit: d.name_sanskrit,
      category: d.category,
      rasa: d.rasa,
      virya: d.virya,
      vipaka: d.vipaka,
      charaka_citation: d.charaka_citation,
      openfoodfacts_tags: d.openfoodfacts_tags,
    })),
  });
});

module.exports = router;
