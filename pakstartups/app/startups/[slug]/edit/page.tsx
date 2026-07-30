"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, doc, getDocs, query, updateDoc, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { createCanonicalLocation, REGIONS, RegionId } from "@/lib/location";
import {
  validateStartupSubmission,
  STARTUP_NAME_MAX_LENGTH,
  STARTUP_DESC_MAX_LENGTH,
} from "@/lib/validations/startup";
import posthog from "posthog-js";

const categories = ["FinTech","AgriTech","HealthTech","EdTech","E-Commerce","SaaS","Logistics","Cleantech","Prop-Tech","HR-Tech","Other"];
const stages = ["Idea","MVP","Growth","Scaling","Profitable"];
const teamSizes = ["1 (Solo Founder)","2–5","6–15","16–50","50+"];

type EditFormData = {
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
};

type StartupDoc = {
  id: string;
  name: string;
  tagline?: string;
  desc: string;
  category: string;
  regionId?: RegionId;
  city?: string;
  website?: string;
  stage: string;
  teamSize?: string;
  founders?: string[];
  linkedin?: string;
  ownerId: string;
  status: "pending" | "approved" | "rejected";
  slug: string;
};

export default function EditStartupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [startup, setStartup] = useState<StartupDoc | null>(null);

  const [form, setForm] = useState<EditFormData>({
    name: "",
    tagline: "",
    desc: "",
    category: "",
    regionId: "",
    city: "",
    website: "",
    stage: "",
    teamSize: "1 (Solo Founder)",
    founders: "",
    linkedin: "",
  });

  const set = (field: keyof EditFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  useEffect(() => {
    async function fetchStartup() {
      try {
        const snap = await getDocs(query(collection(db, "startups"), where("slug", "==", slug)));
        if (!snap.empty) {
          const data = { id: snap.docs[0].id, ...snap.docs[0].data() } as StartupDoc;
          setStartup(data);
          setForm({
            name: data.name ?? "",
            tagline: data.tagline ?? "",
            desc: data.desc ?? "",
            category: data.category ?? "",
            regionId: data.regionId ?? "punjab",
            city: data.city ?? "",
            website: data.website ?? "",
            stage: data.stage ?? "MVP",
            teamSize: data.teamSize ?? "1 (Solo Founder)",
            founders: Array.isArray(data.founders) ? data.founders.join(", ") : "",
            linkedin: data.linkedin ?? "",
          });
        }
      } catch (err) {
        console.error("Error loading startup for editing:", err);
        setError("Failed to load startup details.");
      } finally {
        setLoading(false);
      }
    }
    fetchStartup();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8ffee]">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
          <p className="text-[#404943] text-sm font-bold">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8ffee]">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-xl border border-[#dbeee2]">
          <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-4">search_off</span>
          <h2 className="text-2xl font-black text-[#002112] mb-2">Startup Not Found</h2>
          <p className="text-[#404943] mb-6">The startup you are trying to edit does not exist or has been removed.</p>
          <Link href="/dashboard" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === startup.ownerId;
  const isAdmin = profile?.role === "admin";
  if (!user || (!isOwner && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8ffee]">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-xl border border-red-100">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-4">lock</span>
          <h2 className="text-2xl font-black text-[#002112] mb-2">Access Denied</h2>
          <p className="text-[#404943] mb-6">You do not have permission to edit this startup.</p>
          <Link href="/dashboard" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateStartupSubmission(form);
    if (!validation.valid || !validation.normalizedData) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0] || "Please fix validation errors.";
      setError(firstError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const norm = validation.normalizedData;
      const location = createCanonicalLocation({
        regionId: norm.regionId,
        city: norm.city,
      });

      await updateDoc(doc(db, "startups", startup.id), {
        name: norm.name,
        tagline: norm.tagline,
        desc: norm.desc,
        category: norm.category,
        ...location,
        website: norm.website,
        stage: norm.stage,
        teamSize: norm.teamSize,
        founders: norm.founders,
        linkedin: norm.linkedin,
        updatedAt: serverTimestamp(),
      });

      posthog.capture("startup_edit_succeeded", {
        name_length: norm.name.length,
        desc_length: norm.desc.length,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/startups/${slug}`);
      }, 1500);
    } catch (err: unknown) {
      console.error("Error updating startup:", err);
      const rawMsg = err instanceof Error ? err.message : String(err);
      const isPermissionError = /permission-denied|insufficient permissions/i.test(rawMsg);
      const errorCode = isPermissionError ? "permission-denied" : "update-failed";

      posthog.capture("startup_edit_failed", {
        error_code: errorCode,
        name_length: form.name.trim().length,
        desc_length: form.desc.trim().length,
      });

      if (isPermissionError) {
        setError("Update could not be saved due to invalid data or authorization permissions. Please check your inputs and try again.");
      } else {
        setError("Failed to update startup. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link href={`/startups/${slug}`} className="flex items-center gap-2 text-[#0f5238] font-bold text-sm mb-6 hover:gap-3 transition-all">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Startup
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black text-[#002112] tracking-tight">Edit Startup</h1>
          <p className="text-[#404943] text-sm mt-1">Update details for <strong>{startup.name}</strong>.</p>
        </div>

        <span className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border shadow-sm ${
          startup.status === "pending" ? "bg-amber-50 text-amber-900 border-amber-300" :
          startup.status === "approved" ? "bg-emerald-50 text-emerald-900 border-emerald-300" :
          "bg-red-50 text-red-900 border-red-300"
        }`}>
          Status: {startup.status === "pending" ? "Pending Approval" : startup.status}
        </span>
      </div>

      {/* Status Callout Banner */}
      {startup.status === "pending" && (
        <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 flex items-start gap-4 shadow-sm">
          <span className="material-symbols-outlined text-amber-700 text-2xl mt-0.5">pending_actions</span>
          <div>
            <h3 className="font-bold text-base text-amber-950">Pending Approval</h3>
            <p className="text-amber-900/90 text-sm mt-0.5">
              Your startup request is currently in the review queue. You can edit any details below before or after approval, and your updates will save directly to your submission.
            </p>
          </div>
        </div>
      )}

      {startup.status === "approved" && (
        <div className="mb-8 bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-950 flex items-start gap-4 shadow-sm">
          <span className="material-symbols-outlined text-emerald-700 text-2xl mt-0.5">check_circle</span>
          <div>
            <h3 className="font-bold text-base text-emerald-950">Approved & Live</h3>
            <p className="text-emerald-900/90 text-sm mt-0.5">
              This startup is live in the PakStartups directory. Any changes saved here will be published immediately.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium" role="alert">
          <span className="material-symbols-outlined text-sm">error</span> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium">
          <span className="material-symbols-outlined text-sm">check_circle</span> Changes saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl p-8 border border-[#dbeee2] shadow-sm">
        {/* Section 1: Basic Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-[#002112] border-b border-[#e0e0e0] pb-3">Basic Information</h2>

          <Field
            label="Startup Name *"
            counter={`${form.name.length}/${STARTUP_NAME_MAX_LENGTH}`}
            error={fieldErrors.name}
          >
            <input
              value={form.name}
              maxLength={STARTUP_NAME_MAX_LENGTH}
              onChange={(e) => set("name", e.target.value)}
              type="text"
              className={inp}
              placeholder="e.g. PayEasy"
              aria-invalid={!!fieldErrors.name}
            />
          </Field>

          <Field label="Tagline *" error={fieldErrors.tagline}>
            <input
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              type="text"
              className={inp}
              placeholder="One line description"
              aria-invalid={!!fieldErrors.tagline}
            />
          </Field>

          <Field
            label="Description *"
            counter={`${form.desc.length}/${STARTUP_DESC_MAX_LENGTH}`}
            error={fieldErrors.desc}
          >
            <textarea
              value={form.desc}
              maxLength={STARTUP_DESC_MAX_LENGTH}
              onChange={(e) => set("desc", e.target.value)}
              rows={5}
              className={`${inp} resize-none`}
              placeholder="What does your startup do?"
              aria-invalid={!!fieldErrors.desc}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category *" error={fieldErrors.category}>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp} aria-invalid={!!fieldErrors.category}>
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Region *" error={fieldErrors.regionId}>
              <select value={form.regionId} onChange={(e) => set("regionId", e.target.value)} className={inp} aria-invalid={!!fieldErrors.regionId}>
                <option value="">Select region...</option>
                {REGIONS.map((region) => <option key={region.id} value={region.id}>{region.label}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="City" error={fieldErrors.city}>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} type="text" className={inp} placeholder="e.g. Lahore" />
            </Field>

            <Field label="Website URL" error={fieldErrors.website}>
              <input value={form.website} onChange={(e) => set("website", e.target.value)} type="url" className={inp} placeholder="https://yourstartup.pk" aria-invalid={!!fieldErrors.website} />
            </Field>
          </div>
        </div>

        {/* Section 2: Team & Stage */}
        <div className="space-y-6 pt-4 border-t border-[#e0e0e0]">
          <h2 className="text-xl font-black text-[#002112] border-b border-[#e0e0e0] pb-3">Team & Stage</h2>

          <Field label="Current Stage *" error={fieldErrors.stage}>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {stages.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("stage", s)}
                  className={`py-3 rounded-lg font-bold text-sm border-2 transition-all ${
                    form.stage === s
                      ? "bg-[#0f5238] text-white border-[#0f5238]"
                      : "bg-white text-[#404943] border-[#e0e0e0] hover:border-[#0f5238] hover:text-[#0f5238]"
                  }`}
                >
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
            <input value={form.founders} onChange={(e) => set("founders", e.target.value)} type="text" className={inp} placeholder="Ahmed Khan, Sara Malik" />
          </Field>

          <Field label="LinkedIn Page">
            <input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} type="url" className={inp} placeholder="https://linkedin.com/company/..." />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e0e0e0]">
          <Link
            href={`/startups/${slug}`}
            className="px-6 py-3 rounded-lg font-bold border-2 border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {saving ? (
              <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving Changes…</>
            ) : (
              <>Save Changes <span className="material-symbols-outlined text-sm">check</span></>
            )}
          </button>
        </div>
      </form>
    </main>
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