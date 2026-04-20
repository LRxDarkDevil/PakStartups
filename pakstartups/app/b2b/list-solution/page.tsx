"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function ListSolutionPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ title: "", desc: "", category: "Operations", priceRange: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/auth/signup"); return; }
    setSaving(true);
    await addDoc(collection(db, "b2bSolutions"), {
      title: form.title,
      desc: form.desc,
      category: form.category,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      priceRange: form.priceRange,
      ownerId: user.uid,
      ownerName: profile?.fullName || user.displayName || user.email || "Anonymous",
      icon: "work",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    router.push("/b2b");
  };

  return (
    <main className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/b2b" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to B2B</Link>
      <h1 className="text-4xl font-black text-[#002112] mb-6">List Your Solution</h1>
      <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl p-8 border border-[#dbeee2]">
        <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Solution title" />
        <textarea value={form.desc} onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-40" placeholder="Describe your service" />
        <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Category" />
        <input value={form.priceRange} onChange={(e) => setForm((prev) => ({ ...prev, priceRange: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Price range" />
        <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Tags separated by commas" />
        <button disabled={saving} className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold">{saving ? "Saving…" : "List Solution"}</button>
      </form>
    </main>
  );
}