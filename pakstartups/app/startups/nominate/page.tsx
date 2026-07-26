"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { nominateStartup, type StartupNomination } from "@/lib/services/startups";

export default function NominateStartupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startupName: "",
    website: "",
    category: "Fintech",
    city: "Lahore",
    description: "",
    nominatorName: "",
    nominatorEmail: "",
    relationship: "Community Member" as StartupNomination["relationship"],
    evidenceUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startupName.trim() || !formData.website.trim() || !formData.nominatorEmail.trim()) {
      setError("Please fill in all required fields (Startup Name, Website, and Email).");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await nominateStartup(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit nomination. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-[#d5fde2] rounded-full flex items-center justify-center mx-auto mb-6 text-[#0f5238]">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h1 className="text-3xl font-black text-[#002112] mb-3">Nomination Received!</h1>
        <p className="text-[#404943] text-lg mb-8">
          Thank you for helping grow Pakistan&apos;s startup ecosystem. Our curation team will review the details and reach out to the founders to claim their listing.
        </p>
        <Link href="/startups" className="bg-[#0f5238] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2d6a4f] transition-all">
          Back to Directory
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/startups" className="text-sm font-bold text-[#0f5238] hover:underline flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to Directory
        </Link>
        <h1 className="text-4xl font-black tracking-tight text-[#002112] mb-2">Nominate a Startup</h1>
        <p className="text-[#404943] text-base">
          Know an impressive Pakistani startup that isn&apos;t listed yet? Nominate them below for inclusion in our directory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e0e0e0] rounded-2xl p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[#002112] mb-2">Startup Name *</label>
          <input
            type="text"
            required
            value={formData.startupName}
            onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
            placeholder="e.g. PayEasy"
            className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#002112] mb-2">Website or Social Link *</label>
            <input
              type="url"
              required
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://..."
              className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#002112] mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
            >
              {["Fintech", "Agritech", "AI & SaaS", "E-commerce", "Healthtech", "Logistics", "Edtech", "Other"].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#002112] mb-2">Short Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of what this startup builds or provides..."
            className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
          />
        </div>

        <hr className="border-gray-200 my-6" />

        <h3 className="font-bold text-[#002112] text-lg">Your Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#002112] mb-2">Your Name</label>
            <input
              type="text"
              value={formData.nominatorName}
              onChange={(e) => setFormData({ ...formData, nominatorName: e.target.value })}
              placeholder="Your full name"
              className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#002112] mb-2">Your Email *</label>
            <input
              type="email"
              required
              value={formData.nominatorEmail}
              onChange={(e) => setFormData({ ...formData, nominatorEmail: e.target.value })}
              placeholder="you@example.com"
              className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#002112] mb-2">Your Relationship to Startup</label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value as StartupNomination["relationship"] })}
            className="w-full p-3 border border-[#bfc9c1] rounded-xl outline-none focus:border-[#0f5238]"
          >
            {["Community Member", "Customer", "Investor", "Employee", "Other"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-[#0f5238] hover:bg-[#2d6a4f] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Submitting Nomination..." : "Submit Nomination"}
        </button>
      </form>
    </main>
  );
}
