import { Trash2 } from "lucide-react";

const COLOR = { vata: "#D4A373", pitta: "#C8624C", kapha: "#4A7C59" };

function fmt(dt) {
  try {
    const d = new Date(dt);
    return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function History({ items, onDelete }) {
  return (
    <section id="history" data-testid="history-section" className="bg-[#ECEDE8]/60 border-y border-[#E2E4DF]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div>
            <span className="text-sm uppercase tracking-[0.22em] text-[#5C6B61]">Your journey</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">Past analyses</h2>
          </div>
          <p className="text-sm text-[#5C6B61] max-w-sm">
            Every analysis is saved here so you can track how your constitution shifts with the seasons.
          </p>
        </div>

        {items.length === 0 ? (
          <div
            data-testid="history-empty"
            className="rounded-3xl bg-white border border-dashed border-[#E2E4DF] p-12 text-center"
          >
            <div className="font-display text-2xl">No readings yet</div>
            <p className="text-sm text-[#5C6B61] mt-2">Run your first analysis above to begin your journal.</p>
          </div>
        ) : (
          <div data-testid="history-list" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                data-testid={`history-item-${it.id}`}
                className="rounded-3xl bg-white border border-[#E2E4DF] p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[#5C6B61]">{fmt(it.created_at)}</div>
                    <div
                      className="font-display text-3xl mt-1"
                      style={{ color: COLOR[it.dosha] }}
                    >
                      {it.dosha_name}
                    </div>
                  </div>
                  <button
                    data-testid={`history-delete-${it.id}`}
                    onClick={() => onDelete(it.id)}
                    aria-label="Delete entry"
                    className="p-2 rounded-full text-[#5C6B61] hover:text-[#B74F3F] hover:bg-[#B74F3F]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-[#5C6B61] mt-3">
                  Age {it.age} · {it.lifestyle}
                </div>
                {it.symptoms.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {it.symptoms.slice(0, 6).map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#ECEDE8] text-[#2C362F] border border-[#E2E4DF]">
                        {s.replace(/_/g, " ")}
                      </span>
                    ))}
                    {it.symptoms.length > 6 && (
                      <span className="text-xs px-2.5 py-1 rounded-full text-[#5C6B61]">+{it.symptoms.length - 6}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
