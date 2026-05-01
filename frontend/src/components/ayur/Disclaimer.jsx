import { ShieldAlert, Leaf } from "lucide-react";

export default function Disclaimer() {
  return (
    <footer data-testid="disclaimer-section" className="bg-[#2C362F] text-[#E2E4DF] mt-0">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#4A7C59] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </span>
              <span className="font-display text-2xl text-white">AyurAI</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#E2E4DF]/80 max-w-sm">
              Ancient wisdom, surfaced with a modern interface. Made with reverence for the Ayurvedic tradition.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-2xl border border-[#E2E4DF]/15 p-6 md:p-7 bg-white/[0.03]">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-[#D4A373]/20 text-[#D4A373] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#D4A373]">Important disclaimer</div>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#E2E4DF]/90">
                    AyurAI is an educational prototype and <strong>does not constitute medical advice</strong>. The recommendations are rule-based and generalized. Always consult a licensed Ayurvedic practitioner or physician before starting herbs, changing your diet, or if you have any medical condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#E2E4DF]/10 flex flex-wrap gap-3 items-center justify-between text-xs text-[#E2E4DF]/60">
          <span>© {new Date().getFullYear()} AyurAI · A wellness prototype</span>
          <span className="italic font-display">“Balance is not something you find, it's something you create.”</span>
        </div>
      </div>
    </footer>
  );
}
