"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

type StoryForm = {
  title: string;
  founderName: string;
  startupName: string;
  summary: string;
  challenge: string;
  outcome: string;
};

const initialForm: StoryForm = {
  title: "",
  founderName: "",
  startupName: "",
  summary: "",
  challenge: "",
  outcome: "",
};

export default function SubmitBlogPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<StoryForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => {
    return Object.values(form).every((value) => value.trim().length > 0);
  }, [form]);

  function updateField<K extends keyof StoryForm>(key: K, value: StoryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      router.push("/auth/signup");
      return;
    }

    if (!isValid) return;

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        <div className="bg-[#effcf3] border border-[#cdebd7] rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-black text-[#002112]">Story submitted</h1>
          <p className="mt-3 text-[#404943]">
            Thank you for sharing your journey. Our editorial team will review and get back to you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/blog" className="px-6 py-3 rounded-lg bg-[#0f5238] text-white font-bold hover:bg-[#2d6a4f] transition-all">
              Back to Blog
            </Link>
            <Link href="/dashboard" className="px-6 py-3 rounded-lg border-2 border-[#0f5238] text-[#0f5238] font-bold hover:bg-[#d5fde2] transition-all">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 py-16">
      <Link href="/blog" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">
        ← Back to Blog
      </Link>

      <h1 className="text-4xl font-black text-[#002112]">Submit Success Story</h1>
      <p className="mt-3 text-[#404943]">
        Share lessons, milestones, and outcomes so the community can learn from real founder stories.
      </p>

      {!user && (
        <div className="mt-6 rounded-xl border border-[#f2cf66] bg-[#fff9e6] px-4 py-3 text-sm text-[#5f4a00]">
          You need an account to submit. Continue to sign up when you click submit.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 bg-white border border-[#dbeee2] rounded-2xl p-6 md:p-8">
        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Story title"
          className="w-full border border-[#dbeee2] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5238]"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            value={form.founderName}
            onChange={(e) => updateField("founderName", e.target.value)}
            placeholder="Founder name"
            className="w-full border border-[#dbeee2] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5238]"
          />
          <input
            value={form.startupName}
            onChange={(e) => updateField("startupName", e.target.value)}
            placeholder="Startup name"
            className="w-full border border-[#dbeee2] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5238]"
          />
        </div>

        <textarea
          value={form.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="Brief summary"
          rows={3}
          className="w-full border border-[#dbeee2] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5238]"
        />

        <textarea
          value={form.challenge}
          onChange={(e) => updateField("challenge", e.target.value)}
          placeholder="What was the biggest challenge?"
          rows={4}
          className="w-full border border-[#dbeee2] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5238]"
        />

        <textarea
          value={form.outcome}
          onChange={(e) => updateField("outcome", e.target.value)}
          placeholder="What outcome or result did you achieve?"
          rows={4}
          className="w-full border border-[#dbeee2] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5238]"
        />

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!isValid}
            className="px-6 py-3 rounded-lg bg-[#0f5238] text-white font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Story
          </button>
          <a
            href="mailto:hello@pakstartups.org?subject=PakStartups%20Story%20Submission"
            className="px-6 py-3 rounded-lg border-2 border-[#0f5238] text-[#0f5238] font-bold hover:bg-[#d5fde2] transition-all"
          >
            Submit by Email
          </a>
        </div>
      </form>
    </main>
  );
}
