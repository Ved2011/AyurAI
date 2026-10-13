import { useState } from "react";
import { Clock, Sun, Moon, Sunrise, Sunset } from "lucide-react";

const ROUTINES = {
  vata: [
    { time: "06:00 AM", title: "Brahma Muhurta & Warm Water", desc: "Rise gently, sip 2 cups of warm water to stimulate Apana Vata peristalsis." },
    { time: "06:30 AM", title: "Abhyanga (Warm Sesame Oil Massage)", desc: "Massage body with warm sesame oil to ground dry Vata energy before shower." },
    { time: "07:30 AM", title: "Warm Grounding Breakfast", desc: "Warm cooked oatmeal with cinnamon, almond milk, and ghee." },
    { time: "12:30 PM", title: "Main Meal (Largest Meal)", desc: "Warm, cooked grains, roasted root vegetables, lentils." },
    { time: "06:30 PM", title: "Light Supper & Herbal Tea", desc: "Kitchari or warm vegetable soup followed by Chamomile or Ginger tea." },
    { time: "10:00 PM", title: "Rest & Sleep", desc: "Sleep by 10 PM to allow Vata nervous system deep repair." }
  ],
  pitta: [
    { time: "05:30 AM", title: "Cool Morning Awakening", desc: "Wake during cool early hours. Splash face with cool water or rose water." },
    { time: "07:00 AM", title: "Cooling Breakfast", desc: "Sweet juicy fruits, coconut water, or chia porridge with hemp seeds." },
    { time: "12:00 PM", title: "Peak Agni Lunch", desc: "Cooling greens, quinoa, basmati rice, zucchini, and ghee." },
    { time: "05:30 PM", title: "Moonlight Walk / Moderate Motion", desc: "Relaxing walk near water or green parks; avoid intense midday sun." },
    { time: "07:00 PM", title: "Light Supper", desc: "Steamed vegetables, mung dal soup with fresh coriander." },
    { time: "10:30 PM", title: "Cool Night Rest", desc: "Sleep in a cool, well-ventilated bedroom." }
  ],
  kapha: [
    { time: "05:30 AM", title: "Early Rise before Kapha Hour", desc: "Rise before 6 AM to avoid heavy morning lethargy." },
    { time: "06:15 AM", title: "Dry Brushing (Garshana) & Vigorous Yoga", desc: "Dry body brush towards heart, followed by 20 Sun Salutations." },
    { time: "08:00 AM", title: "Light Spicy Breakfast", desc: "Warm apple cooked with cloves & cinnamon or ginger tea." },
    { time: "01:00 PM", title: "Hearty Spiced Lunch", desc: "Steamed greens, spicy black beans, quinoa with cayenne pepper." },
    { time: "06:30 PM", title: "Very Light Dinner", desc: "Lentil soup with black pepper. Avoid heavy dairy or sweets." },
    { time: "10:00 PM", title: "Rest", desc: "Sleep 6-7 hours maximum; avoid daytime napping." }
  ]
};

export default function DinacharyaPlanner({ activeDosha = "vata" }) {
  const [selectedDosha, setSelectedDosha] = useState(activeDosha.toLowerCase().includes("pitta") ? "pitta" : activeDosha.toLowerCase().includes("kapha") ? "kapha" : "vata");
  const routine = ROUTINES[selectedDosha] || ROUTINES.vata;

  return (
    <div className="mt-10 rounded-3xl bg-white border border-[#E2E4DF] p-6 md:p-10 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl text-[#2C362F]">Dinacharya (Daily Routine) Planner</h3>
          <p className="text-xs text-[#5C6B61]">Classical hour-by-hour Ayurvedic daily schedule aligned with your dosha rhythm.</p>
        </div>

        <div className="flex gap-2">
          {["vata", "pitta", "kapha"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDosha(d)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedDosha === d ? "bg-[#4A7C59] text-white shadow-sm" : "bg-[#ECEDE8] text-[#5C6B61] hover:bg-[#E2E4DF]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {routine.map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#E2E4DF] flex items-start gap-4">
            <span className="w-10 h-10 rounded-xl bg-white border border-[#E2E4DF] text-[#4A7C59] flex items-center justify-center shrink-0 font-mono text-xs font-semibold">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4A7C59]">{item.time}</span>
              <h4 className="font-display text-lg text-[#2C362F] mt-0.5">{item.title}</h4>
              <p className="text-xs text-[#5C6B61] mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
