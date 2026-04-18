"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

const STAGES = ["PROBLEM DEFINED", "VALIDATION STAGE", "SOLUTION MVP", "SCALING"];
const TAGS = ["AI/ML","AgriTech","Blockchain","CleanTech","EdTech","FinTech","HealthTech","Logistics","SaaS","Social Impact","Web3","Other"];

export default function SubmitIdeaPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", desc: "", stage: "", tags: [] as string[] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tag: string) =>
    setForm((p) => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : p.tags.length < 4 ? [...p.tags, tag] : p.tags,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || form.title.length < 5) { setError("Title must be at least 5 characters."); return; }
    if (!form.desc.trim() || form.desc.length < 20) { setError("Description must be at least 20 characters."); return; }
    if (!form.stage) { setError("Please select a stage."); return; }
    if (!user) { router.push("/auth/login"); return; }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "ideas"), {
        title: form.title.trim(),
        desc: form.desc.trim(),
        stage: form.stage,
        tags: form.tags,
        authorId: user.uid,
        authorName: profile?.fullName || user.displayName || "Anonymous",
        authorAvatar: profile?.photoURL || null,
        ownerId: user.uid,
        upvotes: 0,
        comments: 0,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/ideas");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white rounded-2xl p-12 text-center max-w-sm shadow-xl border border-[#e0e0e0]">
          <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-4">lock</span>
          <h2 className="text-2xl font-black text-[#002112] mb-2">Sign In Required</h2>
          <p className="text-[#404943] mb-6">You need to be signed in to submit an idea.</p>
          <Link href="/auth/login" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 px-8 bg-white border-b border-[#e0e0e0]">
        <div className="max-w-2xl mx-auto">
          <Link href="/ideas" className="flex items-center gap-2 text-[#0f5238] font-bold text-sm mb-6 hover:gap-3 transition-all">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Ideas
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Submit an Idea</h1>
          <p className="text-[#404943] text-lg">Share your startup idea with the community and get real feedback.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-sm">error</span> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Idea Title *</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} type="text"
              placeholder="e.g. AI-powered supply chain for Pakistani farmers"
              className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none text-[#002112] transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Description * <span className="text-[#707973] normal-case">(What problem does it solve? Who is the target audience?)</span></label>
            <textarea value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} rows={5}
              placeholder="Describe the problem, your proposed solution, and the target market..."
              className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none text-[#002112] resize-none transition-all" />
            <p className="text-xs text-[#707973] mt-1">{form.desc.length} characters{form.desc.length < 20 ? ` (need ${20 - form.desc.length} more)` : ""}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#404943] mb-3 uppercase tracking-wider">Current Stage *</label>
            <div className="grid grid-cols-2 gap-3">
              {STAGES.map((s) => (
                <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, stage: s }))}
                  className={`py-3 px-4 rounded-lg font-bold text-xs border-2 transition-all text-left ${form.stage === s ? "bg-[#0f5238] text-white border-[#0f5238]" : "bg-white text-[#404943] border-[#e0e0e0] hover:border-[#0f5238] hover:text-[#0f5238]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#404943] mb-3 uppercase tracking-wider">Tags <span className="text-[#707973] normal-case">(select up to 4)</span></label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${form.tags.includes(tag) ? "bg-[#0f5238] text-white border-[#0f5238]" : "bg-white text-[#404943] border-[#e0e0e0] hover:border-[#0f5238]"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/ideas" className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold border-2 border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238] transition-all">
              Cancel
            </Link>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</> : <>Submit Idea <span className="material-symbols-outlined text-sm">lightbulb</span></>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
