import Navbar from "@/components/layout/Navbar";
import IncompatibleFoodChecker from "@/components/ayur/IncompatibleFoodChecker";
import Disclaimer from "@/components/ayur/Disclaimer";

export default function FoodCheckerPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.22em] text-[#C8624C] font-semibold">Food Synergy & Compatibility</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#2C362F] mt-2">Viruddha Ahara Checker</h1>
          <p className="text-sm text-[#5C6B61] mt-3">
            In Ayurvedic wisdom, combining foods with opposing thermogenic properties or digestive processing speeds leads to metabolic toxins (*Ama*). Use this classical checker before combining ingredients.
          </p>
        </div>

        <IncompatibleFoodChecker />
        <div className="mt-16">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
