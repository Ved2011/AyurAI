import axios from "axios";
import { apiUrl } from "@/lib/api";

/**
 * ============================================================================
 * AyurFood Compatibility Client SDK
 * ============================================================================
 * Connects the frontend to the NumPy-accelerated Viruddha Ahara Engine &
 * Open Food Facts / NIIMH CCRAS pharmacological intelligence service.
 */

/**
 * Checks compatibility between two food items or ingredients.
 * Leverages the NumPy matrix sidecar when available, with automatic
 * fallback to the embedded classical Ayurvedic rule engine.
 * 
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
  const { data } = await axios.get(apiUrl(`/ayurfood/product/${cleanBarcode}`));
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
  const { data } = await axios.post(apiUrl("/ayurfood/evaluate"), {
    items,
    is_heated: isHeated,
    is_night_time: isNightTime,
  });
  return data;
}

/**
 * Runs the NumPy high-speed combinatorial matrix benchmark.
 * Evaluates millions of random food pairings at vectorized C-speed.
 * 
 * @param {number} [total=100000] - Total combinatorial pairs to evaluate
 * @returns {Promise<{total_tested: number, compatible: number, incompatible: number, duration_seconds: number, throughput_combos_sec: number}>}
 */
export async function runBenchmark(total = 100000) {
  const { data } = await axios.post(apiUrl(`/ayurfood/benchmark?total=${total}`));
  return data;
}

/**
 * Checks connectivity to the AyurFood brain microservice and displays health metadata.
 * @returns {Promise<{gateway: string, ayurfood_service: Object}>}
 */
export async function getAyurFoodHealth() {
  const { data } = await axios.get(apiUrl("/ayurfood/health"));
  return data;
}
