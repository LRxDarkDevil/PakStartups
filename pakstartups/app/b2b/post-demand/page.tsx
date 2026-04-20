"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function PostDemandPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ title: "", desc: "", category: "Tech & Dev", budget: "", deadline: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/auth/signup"); return; }
    setSaving(true);
    await addDoc(collection(db, "b2bDemands"), {
      title: form.title,
      desc: form.desc,
      category: form.category,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      budget: form.budget,
      deadline: form.deadline,
      ownerId: user.uid,
      ownerName: profile?.fullName || user.displayName || user.email || "Anonymous",
      icon: "storefront",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    router.push("/b2b");
  };

  return (
    <main className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/b2b" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to B2B</Link>
      <h1 className="text-4xl font-black text-[#002112] mb-6">Post a Demand</h1>
      <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl p-8 border border-[#dbeee2]">
        <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Demand title" />
        <textarea value={form.desc} onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-40" placeholder="Describe what you need" />
        <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Category" />
        <div className="grid md:grid-cols-2 gap-4">
          <input value={form.budget} onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Budget" />
          <input value={form.deadline} onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Deadline" />
        </div>
        <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Tags separated by commas" />
        <button disabled={saving} className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold">{saving ? "Saving…" : "Post Demand"}</button>
      </form>
    </main>
  );
}