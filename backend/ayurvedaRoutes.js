const express = require("express");
const http = require("http");
const { Pool } = require("pg");

const AYURFOOD_SERVICE_URL = process.env.AYURFOOD_SERVICE_URL || "http://127.0.0.1:8000";

// HTTP Agent with keep-alive for low-latency microservice requests
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });

/**
 * Creates and returns the Ayurveda Compatibility Express Router
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

  // Helper for microservice fetch with timeout
  async function callMicroservice(endpoint, options = {}) {
    const url = `${AYURFOOD_SERVICE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...options.headers },
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const errText = await res.text();
        const error = new Error(`AyurFood Engine Error (${res.status}): ${errText}`);
        error.status = res.status;
        throw error;
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  // 1. Health check
  router.get("/health", async (req, res) => {
    try {
      const health = await callMicroservice("/api/v1/health");
      res.json({
        gateway: "healthy",
        microservice: health,
        postgres: pool ? "connected" : "fallback",
      });
    } catch (err) {
      res.status(502).json({
        gateway: "degraded",
        microservice_status: "offline",
        message: "Python AyurFood brain microservice is unreachable at " + AYURFOOD_SERVICE_URL,
        error: err.message,
      });
    }
  });

  // 2. Meal Compatibility Evaluation (NumPy O(1) Matrix)
  router.post("/evaluate", async (req, res) => {
    try {
      const { items, is_heated, is_night_time, save_analysis, user_id } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing or invalid 'items' array." });
      }

      // Call Python engine
      const report = await callMicroservice("/api/v1/compatibility/evaluate", {
        method: "POST",
        body: JSON.stringify({
          items,
          is_heated: !!is_heated,
          is_night_time: !!is_night_time,
        }),
      });

      // Persist to PostgreSQL analyses table if requested
      const targetUserId = req.user?.id || user_id;
      if (pool && targetUserId && save_analysis !== false) {
        pool
          .query(
            `INSERT INTO analyses (user_id, input_data, result, is_compatible, score)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT DO NOTHING`,
            [targetUserId, JSON.stringify(items), JSON.stringify(report), report.is_compatible, report.compatibility_score]
          )
          .catch((err) => console.warn("Analysis DB log bypassed:", err.message));
      }

      res.json(report);
    } catch (err) {
      res.status(err.status || 500).json({
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
            const report = await callMicroservice("/api/v1/compatibility/evaluate", {
              method: "POST",
              body: JSON.stringify({
                items: [{ name_or_tag: item.name, quantity_grams: 100 }],
              }),
            });
            return res.json({
              barcode,
              product_name: item.name,
              compatibility_report: report,
              source: "postgres_cache",
            });
          }
        } catch (dbErr) {
          console.warn("DB cache lookup bypassed:", dbErr.message);
        }
      }

      // Fallback to Open Food Facts live lookup in microservice
      const productReport = await callMicroservice(
        `/api/v1/compatibility/product/${encodeURIComponent(barcode)}`
      );

      // Cache product in PostgreSQL food_items
      if (pool && productReport.product_name) {
        pool
          .query(
            `INSERT INTO food_items (id, name, ingredients_raw)
             VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = CURRENT_TIMESTAMP`,
            [barcode, productReport.product_name, JSON.stringify(productReport)]
          )
          .catch(() => {});
      }

      res.json(productReport);
    } catch (err) {
      res.status(err.status || 500).json({
        error: "Failed to resolve product barcode",
        details: err.message,
      });
    }
  });

  // 4. High-Speed Combinatorial Benchmark
  router.post("/benchmark", async (req, res) => {
    try {
      const total = parseInt(req.query.total || req.body.total || "1000000", 10);
      const benchmark = await callMicroservice(
        `/api/v1/combinations/benchmark?total=${total}`,
        { method: "POST" }
      );
      res.json(benchmark);
    } catch (err) {
      res.status(err.status || 500).json({
        error: "Failed to run benchmark",
        details: err.message,
      });
    }
  });

  // 5. Compatibility Route for 2 DB items (legacy & fast lookup)
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

      // Delegate to Python brain for rich canonical evaluation
      try {
        const report = await callMicroservice("/api/v1/compatibility/evaluate", {
          method: "POST",
          body: JSON.stringify({
            items: [
              { name_or_tag: item1.name, quantity_grams: 100 },
              { name_or_tag: item2.name, quantity_grams: 100 },
            ],
          }),
        });
        return res.json({
          compatible: report.is_compatible,
          score: report.compatibility_score,
          composite_status: report.composite_status,
          item1: { id: item1.id, name: item1.name },
          item2: { id: item2.id, name: item2.name },
          warnings: report.violations.map((v) => `${v.sanskrit_rule}: ${v.pathophysiology}`),
          full_report: report,
        });
      } catch (microErr) {
        // In-memory fallback if microservice is temporarily down
        const p1 = (item1.potency || "").toLowerCase();
        const p2 = (item2.potency || "").toLowerCase();
        const viryaConflict = (p1 === "hot" && p2 === "cold") || (p1 === "cold" && p2 === "hot");
        const dairyNightshade = (item1.is_dairy && item2.is_nightshade) || (item2.is_dairy && item1.is_nightshade);
        const warnings = [];
        if (viryaConflict) warnings.push(`Virya conflict between ${item1.name} and ${item2.name}`);
        if (dairyNightshade) warnings.push(`Dairy and nightshade conflict between ${item1.name} and ${item2.name}`);

        return res.json({
          compatible: warnings.length === 0,
          item1,
          item2,
          warnings,
          source: "fallback_engine",
        });
      }
    } catch (err) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  });

  return router;
}

module.exports = createAyurvedaRouter;
