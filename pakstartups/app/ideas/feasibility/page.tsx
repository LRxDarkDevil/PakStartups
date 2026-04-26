"use client";

import { useState } from "react";
import Link from "next/link";

type Answer = { value: number; label: string };

const questions: { q: string; hint: string; options: Answer[] }[] = [
  {
    q: "What problem are you solving?",
    hint: "Be honest about how painful this problem is for potential customers.",
    options: [
      { value: 3, label: "A critical, urgent pain point people pay to solve today" },
      { value: 2, label: "A real problem but not the top priority for most" },
      { value: 1, label: "A nice-to-have improvement — life works fine without it" },
    ],
  },
  {
    q: "How big is your target market in Pakistan?",
    hint: "Think specifically about who will pay, not just who benefits.",
    options: [
      { value: 3, label: "1 million+ paying customers or large enterprises" },
      { value: 2, label: "100,000 – 1 million potential customers" },
      { value: 1, label: "Under 100,000 — niche but specific" },
    ],
  },
  {
    q: "What does the competitive landscape look like?",
    hint: "No competition might mean no market exists. Too much means tough entry.",
    options: [
      { value: 3, label: "Underserved — few or no direct competitors in Pakistan" },
      { value: 2, label: "Some players but clear room for differentiation" },
      { value: 1, label: "Crowded market with well-funded incumbents" },
    ],
  },
  {
    q: "What is your team's domain expertise?",
    hint: "Investors bet on teams as much as ideas.",
    options: [
      { value: 3, label: "We have deep industry experience and relevant credentials" },
      { value: 2, label: "We understand the space but are learning as we go" },
      { value: 1, label: "This is a new area for us — we're figuring it out" },
    ],
  },
  {
    q: "Have you validated demand with real users?",
    hint: "Surveys, interviews, or paying customers are strong signals.",
    options: [
      { value: 3, label: "Yes — we have paying customers or strong pre-orders" },
      { value: 2, label: "We have conducted interviews and got positive signals" },
      { value: 1, label: "Not yet — we believe there is demand but haven't tested it" },
    ],
  },
  {
    q: "How much capital do you need to reach your first milestone?",
    hint: "Lower capital need = lower risk = faster to validate.",
    options: [
      { value: 3, label: "Under PKR 1 million — we can bootstrap or self-fund" },
      { value: 2, label: "PKR 1M – 10M — manageable with a small round or grant" },
      { value: 1, label: "Over PKR 10M — we need significant external funding upfront" },
    ],
  },
];

type Result = {
  label: string;
  color: string;
  bg: string;
  desc: string;
  actions: string[];
};

function getResult(score: number): Result {
  if (score >= 15) return {
    label: "High Potential",
    color: "text-[#0f5238]",
    bg: "bg-[#d5fde2]",
    desc: "Your idea shows strong fundamentals. You have a real problem, a sizeable market, and evidence of demand. The next step is to build your MVP and start acquiring customers.",
    actions: [
      "Build an MVP with your core value proposition",
      "Set a 90-day goal to acquire your first 10 customers",
      "Start documenting your unit economics early",
      "Explore the B2B Marketplace to find co-founders or partners",
    ],
  };
  if (score >= 10) return {
    label: "Moderate Potential",
    color: "text-amber-700",
    bg: "bg-amber-50",
    desc: "Your idea has promise but needs refinement in a few areas. Before investing more time and money, focus on de-risking the assumptions that scored low.",
    actions: [
      "Run 20+ customer discovery interviews to validate problem severity",
      "Map your competition more deeply to find your differentiation",
      "Consider a pivot or narrow your target segment",
      "Use the Survey Builder to collect structured market feedback",
    ],
  };
  return {
    label: "Needs Refinement",
    color: "text-red-700",
    bg: "bg-red-50",
    desc: "Your idea needs significant work before it is ready to build. This is not a failure — it is the process. Use the resources below to pressure-test your assumptions.",
    actions: [
      "Go back to first principles: who has the most acute pain?",
      "Interview 50 potential customers before writing a single line of code",
      "Study the competitive landscape — look for a niche with less resistance",
      "Read the Learning Guides for problem-solution fit frameworks",
    ],
  };
}

export default function FeasibilityPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const totalScore = answers.reduce((sum, v) => sum + v, 0);
  const result = getResult(totalScore);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setStep("result");
    }
  };

  const reset = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
  };

  if (step === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        <div className="w-16 h-16 bg-[#d5fde2] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[#0f5238] text-3xl">quiz</span>
        </div>
        <h1 className="text-4xl font-black text-[#002112] mb-4">Idea Feasibility Tool</h1>
        <p className="text-[#404943] text-lg leading-relaxed mb-8">
          Answer 6 questions about your startup idea and get an honest assessment of its feasibility, plus actionable next steps.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10 text-center">
          {[["6", "Questions"], ["2 min", "to complete"], ["Free", "Always"]].map(([val, label]) => (
            <div key={label} className="bg-[#f5faf6] rounded-xl p-4 border border-[#e0e0e0]">
              <p className="text-2xl font-black text-[#0f5238]">{val}</p>
              <p className="text-xs font-bold text-[#707973] uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep("quiz")}
          className="px-10 py-4 bg-[#0f5238] text-white rounded-xl font-bold text-lg hover:bg-[#2d6a4f] transition-all shadow-lg shadow-[#0f5238]/20"
        >
          Start Assessment
        </button>
        <p className="mt-4 text-sm text-[#707973]">No account required · Results are not saved</p>
      </div>
    );
  }

  if (step === "quiz") {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-[#707973] mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-[#e0e0e0] rounded-full h-2">
            <div
              className="bg-[#0f5238] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#e0e0e0] shadow-sm">
          <h2 className="text-2xl font-black text-[#002112] mb-2">{q.q}</h2>
          <p className="text-sm text-[#707973] mb-8 italic">{q.hint}</p>

          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelected(opt.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected === opt.value
                    ? "border-[#0f5238] bg-[#d5fde2]"
                    : "border-[#e0e0e0] hover:border-[#0f5238]/40 hover:bg-[#f5faf6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected === opt.value ? "border-[#0f5238] bg-[#0f5238]" : "border-[#bfc9c1]"
                  }`}>
                    {selected === opt.value && (
                      <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    )}
                  </div>
                  <span className={`font-medium text-sm ${selected === opt.value ? "text-[#0f5238] font-bold" : "text-[#404943]"}`}>
                    {opt.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => { if (current > 0) { setCurrent((c) => c - 1); setAnswers((a) => a.slice(0, -1)); setSelected(null); } }}
              disabled={current === 0}
              className="px-5 py-2.5 rounded-lg border border-[#e0e0e0] text-[#404943] font-bold text-sm disabled:opacity-40 hover:border-[#0f5238] transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="px-8 py-2.5 bg-[#0f5238] text-white rounded-lg font-bold text-sm disabled:opacity-40 hover:bg-[#2d6a4f] transition-all"
            >
              {current + 1 === questions.length ? "See Results" : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      {/* Score banner */}
      <div className={`${result.bg} rounded-2xl p-8 mb-8 text-center`}>
        <div className="text-6xl font-black mb-2">
          <span className={result.color}>{totalScore}</span>
          <span className="text-2xl text-[#707973]">/{questions.length * 3}</span>
        </div>
        <h2 className={`text-2xl font-black mb-2 ${result.color}`}>{result.label}</h2>
        <p className="text-[#404943] leading-relaxed max-w-lg mx-auto">{result.desc}</p>
      </div>

      {/* Score breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-[#e0e0e0] mb-6">
        <h3 className="font-bold text-[#002112] mb-4">Your Answers</h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const score = answers[i] ?? 0;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#f5faf6] rounded-full flex items-center justify-center text-xs font-bold text-[#707973] shrink-0">{i + 1}</div>
                <p className="text-sm text-[#404943] flex-1 line-clamp-1">{q.q}</p>
                <div className="flex gap-1 shrink-0">
                  {[1, 2, 3].map((star) => (
                    <div key={star} className={`w-2.5 h-2.5 rounded-full ${score >= star ? "bg-[#0f5238]" : "bg-[#e0e0e0]"}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended actions */}
      <div className="bg-white rounded-2xl p-6 border border-[#e0e0e0] mb-8">
        <h3 className="font-bold text-[#002112] mb-4">Recommended Next Steps</h3>
        <ul className="space-y-3">
          {result.actions.map((action) => (
            <li key={action} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0f5238] text-base mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm text-[#404943]">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={reset} className="px-6 py-3 border-2 border-[#0f5238] text-[#0f5238] rounded-lg font-bold hover:bg-[#0f5238] hover:text-white transition-all">
          Retake Assessment
        </button>
        <Link href="/ideas/survey" className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
          Build a Validation Survey
        </Link>
        <Link href="/ideas" className="px-6 py-3 bg-[#f5faf6] text-[#404943] rounded-lg font-bold hover:bg-[#e8f5ee] transition-all border border-[#e0e0e0]">
          Back to Ideas
        </Link>
      </div>
    </div>
  );
}
