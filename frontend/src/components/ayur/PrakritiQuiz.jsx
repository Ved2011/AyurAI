import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Wand2, RotateCcw } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const DOSHA_COLOR = { vata: "#D4A373", pitta: "#C8624C", kapha: "#4A7C59" };

export default function PrakritiQuiz({ onResult }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [age, setAge] = useState("");
  const [step, setStep] = useState(0); // 0 = age screen; 1..N = question index; N+1 = finish
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/quiz`)
      .then(({ data }) => setQuestions(data.questions || []))
      .catch(() => toast.error("Could not load quiz questions"));
  }, []);

  const total = questions.length;
  const isAgeStep = step === 0;
  const qIndex = step - 1;
  const q = questions[qIndex];
  const progress = total > 0 ? Math.round((step / (total + 1)) * 100) : 0;

  const select = (dosha) => {
    setAnswers((prev) => ({ ...prev, [q.id]: dosha }));
  };

  const goNext = () => {
    if (isAgeStep) {
      const n = Number(age);
      if (!age || isNaN(n) || n < 1 || n > 120) {
        toast.error("Please enter a valid age (1-120)");
        return;
      }
    } else {
      if (!answers[q.id]) {
        toast.error("Please pick an option");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const reset = () => {
    setAnswers({});
    setAge("");
    setStep(0);
    toast.message("Quiz reset");
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/quiz/analyze`, {
        age: Number(age),
        answers,
      });
      onResult && onResult(data);
      toast.success(`Your Prakriti: ${data.dosha_name}`);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Could not analyze";
      toast.error(typeof msg === "string" ? msg : "Could not analyze");
    } finally {
      setSubmitting(false);
    }
  };

  const atFinish = !isAgeStep && step > total;

  return (
    <div
      data-testid="prakriti-quiz"
      className="mt-10 rounded-3xl bg-white border border-[#E2E4DF] p-6 md:p-10 shadow-[0_20px_50px_-30px_rgba(44,54,47,0.2)]"
    >
      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-1.5 rounded-full bg-[#ECEDE8] overflow-hidden">
          <div
            className="h-full bg-[#4A7C59] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            data-testid="quiz-progress"
          />
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-[#5C6B61] whitespace-nowrap">
          {isAgeStep ? "Start" : atFinish ? "Review" : `Q ${qIndex + 1} / ${total}`}
        </span>
      </div>

      {isAgeStep && (
        <div data-testid="quiz-age-step" className="fade-up">
          <span className="text-xs uppercase tracking-[0.22em] text-[#5C6B61]">Before we begin</span>
          <h3 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
            How many years have you circled the sun?
          </h3>
          <p className="mt-3 text-[#5C6B61] max-w-md">
            Ayurveda reads the body differently at each life-stage. Your age adds a gentle weight to the result.
          </p>
          <input
            data-testid="quiz-age"
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 32"
            className="ayur-focus mt-8 w-full md:w-48 text-4xl font-display bg-transparent border-0 border-b-2 border-[#E2E4DF] pb-2 focus:outline-none focus:border-[#4A7C59] transition-colors"
          />
        </div>
      )}

      {!isAgeStep && !atFinish && q && (
        <div data-testid={`quiz-question-${q.id}`} className="fade-up" key={q.id}>
          <span className="text-xs uppercase tracking-[0.22em] text-[#5C6B61]">
            Question {qIndex + 1}
          </span>
          <h3 className="font-display text-3xl md:text-4xl mt-3 leading-tight">{q.prompt}</h3>
          <div className="mt-8 grid gap-3">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.dosha;
              return (
                <button
                  key={opt.dosha}
                  type="button"
                  data-testid={`quiz-opt-${q.id}-${opt.dosha}`}
                  onClick={() => select(opt.dosha)}
                  className={`text-left rounded-2xl p-5 border transition-all flex items-start gap-4 ${
                    selected
                      ? "bg-[#2C362F] text-white border-[#2C362F] -translate-y-[1px] shadow-md"
                      : "bg-[#ECEDE8] text-[#2C362F] border-[#E2E4DF] hover:border-[#4A7C59] hover:-translate-y-[1px]"
                  }`}
                >
                  <span
                    className="shrink-0 w-2.5 h-2.5 mt-2 rounded-full"
                    style={{ backgroundColor: DOSHA_COLOR[opt.dosha] }}
                  />
                  <span className="text-[15px] leading-relaxed">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {atFinish && (
        <div data-testid="quiz-review" className="fade-up">
          <span className="text-xs uppercase tracking-[0.22em] text-[#5C6B61]">Ready</span>
          <h3 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
            {Object.keys(answers).length} / {total} answered
          </h3>
          <p className="mt-3 text-[#5C6B61] max-w-md">
            Press Reveal my Prakriti to receive your full constitutional reading — herbs and lifestyle rituals tailored to your dominant dosha.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-8 mt-8 border-t border-[#E2E4DF]">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          data-testid="quiz-back"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#2C362F]/20 hover:border-[#2C362F]/50 text-[#2C362F] text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {!atFinish && (
          <button
            type="button"
            onClick={goNext}
            data-testid="quiz-next"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2C362F] hover:bg-[#1f271f] text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
          >
            {isAgeStep ? "Begin quiz" : "Next"} <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {atFinish && (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            data-testid="quiz-submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-4 h-4" />
            {submitting ? "Analyzing…" : "Reveal my Prakriti"}
          </button>
        )}

        <button
          type="button"
          onClick={reset}
          data-testid="quiz-reset"
          className="ml-auto inline-flex items-center gap-2 px-5 py-3 rounded-full text-[#5C6B61] hover:text-[#2C362F] text-sm font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
