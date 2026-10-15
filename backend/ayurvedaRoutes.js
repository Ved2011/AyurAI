const express = require("express");
const { Pool } = require("pg");
const {
  CANONICAL_DRAVYAS,
  offMapper,
  combinatorialEngine,
  evaluateMeal,
} = require("./services/ayurFoodCompatibilityEngine");

/**
 * Creates and returns the Ayurveda Compatibility Express Router
 * Completely native, in-process, zero Python dependencies.
 * @param {Pool} [injectedPool] - Optional PostgreSQL client pool
 */
function createAyurvedaRouter(injectedPool) {
  const router = express.Router();

  const pool =
    injectedPool ||
    new Pool({
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "Hello@123",
      database: process.env.PGDATABASE || "ayurai",
    });

  // 1. Engine Health Check
  router.get("/health", (req, res) => {
    const mem = process.memoryUsage();
    res.json({
      gateway: "healthy",
      engine: "native_in_process",
      matrix_type: "Uint8Array_Symmetric_O(1)",
      dravya_count: CANONICAL_DRAVYAS.length,
      memory_rss_mb: (mem.rss / (1024 * 1024)).toFixed(2),
      memory_heap_mb: (mem.heapUsed / (1024 * 1024)).toFixed(2),
      scientific_grounding: "NIIMH CCRAS / Charaka Samhita Sutrasthana 26",
      postgres: pool ? "connected" : "fallback",
    });
  });

  // 2. Meal Compatibility Evaluation
  router.post("/evaluate", async (req, res) => {
    try {
      const { items, context = {}, is_heated, is_night_time, save_analysis, user_id } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing or invalid 'items' array." });
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
        });
      }

      const evalOptions = {
        is_heated: Boolean(context.is_heated !== undefined ? context.is_heated : is_heated),
        is_night_time: Boolean(context.is_night_time !== undefined ? context.is_night_time : is_night_time),
        user_dosha: context.user_dosha || null,
      };

      const report = evaluateMeal(resolvedItems, evalOptions);

      // Persist to PostgreSQL analyses table if requested
      const targetUserId = req.user?.id || user_id;
      if (pool && targetUserId && save_analysis !== false) {
        pool
          .query(
            `INSERT INTO analyses (user_id, input_data, result, is_compatible, score)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT DO NOTHING`,
            [
              targetUserId,
              JSON.stringify(items),
              JSON.stringify(report),
              report.is_compatible,
              report.compatibility_score,
            ]
          )
          .catch((err) => console.warn("Analysis DB log bypassed:", err.message));
      }

      return res.json({
        ...report,
        unresolved_items: unresolved.length > 0 ? unresolved : undefined,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to evaluate meal compatibility",
        details: err.message,
      });
    }
  });

  // 3. Barcode Scanner / Open Food Facts Resolution with Postgres Caching
  router.get("/product/:barcode", async (req, res) => {
    try {
      const { barcode } = req.params;
      if (!barcode || !/^\d+$/.test(barcode.trim())) {
        return res.status(400).json({ error: "Invalid barcode parameter." });
      }

      // Check PostgreSQL local cache first
      if (pool) {
        try {
          const cached = await pool.query("SELECT * FROM food_items WHERE id = $1", [barcode]);
          if (cached.rows.length > 0) {
            const item = cached.rows[0];
            const dravya = offMapper.resolve(item.name);
            if (dravya) {
              const report = evaluateMeal([{ dravya, quantity_grams: 100 }]);
              return res.json({
                barcode,
                product_name: item.name,
                compatibility_report: report,
                source: "postgres_cache",
              });
            }
          }
        } catch (dbErr) {
          console.warn("DB cache lookup bypassed:", dbErr.message);
        }
      }

      // Live lookup via Open Food Facts API v2
      const product = await offMapper.fetchProduct(barcode);
      const dravyas = offMapper.mapToDravyas(product);

      if (dravyas.length === 0) {
        const fallbackD = offMapper.resolve(product.product_name);
        if (fallbackD) dravyas.push(fallbackD);
      }

      const items = dravyas.map((d) => ({
        dravya: d,
        quantity_grams: d.default_serving_grams || 100,
      }));

      const report = evaluateMeal(items);

      // Cache product in PostgreSQL food_items
      if (pool && product.product_name) {
        pool
          .query(
            `INSERT INTO food_items (id, name, ingredients_raw)
             VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = CURRENT_TIMESTAMP`,
            [barcode, product.product_name, JSON.stringify(product)]
          )
          .catch(() => {});
      }

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
      res.status(500).json({
        error: "Failed to resolve product barcode",
        details: err.message,
      });
    }
  });

  // 4. High-Speed Combinatorial Benchmark
  router.post("/benchmark", (req, res) => {
    try {
      const total = parseInt(req.query.total || req.body.total || req.body.count || "1000000", 10);
      const benchmark = combinatorialEngine.testBatch(Math.min(total, 10000000));
      res.json({
        engine: "AyurFood O(1) Matrix Benchmark",
        authoritative_grounding: "NIIMH CCRAS / Charaka Samhita Sutrasthana 26",
        ...benchmark,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to run benchmark",
        details: err.message,
      });
    }
  });

  // 5. Canonical Dravyas List
  router.get("/dravyas", (req, res) => {
    res.json({
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

  // 6. Compatibility Route for 2 DB items (legacy & fast lookup)
  router.get("/check-compatibility", async (req, res) => {
    const { item1_id, item2_id } = req.query;

    if (!item1_id || !item2_id) {
      return res.status(400).json({
        error: "Missing required query parameters: 'item1_id' and 'item2_id' are both required.",
      });
    }

    try {
      const query = `
        SELECT id, name, ingredients_raw, potency, tastes, is_dairy, is_fermented, is_nightshade
        FROM food_items
        WHERE id = $1 OR id = $2
        LIMIT 2;
      `;
      const result = await pool.query(query, [String(item1_id), String(item2_id)]);

      if (result.rows.length < 2) {
        return res.status(404).json({
          error: "One or both items not found in food_items table.",
          found_count: result.rows.length,
        });
      }

      const item1 = result.rows.find((r) => r.id === String(item1_id));
      const item2 = result.rows.find((r) => r.id === String(item2_id));

      const dA = offMapper.resolve(item1.name);
      const dB = offMapper.resolve(item2.name);

      if (dA && dB) {
        const report = evaluateMeal([
          { dravya: dA, quantity_grams: 100 },
          { dravya: dB, quantity_grams: 100 },
        ]);
        return res.json({
          compatible: report.is_compatible,
          score: report.compatibility_score,
          composite_status: report.composite_status,
          item1: { id: item1.id, name: item1.name },
          item2: { id: item2.id, name: item2.name },
          warnings: report.violations.map((v) => `${v.sanskrit_rule}: ${v.pathophysiology}`),
          full_report: report,
        });
      }

      // Fallback based on column attributes if not in canonical taxonomy
      const p1 = (item1.potency || "").toLowerCase();
      const p2 = (item2.potency || "").toLowerCase();
      const viryaConflict = (p1 === "hot" && p2 === "cold") || (p1 === "cold" && p2 === "hot");
      const dairyNightshade =
        (item1.is_dairy && item2.is_nightshade) || (item2.is_dairy && item1.is_nightshade);
      const warnings = [];
      if (viryaConflict) warnings.push(`Virya conflict between ${item1.name} and ${item2.name}`);
      if (dairyNightshade)
        warnings.push(`Dairy and nightshade conflict between ${item1.name} and ${item2.name}`);

      return res.json({
        compatible: warnings.length === 0,
        score: warnings.length === 0 ? 100 : 40,
        item1,
        item2,
        warnings,
        source: "attribute_fallback",
      });
    } catch (err) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  });

  return router;
}

module.exports = createAyurvedaRouter;
