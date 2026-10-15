import { useState } from "react";
import { toast } from "sonner";
import {
  Utensils,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Barcode,
  Cpu,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  checkCompatibility,
  fetchProductByBarcode,
  runBenchmark,
} from "@/lib/ayurfood";

const SAMPLE_PAIRS = [
  { a: "Milk", b: "Apple", label: "Milk + Apple (Fruit & Dairy Curdling)" },
  { a: "Milk", b: "Fish", label: "Milk + Fish (Virya Conflict)" },
  { a: "Milk", b: "Melon", label: "Milk + Melon (Digestion Speed)" },
  { a: "Honey", b: "Ghee", label: "Honey + Ghee (Equal Proportions)" },
  { a: "Milk", b: "Banana", label: "Milk + Banana (Agni & Mucus)" },
  { a: "Yogurt", b: "Fish", label: "Yogurt + Fish (Ushna & Rakta)" },
  { a: "Rice", b: "Ghee", label: "Rice + Ghee (Harmonious Pair)" },
];

const SAMPLE_BARCODES = [
  { code: "3017620422003", name: "Organic Cow Milk" },
  { code: "5201051001023", name: "Greek Yogurt" },
  { code: "8410199001004", name: "Wild Salmon Fillets" },
  { code: "3250390112444", name: "Acacia Honey" },
  { code: "5000157077432", name: "Creamy Tomato Soup (Dairy+Nightshade)" },
];

export default function IncompatibleFoodChecker() {
  const [activeTab, setActiveTab] = useState("pairs"); // 'pairs' | 'barcode' | 'benchmark'
  const [foodA, setFoodA] = useState("");
  const [foodB, setFoodB] = useState("");
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState(null);
  const [productData, setProductData] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePairCheck = async (e) => {
    if (e) e.preventDefault();
    if (!foodA || !foodB) {
      toast.error("Please enter both food items to evaluate.");
      return;
    }
    setLoading(true);
    setProductData(null);
    setBenchmarkData(null);
    try {
      const data = await checkCompatibility(foodA, foodB);
      setResult(data);
    } catch (err) {
      toast.error("Could not complete compatibility check.");
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeCheck = async (e, barcodeValue) => {
    if (e) e.preventDefault();
    const code = barcodeValue || barcode;
    if (!code) {
      toast.error("Please enter a valid product barcode.");
      return;
    }
    setLoading(true);
    setResult(null);
    setBenchmarkData(null);
    try {
      const data = await fetchProductByBarcode(code);
      setProductData(data);
      if (data.compatibility_report) {
        setResult({
          compatible: data.compatibility_report.is_compatible,
          message: data.compatibility_report.is_compatible
            ? `Product "${data.product_name}" ingredients are harmonious under classical rules.`
            : `Product "${data.product_name}" contains incompatible ingredient pairings.`,
          details: data.compatibility_report,
        });
      }
    } catch (err) {
      toast.error("Product lookup failed. Ensure microservice is online.");
    } finally {
      setLoading(false);
    }
  };

  const handleBenchmark = async () => {
    setLoading(true);
    try {
      const data = await runBenchmark(100000);
      setBenchmarkData(data);
      toast.success("Benchmark completed across 100,000 combinations!");
    } catch (err) {
      toast.error("Benchmark failed. Ensure microservice is running.");
    } finally {
      setLoading(false);
    }
  };

  const report = result?.details;

  return (
    <div className="mt-8 rounded-3xl bg-white border border-[#E2E4DF] p-6 md:p-10 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#C8624C]/10 text-[#C8624C] flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display text-2xl text-[#2C362F]">
              Viruddha Ahara Intelligence Engine
            </h3>
            <p className="text-xs text-[#5C6B61]">
              NumPy O(1) Matrix &amp; Open Food Facts Integration Grounded in Charaka Samhita &amp; NIIMH CCRAS.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-[#F4EFE6] p-1 rounded-2xl border border-[#E2E4DF]">
          <button
            type="button"
            onClick={() => setActiveTab("pairs")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "pairs"
                ? "bg-white text-[#2C362F] shadow-xs"
                : "text-[#5C6B61] hover:text-[#2C362F]"
            }`}
          >
            Pairwise Check
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("barcode")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "barcode"
                ? "bg-white text-[#2C362F] shadow-xs"
                : "text-[#5C6B61] hover:text-[#2C362F]"
            }`}
          >
            <Barcode className="w-3.5 h-3.5" /> Barcode Scanner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("benchmark")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "benchmark"
                ? "bg-white text-[#2C362F] shadow-xs"
                : "text-[#5C6B61] hover:text-[#2C362F]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> O(1) Benchmark
          </button>
        </div>
      </div>

      {/* Tab 1: Pairwise Ingredient Evaluation */}
      {activeTab === "pairs" && (
        <div>
          <form onSubmit={handlePairCheck} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={foodA}
              onChange={(e) => setFoodA(e.target.value)}
              placeholder="First Item (e.g. Milk, Honey, Yogurt)"
              className="bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
            />
            <input
              type="text"
              value={foodB}
              onChange={(e) => setFoodB(e.target.value)}
              placeholder="Second Item (e.g. Fish, Ghee, Banana)"
              className="bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2C362F] hover:bg-[#1e2520] text-white rounded-xl font-medium text-sm py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating...
                </>
              ) : (
                <>
                  Evaluate Synergy <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sample Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8A7E]">
              Quick Test:
            </span>
            {SAMPLE_PAIRS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFoodA(p.a);
                  setFoodB(p.b);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#F4EFE6] hover:bg-[#EAE4D7] text-[#2C362F] border border-[#E2E4DF] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Open Food Facts Barcode Inspection */}
      {activeTab === "barcode" && (
        <div>
          <form onSubmit={handleBarcodeCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Barcode className="w-5 h-5 absolute left-3.5 top-3.5 text-[#7A8A7E]" />
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan or enter Open Food Facts Barcode (e.g. 3017620422003)"
                className="w-full bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4A7C59] hover:bg-[#3d6749] text-white rounded-xl font-medium text-sm px-6 py-3 transition-colors disabled:opacity-50"
            >
              {loading ? "Inspecting Barcode..." : "Analyze Product"}
            </button>
          </form>

          {/* Sample Barcode Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8A7E]">
              Sample Products:
            </span>
            {SAMPLE_BARCODES.map((b, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setBarcode(b.code);
                  handleBarcodeCheck(null, b.code);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#F4EFE6] hover:bg-[#EAE4D7] text-[#2C362F] border border-[#E2E4DF] transition-colors"
              >
                {b.name} ({b.code.slice(-5)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: O(1) Matrix Benchmark */}
      {activeTab === "benchmark" && (
        <div className="p-6 rounded-2xl bg-[#F9F6F0] border border-[#E2E4DF]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-base text-[#2C362F] flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#4A7C59]" />
                NumPy Vectorized Combinatorial Matrix
              </h4>
              <p className="text-xs text-[#5C6B61] mt-1 max-w-xl">
                Benchmarks the symmetric 1500x1500 matrix directly in memory. Demonstrates how 100,000 to 1,000,000 random food pairings are evaluated in fractions of a second with zero pre-computed row explosions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBenchmark}
              disabled={loading}
              className="bg-[#2C362F] hover:bg-[#1e2520] text-white rounded-xl font-medium text-sm px-5 py-2.5 transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? "Running 100,000 Pairs..." : "Execute 100K Benchmark"}
            </button>
          </div>

          {benchmarkData && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E2E4DF]">
              <div className="bg-white p-3 rounded-xl border border-[#E2E4DF]">
                <div className="text-[10px] uppercase font-semibold text-[#7A8A7E]">Combinations</div>
                <div className="text-lg font-bold text-[#2C362F]">{benchmarkData.total_tested.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E2E4DF]">
                <div className="text-[10px] uppercase font-semibold text-[#7A8A7E]">Execution Time</div>
                <div className="text-lg font-bold text-[#4A7C59]">{benchmarkData.duration_seconds}s</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E2E4DF]">
                <div className="text-[10px] uppercase font-semibold text-[#7A8A7E]">Throughput</div>
                <div className="text-lg font-bold text-[#2C362F]">
                  {Math.round(benchmarkData.throughput_combos_sec).toLocaleString()} /sec
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E2E4DF]">
                <div className="text-[10px] uppercase font-semibold text-[#7A8A7E]">Viruddha Incompatible</div>
                <div className="text-lg font-bold text-[#C8624C]">{benchmarkData.incompatible.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div
          className={`mt-6 p-6 rounded-2xl border ${
            result.compatible
              ? "bg-[#4A7C59]/10 border-[#4A7C59]/30 text-[#2C362F]"
              : "bg-[#C8624C]/10 border-[#C8624C]/30 text-[#2C362F]"
          }`}
        >
          <div className="flex items-start gap-3">
            {result.compatible ? (
              <CheckCircle2 className="w-6 h-6 text-[#4A7C59] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#C8624C] shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h4 className="font-semibold text-base">
                  {result.compatible ? "Compatible Dietary Combination" : "Viruddha Ahara Warning (Incompatible)!"}
                </h4>
                {report?.compatibility_score !== undefined && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      report.compatibility_score >= 80
                        ? "bg-[#4A7C59]/20 text-[#2C362F]"
                        : "bg-[#C8624C]/20 text-[#8B2C19]"
                    }`}
                  >
                    Synergy Score: {report.compatibility_score}/100
                  </span>
                )}
              </div>
              <p className="text-sm text-[#5C6B61] leading-relaxed">
                {result.warning || result.message}
              </p>

              {/* Tridosha Net Impact */}
              {report?.dosha_impact && (
                <div className="mt-4 pt-3 border-t border-[#E2E4DF] flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold text-[#2C362F] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> Tridosha Karma:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E4DF] text-[#5C6B61]">
                    Vata: {report.dosha_impact.vata > 0 ? `+${report.dosha_impact.vata}` : report.dosha_impact.vata}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E4DF] text-[#5C6B61]">
                    Pitta: {report.dosha_impact.pitta > 0 ? `+${report.dosha_impact.pitta}` : report.dosha_impact.pitta}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E4DF] text-[#5C6B61]">
                    Kapha: {report.dosha_impact.kapha > 0 ? `+${report.dosha_impact.kapha}` : report.dosha_impact.kapha}
                  </span>
                </div>
              )}

              {/* Classical Violations with Sanskrit References */}
              {report?.violations && report.violations.length > 0 && (
                <div className="mt-4 space-y-3">
                  {report.violations.map((v, i) => (
                    <div
                      key={i}
                      className="bg-white/90 p-3.5 rounded-xl border border-[#E2E4DF]/80 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 font-medium text-[#8B2C19] mb-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="italic">{v.sanskrit_rule}</span>
                        <span className="text-[10px] text-[#7A8A7E]">({v.classical_citation})</span>
                      </div>
                      <p className="text-[#5C6B61] mt-0.5">
                        <strong>Pathophysiology:</strong> {v.pathophysiology}
                      </p>
                      {v.clinical_consequence && (
                        <p className="text-[#8B2C19] mt-1">
                          <strong>Clinical Consequence:</strong> {v.clinical_consequence}
                        </p>
                      )}
                      {v.remediation && (
                        <p className="text-[#3A6B48] mt-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 shrink-0" />
                          <strong>Remediation:</strong> {v.remediation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
