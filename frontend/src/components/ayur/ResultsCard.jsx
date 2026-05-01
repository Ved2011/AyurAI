import { Flame, Wind, Droplet, Leaf } from "lucide-react";

const DOSHA_THEME = {
  vata:  { color: "#D4A373", Icon: Wind,    label: "Vata"  },
  pitta: { color: "#C8624C", Icon: Flame,   label: "Pitta" },
  kapha: { color: "#4A7C59", Icon: Droplet, label: "Kapha" },
};

export default function ResultsCard({ result }) {
  const theme = DOSHA_THEME[result.dosha] || DOSHA_THEME.vata;
  const { Icon } = theme;

  return (
    <div data-testid="results-card" className="fade-up">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs uppercase tracking-[0.22em] text-[#5C6B61]">Step 02 — Your reading</span>
        <div className="h-px flex-1 bg-[#E2E4DF]" />
      </div>

      <div className="grid md:grid-cols-12 gap-5">
        {/* Hero dosha tile */}
        <div
          className="md:col-span-7 rounded-3xl p-8 md:p-10 relative overflow-hidden text-white"
          style={{ backgroundColor: theme.color }}
          data-testid="dosha-banner"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.22em] opacity-80">
              {result.element}
            </span>
          </div>
          <div className="mt-6">
            <div className="font-display text-6xl md:text-7xl leading-none" data-testid="dosha-name">
              {result.dosha_name}
            </div>
            <div className="mt-2 text-lg opacity-90 font-display italic">{result.tagline}</div>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed max-w-md opacity-95">
            {result.description}
          </p>

          {/* percentages */}
          <div className="mt-8 space-y-2.5">
            {Object.entries(result.percentages).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <span className="w-14 uppercase tracking-wider opacity-90">{k}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${v}%` }}
                  />
                </div>
                <span className="w-10 text-right tabular-nums">{v}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Herbs tile */}
        <div
          className="md:col-span-5 rounded-3xl p-8 bg-white border border-[#E2E4DF]"
          data-testid="herbs-card"
        >
          <div className="flex items-center gap-2 text-[#5C6B61]">
            <Leaf className="w-4 h-4" style={{ color: theme.color }} />
            <span className="text-xs uppercase tracking-[0.22em]">Recommended herbs</span>
          </div>
          <h3 className="font-display text-3xl mt-3">Nature's pharmacy</h3>
          <ul className="mt-5 divide-y divide-[#E2E4DF]">
            {result.herbs.map((h, i) => (
              <li key={i} className="py-3.5" data-testid={`herb-${i}`}>
                <div className="font-medium text-[#2C362F]">{h.name}</div>
                <div className="text-sm text-[#5C6B61] mt-0.5">{h.benefit}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Lifestyle tile */}
        <div
          className="md:col-span-12 rounded-3xl p-8 md:p-10 bg-[#ECEDE8] border border-[#E2E4DF]"
          data-testid="lifestyle-card"
        >
          <div className="flex items-center gap-2 text-[#5C6B61]">
            <span className="text-xs uppercase tracking-[0.22em]">Lifestyle advice</span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl mt-2">Daily rituals for balance</h3>
          <ol className="mt-6 grid md:grid-cols-2 gap-4">
            {result.lifestyle_advice.map((t, i) => (
              <li key={i} className="flex gap-3" data-testid={`advice-${i}`}>
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: theme.color }}
                >
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-[#2C362F]">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
