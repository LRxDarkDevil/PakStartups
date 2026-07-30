"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { REGIONS, RegionId } from "@/lib/location";
import { submitStartup } from "@/lib/services/startups";
import {
  validateStartupSubmission,
  STARTUP_NAME_MAX_LENGTH,
  STARTUP_DESC_MAX_LENGTH,
} from "@/lib/validations/startup";
import posthog from "posthog-js";
import Link from "next/link";

const steps = ["Basic Info", "Team & Stage", "Review", "Done"];
const categories = ["FinTech","AgriTech","HealthTech","EdTech","E-Commerce","SaaS","Logistics","Cleantech","Prop-Tech","HR-Tech","Other"];
const stages = ["Idea","MVP","Growth","Scaling","Profitable"];
const teamSizes = ["1 (Solo Founder)","2–5","6–15","16–50","50+"];

type FormData = {
  name: string;
  tagline: string;
  desc: string;
  category: string;
  regionId: string;
  city: string;
  website: string;
  stage: string;
  teamSize: string;
  founders: string;
  linkedin: string;
  agreed: boolean;
};

type ExistingStartup = {
  id: string;
  name: string;
  slug: string;
  status: "pending" | "approved" | "rejected";
  category: string;
  stage: string;
};

export default function SubmitStartupPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [existingStartups, setExistingStartups] = useState<ExistingStartup[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "", tagline: "", desc: "", category: "", regionId: "", city: "",
    website: "", stage: "", teamSize: "1 (Solo Founder)",
    founders: "", linkedin: "", agreed: false,
  });

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Check for existing submissions
  useEffect(() => {
    if (!user) return;
    const fetchExisting = async () => {
      try {
        const q = query(collection(db, "startups"), where("ownerId", "==", user.uid));
        const snap = await getDocs(q);
        const startups = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExistingStartup);
        setExistingStartups(startups);
      } catch (err) {
        console.error("Error fetching existing user startups:", err);
      }
    };
    fetchExisting();
  }, [user]);

  const validateCurrentStep = () => {
    const result = validateStartupSubmission(form);
    setFieldErrors(result.errors);

    if (step === 0) {
      if (result.errors.name || result.errors.tagline || result.errors.desc || result.errors.category || result.errors.regionId || result.errors.city || result.errors.website) {
        const firstError = result.errors.name || result.errors.tagline || result.errors.desc || result.errors.category || result.errors.regionId || result.errors.city || result.errors.website;
        return firstError;
      }
    }
    if (step === 1) {
      if (result.errors.stage) return result.errors.stage;
    }
    if (step === 2) {
      if (!form.agreed) return "You must agree to the Terms of Service.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateCurrentStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateCurrentStep();
    if (err) { setError(err); return; }
    if (!user) { router.push("/auth/login"); return; }

    const validation = validateStartupSubmission(form);
    if (!validation.valid || !validation.normalizedData) {
      setError("Please fix all form validation errors before submitting.");
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const norm = validation.normalizedData;
      await submitStartup({
        name: norm.name,
        tagline: norm.tagline,
        desc: norm.desc,
        category: norm.category,
        stage: norm.stage,
        teamSize: norm.teamSize,
        founders: norm.founders,
        linkedin: norm.linkedin,
        website: norm.website,
        city: norm.city,
        regionId: norm.regionId as RegionId,
        slug: norm.slug,
        ownerId: user.uid,
        ownerName: profile?.fullName || user.displayName || "Anonymous",
      });

      posthog.capture("startup_submission_succeeded", {
        name_length: norm.name.length,
        desc_length: norm.desc.length,
      });

      setStep(3);
    } catch (e: unknown) {
      const rawMsg = e instanceof Error ? e.message : String(e);
      const isPermissionError = /permission-denied|insufficient permissions/i.test(rawMsg);
      const errorCode = isPermissionError ? "permission-denied" : "submission-failed";

      posthog.capture("startup_submission_failed", {
        error_code: errorCode,
        name_length: form.name.trim().length,
        desc_length: form.desc.trim().length,
      });

      if (isPermissionError) {
        setError("Submission could not be saved due to invalid data or authorization permissions. Please check your inputs and try again.");
      } else {
        setError("Submission failed. Please check your network connection and try again.");
      }
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

      <div className="max-w-3xl mx-auto px-8 pt-8">
        {/* Existing Submissions Alert Prompt */}
        {existingStartups.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-800 text-2xl">info</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg font-black text-amber-950">Existing Startup Submission Found</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-200 text-amber-900 uppercase tracking-wider">
                    {existingStartups.some((s) => s.status === "pending") ? "Pending Approval" : "Submitted"}
                  </span>
                </div>
                <p className="text-amber-900/90 text-sm mt-1">
                  You already have {existingStartups.length === 1 ? "a startup submission" : `${existingStartups.length} startup submissions`} registered under your account. You can edit your existing submission at any time until or after it is approved.
                </p>
                
                <div className="mt-4 space-y-3">
                  {existingStartups.map((s) => (
                    <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-amber-200 rounded-xl p-4 gap-3 shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#002112] text-base">{s.name}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            s.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                            s.status === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                            "bg-red-100 text-red-800 border border-red-300"
                          }`}>
                            {s.status === "pending" ? "Pending Review" : s.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#707973] mt-0.5">{s.category} · {s.stage}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/startups/${s.slug}`}
                          className="px-4 py-2 text-xs font-bold text-[#0f5238] bg-[#d5fde2] hover:bg-[#b4ef9d] rounded-lg transition-all"
                        >
                          View
                        </Link>
                        <Link
                          href={`/startups/${s.slug}/edit`}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#0f5238] hover:bg-[#2d6a4f] rounded-lg transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span> Edit Submission
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-amber-800/80 italic mt-3">
                  Want to submit another new startup? You can continue filling out the form below.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium" role="alert">
            <span className="material-symbols-outlined text-sm">error</span> {error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#002112]">Basic Information</h2>
            <Field
              label="Startup Name *"
              counter={`${form.name.length}/${STARTUP_NAME_MAX_LENGTH}`}
              error={fieldErrors.name}
            >
              <input
                id="name-input"
                value={form.name}
                maxLength={STARTUP_NAME_MAX_LENGTH}
                onChange={(e) => set("name", e.target.value)}
                type="text"
                placeholder="e.g. PayEasy"
                className={inp}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
            </Field>

            <Field label="Tagline *" error={fieldErrors.tagline}>
              <input
                id="tagline-input"
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                type="text"
                placeholder="One line description"
                className={inp}
                aria-invalid={!!fieldErrors.tagline}
                aria-describedby={fieldErrors.tagline ? "tagline-error" : undefined}
              />
            </Field>

            <Field
              label="Description *"
              counter={`${form.desc.length}/${STARTUP_DESC_MAX_LENGTH}`}
              error={fieldErrors.desc}
            >
              <textarea
                id="desc-input"
                value={form.desc}
                maxLength={STARTUP_DESC_MAX_LENGTH}
                onChange={(e) => set("desc", e.target.value)}
                rows={5}
                placeholder="What does your startup do, what problem does it solve?"
                className={`${inp} resize-none`}
                aria-invalid={!!fieldErrors.desc}
                aria-describedby={fieldErrors.desc ? "desc-error" : undefined}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Category *" error={fieldErrors.category}>
                <select
                  id="category-input"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inp}
                  aria-invalid={!!fieldErrors.category}
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Region *" error={fieldErrors.regionId}>
                <select
                  id="regionId-input"
                  value={form.regionId}
                  onChange={(e) => set("regionId", e.target.value)}
                  className={inp}
                  aria-invalid={!!fieldErrors.regionId}
                >
                  <option value="">Select region...</option>
                  {REGIONS.map((region) => <option key={region.id} value={region.id}>{region.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="City (optional)" error={fieldErrors.city}>
              <input
                id="city-input"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                type="text"
                placeholder="e.g. Lahore"
                className={inp}
              />
            </Field>

            <Field label="Website URL" error={fieldErrors.website}>
              <input
                id="website-input"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                type="url"
                placeholder="https://yourstartup.pk"
                className={inp}
                aria-invalid={!!fieldErrors.website}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#002112]">Team & Stage</h2>
            <Field label="Current Stage *" error={fieldErrors.stage}>
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
                {teamSizes.map((t) => <option key={t} value={t}>{t}</option>)}
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
                ["Region", REGIONS.find((region) => region.id === form.regionId)?.label || "—"],
                ["City", form.city || "Not specified"],
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

function Field({
  label,
  counter,
  error,
  children,
}: {
  label: string;
  counter?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-bold text-[#404943] uppercase tracking-wider">{label}</label>
        {counter && <span className="text-xs text-[#707973] font-medium">{counter}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-600 font-medium mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
