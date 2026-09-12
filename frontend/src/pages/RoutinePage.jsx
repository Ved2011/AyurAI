import Navbar from "@/components/layout/Navbar";
import DinacharyaPlanner from "@/components/ayur/DinacharyaPlanner";
import Disclaimer from "@/components/ayur/Disclaimer";

export default function RoutinePage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.22em] text-[#4A7C59] font-semibold">Dinacharya Guide</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#2C362F] mt-2">Ayurvedic Daily Routine Planner</h1>
          <p className="text-sm text-[#5C6B61] mt-3">
            In Ayurveda, living in alignment with daily natural cycles (*Dinacharya*) regulates body clocks, harmonizes internal Agni, and prevents metabolic toxin buildup (*Ama*).
          </p>
        </div>

        <DinacharyaPlanner activeDosha="vata" />
        <div className="mt-16">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
