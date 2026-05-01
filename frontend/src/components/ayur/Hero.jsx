import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero({ onStart }) {
  return (
    <section data-testid="hero-section" className="relative overflow-hidden">
      {/* Subtle texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1673203457013-6fbad33bd9b8?auto=format&fit=crop&w=1800&q=70')" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F9F6F0]/40 to-[#F9F6F0]" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#E2E4DF] text-xs tracking-wider uppercase text-[#5C6B61]">
              <Sparkles className="w-3.5 h-3.5 text-[#4A7C59]" /> Personalised Ayurvedic guidance
            </div>
            <h1 className="fade-up-2 font-display text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight mt-6">
              Listen to the <br />
              <em className="not-italic text-[#4A7C59]">ancient</em> within.
            </h1>
            <p className="fade-up-3 mt-6 max-w-xl text-[#5C6B61] text-lg leading-relaxed">
              AyurAI translates how you feel today into timeless Ayurvedic wisdom — revealing your dominant dosha alongside herbs and lifestyle rituals suited to you.
            </p>
            <div className="fade-up-4 mt-8 flex flex-wrap gap-3">
              <button
                data-testid="hero-cta-primary"
                onClick={onStart}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2C362F] hover:bg-[#1f271f] text-white text-sm font-medium transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Begin your analysis
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#about"
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#2C362F]/20 hover:border-[#2C362F]/50 text-[#2C362F] text-sm font-medium transition-all"
              >
                What is Ayurveda?
              </a>
            </div>
          </div>

          <div className="md:col-span-4 hidden md:block">
            <div className="relative floaty">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#E2E4DF] shadow-[0_30px_60px_-30px_rgba(44,54,47,0.35)]">
                <img
                  src="https://images.unsplash.com/photo-1708667027894-6e9481ae1baf?auto=format&fit=crop&w=900&q=80"
                  alt="Fresh Ayurvedic herbs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 px-5 py-4 rounded-2xl bg-white border border-[#E2E4DF] shadow-lg">
                <div className="text-xs uppercase tracking-[0.18em] text-[#5C6B61]">Three doshas</div>
                <div className="font-display text-xl mt-1">Vata · Pitta · Kapha</div>
              </div>
            </div>
          </div>
        </div>

        {/* stat strip */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-[#E2E4DF] pt-8">
          {[
            { k: "5,000+", v: "Years of tradition" },
            { k: "12", v: "Signals analysed" },
            { k: "3", v: "Dosha archetypes" },
          ].map((s, i) => (
            <div key={i} className="fade-up" style={{ animationDelay: `${0.15 * i}s` }}>
              <div className="font-display text-3xl md:text-4xl">{s.k}</div>
              <div className="text-xs md:text-sm uppercase tracking-[0.18em] text-[#5C6B61] mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
