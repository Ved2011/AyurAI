import { Wind, Flame, Droplet } from "lucide-react";

const DOSHAS = [
  {
    id: "vata",
    name: "Vata",
    element: "Air & Ether",
    color: "#D4A373",
    Icon: Wind,
    desc: "Dry, light, cold, mobile. Governs movement, breath and the nervous system. When excess: anxiety, insomnia, dryness.",
  },
  {
    id: "pitta",
    name: "Pitta",
    element: "Fire & Water",
    color: "#C8624C",
    Icon: Flame,
    desc: "Hot, sharp, intense, oily. Governs digestion, metabolism and transformation. When excess: irritability, inflammation.",
  },
  {
    id: "kapha",
    name: "Kapha",
    element: "Earth & Water",
    color: "#4A7C59",
    Icon: Droplet,
    desc: "Heavy, slow, stable, cool. Governs structure, immunity and lubrication. When excess: sluggishness, congestion.",
  },
];

export default function AboutAyurveda() {
  return (
    <section id="about" data-testid="about-section" className="relative">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <div className="sticky top-24">
              <span className="text-sm uppercase tracking-[0.22em] text-[#5C6B61]">About Ayurveda</span>
              <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
                A 5,000&#8209;year&#8209;old science of living well.
              </h2>
              <p className="mt-5 text-[#5C6B61] leading-relaxed">
                Ayurveda — the "science of life" — teaches that every being is composed of three biological energies called doshas. Knowing your dominant dosha helps you eat, move and rest in ways that preserve balance.
              </p>
              <div className="mt-6 rounded-2xl overflow-hidden border border-[#E2E4DF]">
                <img
                  src="https://images.unsplash.com/photo-1764616683131-862865b9bcf7?auto=format&fit=crop&w=1200&q=80"
                  alt="Ripples on calm water"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            {DOSHAS.map(({ id, name, element, color, Icon, desc }) => (
              <div
                key={id}
                data-testid={`about-${id}`}
                className="rounded-3xl border border-[#E2E4DF] bg-white p-6 md:p-8 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}1A`, color }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="font-display text-3xl" style={{ color }}>{name}</h3>
                      <span className="text-xs uppercase tracking-[0.22em] text-[#5C6B61]">{element}</span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#2C362F]">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
