const express = require("express");
const { Pool } = require("pg");

/**
 * Creates and returns the Ayurveda Compatibility Express Router
 * @param {Pool} [injectedPool] - Optional PostgreSQL client pool
 */
function createAyurvedaRouter(injectedPool) {
  const router = express.Router();

  // Use injected pool or create an internal connection pool
  const pool =
    injectedPool ||
    new Pool({
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "Hello@123",
      database: process.env.PGDATABASE || "ayurai",
    });

  /**
   * Dynamic O(1) Ayurvedic Viruddha Ahara Evaluation Engine
   * Evaluates compatibility at runtime without storing pre-computed combinations.
   */
  function evaluateCompatibility(item1, item2) {
    const warnings = [];

    // 1. Virya Viruddha (Potency Conflict): Hot + Cold
    const p1 = (item1.potency || "").toLowerCase();
    const p2 = (item2.potency || "").toLowerCase();
    if ((p1 === "hot" && p2 === "cold") || (p1 === "cold" && p2 === "hot")) {
      warnings.push(
        `Virya Viruddha (Opposing Potency Conflict): "${item1.name}" (${p1.toUpperCase()} potency) consumed with "${item2.name}" (${p2.toUpperCase()} potency). Consuming contrasting metabolic potencies confuses digestive Agni and precipitates Ama (toxic systemic sludge).`
      );
    }

    // 2. Samyoga Viruddha: Dairy + Nightshade (Solanaceae)
    if (
      (item1.is_dairy && item2.is_nightshade) ||
      (item2.is_dairy && item1.is_nightshade)
    ) {
      const dairyItem = item1.is_dairy ? item1.name : item2.name;
      const nightshadeItem = item1.is_nightshade ? item1.name : item2.name;
      warnings.push(
        `Samyoga Viruddha (Dairy & Nightshade Incompatibility): "${dairyItem}" (dairy) paired with "${nightshadeItem}" (nightshade family). Nightshade solanine alkaloids bind with milk proteins, obstructing cellular Srotas (micro-channels) and provoking Pitta-Kapha skin conditions.`
      );
    }

    // 3. Rasa/Karma Viruddha: Dairy + Sour / Fermented
    const item1Sour = (item1.tastes || "").includes("sour") || item1.is_fermented;
    const item2Sour = (item2.tastes || "").includes("sour") || item2.is_fermented;
    if ((item1.is_dairy && item2Sour) || (item2.is_dairy && item1Sour)) {
      const dairyItem = item1.is_dairy ? item1.name : item2.name;
      const sourItem = item1.is_dairy ? item2.name : item1.name;
      warnings.push(
        `Rasa Viruddha (Dairy & Fermented/Sour Incompatibility): Combining dairy ("${dairyItem}") with sour or fermented substances ("${sourItem}") curdles casein proteins in the stomach, producing toxic metabolic residue.`
      );
    }

    // 4. Matra/Guna Viruddha: Dual Extreme Fermented Foods
    if (item1.is_fermented && item2.is_fermented) {
      warnings.push(
        `Matra/Guna Viruddha (Dual Fermented Conflict): Both "${item1.name}" and "${item2.name}" are fermented. Ingesting multiple fermented foods simultaneously excessively overheats Rakta Dhatu (blood tissue) and irritates digestion.`
      );
    }

    return {
      compatible: warnings.length === 0,
      warnings,
    };
  }

  /**
   * GET /check-compatibility?item1_id=X&item2_id=Y
   * Queries the database for two individual food items and dynamically evaluates compatibility.
   */
  router.get("/check-compatibility", async (req, res) => {
    const { item1_id, item2_id } = req.query;

    if (!item1_id || !item2_id) {
      return res.status(400).json({
        error: "Missing required query parameters: 'item1_id' and 'item2_id' are both required.",
        example: "/api/ayurveda/check-compatibility?item1_id=101&item2_id=202",
      });
    }

    if (item1_id === item2_id) {
      return res.status(400).json({
        error: "Invalid request: item1_id and item2_id cannot be identical.",
      });
    }

    try {
      // Query both items in a single indexed query
      const query = `
        SELECT id, name, ingredients_raw, potency, tastes, is_dairy, is_fermented, is_nightshade
        FROM food_items
        WHERE id = $1 OR id = $2
        LIMIT 2;
      `;
      const result = await pool.query(query, [String(item1_id), String(item2_id)]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Neither item was found in the database.",
          requested_ids: [item1_id, item2_id],
        });
      }

      const item1 = result.rows.find((r) => r.id === String(item1_id));
      const item2 = result.rows.find((r) => r.id === String(item2_id));

      if (!item1) {
        return res.status(404).json({
          error: `Item with id '${item1_id}' was not found in the database.`,
        });
      }

      if (!item2) {
        return res.status(404).json({
          error: `Item with id '${item2_id}' was not found in the database.`,
        });
      }

      // Perform dynamic runtime evaluation (O(1))
      const evaluation = evaluateCompatibility(item1, item2);

      return res.json({
        compatible: evaluation.compatible,
        item1: {
          id: item1.id,
          name: item1.name,
          potency: item1.potency,
          tastes: item1.tastes,
          is_dairy: item1.is_dairy,
          is_fermented: item1.is_fermented,
          is_nightshade: item1.is_nightshade,
        },
        item2: {
          id: item2.id,
          name: item2.name,
          potency: item2.potency,
          tastes: item2.tastes,
          is_dairy: item2.is_dairy,
          is_fermented: item2.is_fermented,
          is_nightshade: item2.is_nightshade,
        },
        warnings: evaluation.warnings,
      });
    } catch (err) {
      console.error("Error evaluating Ayurvedic compatibility:", err);
      return res.status(500).json({
        error: "Internal database error while evaluating compatibility.",
        details: err.message,
      });
    }
  });

  return router;
}

module.exports = createAyurvedaRouter;
