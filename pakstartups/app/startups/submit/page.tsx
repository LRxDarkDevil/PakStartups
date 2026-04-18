"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

const steps = ["Basic Info", "Team & Stage", "Review", "Done"];
const categories = ["FinTech","AgriTech","HealthTech","EdTech","E-Commerce","SaaS","Logistics","Cleantech","Prop-Tech","HR-Tech","Other"];
const stages = ["Idea","MVP","Growth","Scaling","Profitable"];
const cities = ["Karachi","Lahore","Islamabad","Faisalabad","Rawalpindi","Peshawar","Quetta","Multan","Other"];
const teamSizes = ["1 (Solo Founder)","2–5","6–15","16–50","50+"];

type FormData = {
  name: string;
  tagline: string;
  desc: string;
  category: string;
  city: string;
  website: string;
  stage: string;
  teamSize: string;
  founders: string;
  linkedin: string;
  agreed: boolean;
};

export default function SubmitStartupPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "", tagline: "", desc: "", category: "", city: "",
    website: "", stage: "", teamSize: "1 (Solo Founder)",
    founders: "", linkedin: "", agreed: false,
  });

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !profile) return;
  }, [user, profile]);

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return "Startup name is required.";
      if (!form.tagline.trim()) return "Tagline is required.";
      if (!form.desc.trim() || form.desc.length < 20) return "Description must be at least 20 characters.";
      if (!form.category) return "Please select a category.";
      if (!form.city) return "Please select a city.";
    }
    if (step === 1) {
      if (!form.stage) return "Please select your current stage.";
    }
    if (step === 2) {
      if (!form.agreed) return "You must agree to the Terms of Service.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    if (!user) { router.push("/auth/login"); return; }
    setSubmitting(true);
    setError("");
    try {
      const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await addDoc(collection(db, "startups"), {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        desc: form.desc.trim(),
        category: form.category,
        city: form.city,
        website: form.website.trim(),
        stage: form.stage,
        teamSize: form.teamSize,
        founders: form.founders.split(",").map((f) => f.trim()).filter(Boolean),
        linkedin: form.linkedin.trim(),
        slug,
        ownerId: user.uid,
        ownerName: profile?.fullName || user.displayName || "Anonymous",
        status: "pending", // goes into admin queue
        views: 0,
        logo: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8ffee]">
        <div className="bg-white rounded-2xl p-12 text-center max-w-sm shadow-xl">
          <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-4">lock</span>
          <h2 className="text-2xl font-black text-[#002112] mb-2">Sign In Required</h2>
          <p className="text-[#404943] mb-6">You need to be signed in to submit a startup.</p>
          <Link href="/auth/login" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/startups" className="flex items-center gap-2 text-[#0f5238] font-bold text-sm mb-6 hover:gap-3 transition-all">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Directory
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Submit Your Startup</h1>
          <p className="text-[#404943] text-lg">Get discovered by investors, co-founders, and talent.</p>
        </div>
      </section>

      {/* Step Progress */}
      <div className="bg-white border-b border-[#e0e0e0] px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  i < step ? "bg-[#0f5238] text-white" : i === step ? "bg-[#0f5238] text-white ring-4 ring-[#0f5238]/20" : "bg-[#f0f0f0] text-[#404943]"
                }`}>
                  {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                </div>
                <span className={`text-xs font-bold mt-1 ${i === step ? "text-[#0f5238]" : "text-[#707973]"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${i < step ? "bg-[#0f5238]" : "bg-[#e0e0e0]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            <span className="material-symbols-outlined text-sm">error</span> {error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#002112]">Basic Information</h2>
            <Field label="Startup Name *">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} type="text" placeholder="e.g. PayEasy" className={inp} />
            </Field>
            <Field label="Tagline *">
              <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} type="text" placeholder="One line description" className={inp} />
            </Field>
            <Field label="Description *">
              <textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} rows={4} placeholder="What does your startup do, what problem does it solve?" className={`${inp} resize-none`} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Category *">
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp}>
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="City *">
                <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inp}>
                  <option value="">Select city...</option>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Website URL">
              <input value={form.website} onChange={(e) => set("website", e.target.value)} type="url" placeholder="https://yourstartup.pk" className={inp} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#002112]">Team & Stage</h2>
            <Field label="Current Stage *">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {stages.map((s) => (
                  <button key={s} type="button" onClick={() => set("stage", s)}
                    className={`py-3 rounded-lg font-bold text-sm border-2 transition-all ${form.stage === s ? "bg-[#0f5238] text-white border-[#0f5238]" : "bg-white text-[#404943] border-[#e0e0e0] hover:border-[#0f5238] hover:text-[#0f5238]"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Team Size">
              <select value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} className={inp}>
                {teamSizes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Founders (comma-separated)">
              <input value={form.founders} onChange={(e) => set("founders", e.target.value)} type="text" placeholder="Ahmed Khan, Sara Malik" className={inp} />
            </Field>
            <Field label="LinkedIn Page">
              <input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} type="url" placeholder="https://linkedin.com/company/..." className={inp} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#002112]">Review & Submit</h2>
            <div className="bg-[#d5fde2] rounded-xl p-8 space-y-3">
              {[
                ["Startup Name", form.name || "—"],
                ["Tagline", form.tagline || "—"],
                ["Category", form.category || "—"],
                ["City", form.city || "—"],
                ["Stage", form.stage || "—"],
                ["Team Size", form.teamSize],
                ["Founders", form.founders || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#404943]">{label}</span>
                  <span className="font-bold text-[#002112] text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 bg-[#b7f2a0]/30 rounded-xl p-4">
              <span className="material-symbols-outlined text-[#0f5238] mt-0.5">info</span>
              <p className="text-sm text-[#404943]">Your listing will be reviewed by our team within <strong>48 hours</strong>. You&apos;ll receive an email once approved.</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.agreed} onChange={(e) => set("agreed", e.target.checked)} className="w-5 h-5 rounded text-[#0f5238] focus:ring-[#0f5238]" />
              <span className="text-sm text-[#404943]">I confirm all information is accurate and agree to PakStartups{" "}
                <a href="/terms" className="text-[#0f5238] font-bold hover:underline">Terms of Service</a>.
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#d5fde2] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[#0f5238] text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-[#002112] mb-4">Submission Received!</h2>
            <p className="text-[#404943] mb-8">Our team will review your listing within 48 hours. We&apos;ll notify you by email once it&apos;s live.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/startups" className="bg-[#0f5238] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                View Directory
              </Link>
              <Link href="/dashboard" className="border-2 border-[#0f5238] text-[#0f5238] px-8 py-4 rounded-lg font-bold hover:bg-[#d5fde2] transition-all">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="flex justify-between pt-8">
            <button type="button" onClick={() => { setError(""); setStep(Math.max(0, step - 1)); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold border-2 border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238] transition-all ${step === 0 ? "opacity-30 pointer-events-none" : ""}`}>
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            {step < 2 ? (
              <button type="button" onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (
                  <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                ) : (
                  <>Submit <span className="material-symbols-outlined text-sm">check</span></>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const inp = "w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none text-[#002112] transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
