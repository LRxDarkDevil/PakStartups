"use client";

import { useState } from "react";
import Link from "next/link";

type QuestionType = "text" | "choice" | "rating" | "yesno";

type Question = {
  id: string;
  type: QuestionType;
  text: string;
  choices?: string[];
};

const typeLabels: Record<QuestionType, string> = {
  text: "Short Text",
  choice: "Multiple Choice",
  rating: "Rating (1–5)",
  yesno: "Yes / No",
};

const typeIcons: Record<QuestionType, string> = {
  text: "short_text",
  choice: "list",
  rating: "star",
  yesno: "thumbs_up_down",
};

const uid = () => Math.random().toString(36).slice(2, 9);

export default function SurveyBuilderPage() {
  const [title, setTitle] = useState("My Validation Survey");
  const [questions, setQuestions] = useState<Question[]>([
    { id: uid(), type: "yesno", text: "Would you use this product if it existed today?" },
    { id: uid(), type: "rating", text: "How severe is this problem for you? (1 = not a problem, 5 = urgent)" },
    { id: uid(), type: "text", text: "What is your biggest pain point around this topic?" },
  ]);
  const [newType, setNewType] = useState<QuestionType>("text");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});

  const addQuestion = () => {
    const newQ: Question = {
      id: uid(),
      type: newType,
      text: "Type your question here...",
      choices: newType === "choice" ? ["Option A", "Option B", "Option C"] : undefined,
    };
    setQuestions((qs) => [...qs, newQ]);
    setEditingId(newQ.id);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setQuestions((qs) => {
      const next = [...qs];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/survey/preview?title=${encodeURIComponent(title)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (preview) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-[#002112]">{title}</h1>
          <button onClick={() => setPreview(false)} className="flex items-center gap-2 text-sm font-bold text-[#0f5238] hover:underline">
            <span className="material-symbols-outlined text-base">edit</span> Edit Survey
          </button>
        </div>
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-xl p-6 border border-[#e0e0e0]">
              <p className="font-bold text-[#002112] mb-4">{i + 1}. {q.text}</p>
              {q.type === "text" && (
                <textarea
                  placeholder="Your answer..."
                  value={previewAnswers[q.id] ?? ""}
                  onChange={(e) => setPreviewAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#f5faf6] rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30 resize-none"
                  rows={3}
                />
              )}
              {q.type === "yesno" && (
                <div className="flex gap-3">
                  {["Yes", "No"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setPreviewAnswers((p) => ({ ...p, [q.id]: opt }))}
                      className={`px-8 py-3 rounded-lg font-bold transition-all ${previewAnswers[q.id] === opt ? "bg-[#0f5238] text-white" : "bg-[#f5faf6] text-[#404943] border border-[#e0e0e0] hover:border-[#0f5238]"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === "rating" && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPreviewAnswers((p) => ({ ...p, [q.id]: String(n) }))}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${previewAnswers[q.id] === String(n) ? "bg-[#0f5238] text-white" : "bg-[#f5faf6] text-[#404943] border border-[#e0e0e0] hover:border-[#0f5238]"}`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-xs text-[#707973] self-center ml-2">1 = Poor, 5 = Excellent</span>
                </div>
              )}
              {q.type === "choice" && (
                <div className="space-y-2">
                  {(q.choices ?? []).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setPreviewAnswers((p) => ({ ...p, [q.id]: opt }))}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all font-medium text-sm ${previewAnswers[q.id] === opt ? "border-[#0f5238] bg-[#d5fde2] text-[#0f5238]" : "border-[#e0e0e0] text-[#404943] hover:border-[#0f5238]/50"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <button className="flex-1 py-3 bg-[#0f5238] text-white rounded-xl font-bold hover:bg-[#2d6a4f] transition-all">
            Submit Response
          </button>
        </div>
        <p className="text-center text-xs text-[#707973] mt-4">This is a preview. Responses are not saved.</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-12 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link href="/ideas" className="flex items-center gap-1 text-sm text-[#0f5238] font-bold mb-3 hover:underline">
              <span className="material-symbols-outlined text-base">arrow_back</span> Ideas
            </Link>
            <h1 className="text-4xl font-black text-[#002112] tracking-tight">Survey Builder</h1>
            <p className="text-[#404943] mt-1">Create validation surveys and share with potential users.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPreview(true)} className="flex items-center gap-2 px-5 py-3 border-2 border-[#0f5238] text-[#0f5238] rounded-lg font-bold hover:bg-[#0f5238] hover:text-white transition-all">
              <span className="material-symbols-outlined text-base">visibility</span> Preview
            </button>
            <button onClick={copyLink} className="flex items-center gap-2 px-5 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
              <span className="material-symbols-outlined text-base">{copied ? "check" : "share"}</span>
              {copied ? "Copied!" : "Share Link"}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: survey editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Survey title */}
            <div className="bg-white rounded-xl p-5 border border-[#e0e0e0]">
              <label className="block text-xs font-bold text-[#707973] uppercase tracking-wider mb-2">Survey Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-black text-[#002112] bg-transparent outline-none border-b-2 border-[#e0e0e0] focus:border-[#0f5238] pb-1 transition-colors"
              />
            </div>

            {/* Questions */}
            {questions.map((q, i) => (
              <div key={q.id} className={`bg-white rounded-xl border-2 transition-all ${editingId === q.id ? "border-[#0f5238]" : "border-[#e0e0e0]"}`}>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#d5fde2] rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#0f5238] text-base">{typeIcons[q.type]}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0f5238] uppercase tracking-widest">{typeLabels[q.type]}</span>
                    <span className="ml-auto text-xs text-[#707973]">Q{i + 1}</span>
                  </div>

                  {editingId === q.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                        className="w-full px-3 py-2 bg-[#f5faf6] rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30 resize-none text-[#002112] font-medium"
                        rows={2}
                        autoFocus
                      />
                      {q.type === "choice" && (
                        <div className="space-y-2">
                          {(q.choices ?? []).map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                value={opt}
                                onChange={(e) => {
                                  const newChoices = [...(q.choices ?? [])];
                                  newChoices[oi] = e.target.value;
                                  updateQuestion(q.id, { choices: newChoices });
                                }}
                                className="flex-1 px-3 py-1.5 bg-[#f5faf6] rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30 text-sm"
                              />
                              <button onClick={() => updateQuestion(q.id, { choices: (q.choices ?? []).filter((_, ci) => ci !== oi) })} className="text-red-400 hover:text-red-600">
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          ))}
                          <button onClick={() => updateQuestion(q.id, { choices: [...(q.choices ?? []), `Option ${(q.choices?.length ?? 0) + 1}`] })}
                            className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:underline">
                            <span className="material-symbols-outlined text-xs">add</span> Add option
                          </button>
                        </div>
                      )}
                      <button onClick={() => setEditingId(null)} className="text-xs font-bold text-[#0f5238] hover:underline">Done editing</button>
                    </div>
                  ) : (
                    <p className="text-[#002112] font-medium">{q.text}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 px-5 py-3 bg-[#f9fafb] border-t border-[#e0e0e0] rounded-b-xl">
                  <button onClick={() => setEditingId(editingId === q.id ? null : q.id)} className="text-xs font-bold text-[#404943] flex items-center gap-1 hover:text-[#0f5238]">
                    <span className="material-symbols-outlined text-xs">edit</span> Edit
                  </button>
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-xs font-bold text-[#404943] flex items-center gap-1 hover:text-[#0f5238] disabled:opacity-30">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span> Up
                  </button>
                  <button onClick={() => removeQuestion(q.id)} className="text-xs font-bold text-red-400 flex items-center gap-1 hover:text-red-600 ml-auto">
                    <span className="material-symbols-outlined text-xs">delete</span> Remove
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 bg-[#f5faf6] rounded-xl border border-dashed border-[#bfc9c1]">
                <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">add_circle</span>
                <p className="text-[#707973] font-medium">Add your first question using the panel →</p>
              </div>
            )}
          </div>

          {/* Right: add question panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] sticky top-6">
              <h3 className="font-bold text-[#002112] mb-4">Add Question</h3>
              <div className="space-y-2 mb-4">
                {(["text", "choice", "rating", "yesno"] as QuestionType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${newType === t ? "border-[#0f5238] bg-[#d5fde2]" : "border-[#e0e0e0] hover:border-[#0f5238]/40"}`}
                  >
                    <span className="material-symbols-outlined text-[#0f5238] text-base">{typeIcons[t]}</span>
                    <span className={`text-sm font-bold ${newType === t ? "text-[#0f5238]" : "text-[#404943]"}`}>{typeLabels[t]}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={addQuestion}
                className="w-full py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add</span> Add Question
              </button>

              <div className="mt-6 pt-5 border-t border-[#e0e0e0] space-y-2 text-sm text-[#404943]">
                <p className="font-bold text-[#002112]">Survey Stats</p>
                <div className="flex justify-between">
                  <span>Questions</span>
                  <span className="font-bold text-[#002112]">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. completion</span>
                  <span className="font-bold text-[#002112]">{Math.max(1, Math.ceil(questions.length * 0.5))} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
