import axios from "axios";
import { apiUrl } from "@/lib/api";

/**
 * ============================================================================
 * AyurFood Compatibility Client SDK (Native In-Process Engine)
 * ============================================================================
 * Connects the frontend to the native Viruddha Ahara Compatibility Engine
 * grounded in NIIMH CCRAS, Charaka Samhita, and Open Food Facts.
 */

/**
 * Checks compatibility between two food items or ingredients.
 * @param {string} foodA - Name of the first food item (e.g., "Milk", "Honey", "Fish")
 * @param {string} foodB - Name of the second food item (e.g., "Melon", "Ghee", "Curd")
 * @returns {Promise<Object>} Compatibility report with Tridosha karma and violations
 */
export async function checkCompatibility(foodA, foodB) {
  const { data } = await axios.post(apiUrl("/viruddha-check"), { foodA, foodB });
  return data;
}

/**
 * Evaluates an entire packaged food product from Open Food Facts by barcode.
 * Deconstructs ingredients into classical Dravyas and detects internal incompatibilities.
 * 
 * @param {string} barcode - Open Food Facts EAN/UPC barcode
 * @returns {Promise<Object>} Product details and compatibility report
 */
export async function fetchProductByBarcode(barcode) {
  const cleanBarcode = String(barcode).trim();
  const { data } = await axios.get(apiUrl(`/compatibility/product/${cleanBarcode}`));
  return data;
}

/**
 * Evaluates a custom multi-ingredient meal with specific quantities and preparation states.
 * 
 * @param {Array<{name_or_tag: string, quantity_grams?: number}>} items - List of foods
 * @param {boolean} [isHeated=false] - Sanskara Viruddha check (e.g. heated honey)
 * @param {boolean} [isNightTime=false] - Kala Viruddha check (e.g. curd at night)
 * @returns {Promise<Object>} Full report with score, violations, and remediation advice
 */
export async function evaluateMeal(items, isHeated = false, isNightTime = false) {
  const { data } = await axios.post(apiUrl("/compatibility/evaluate"), {
    items,
    is_heated: isHeated,
    is_night_time: isNightTime,
  });
  return data;
}

/**
 * Runs the high-speed combinatorial matrix benchmark.
 * Evaluates millions of random food pairings using the native O(1) TypedArray matrix.
 * 
 * @param {number} [total=1000000] - Total combinatorial pairs to evaluate
 * @returns {Promise<Object>} Benchmark metrics
 */
export async function runBenchmark(total = 1000000) {
  const { data } = await axios.post(apiUrl(`/compatibility/benchmark`), { count: total });
  return data;
}

/**
 * Fetches canonical NIIMH dravyas for search and autocomplete.
 * @returns {Promise<Array>} List of canonical dravyas
 */
export async function getDravyas() {
  const { data } = await axios.get(apiUrl("/compatibility/dravyas"));
  return data;
}
