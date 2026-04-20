"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, doc, getDocs, query, updateDoc, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function EditStartupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", tagline: "", desc: "", website: "", linkedin: "" });
  const [id, setId] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, "startups"), where("slug", "==", slug)));
      if (!snap.empty) {
        setId(snap.docs[0].id);
        const data = snap.docs[0].data() as Record<string, string>;
        setForm({ name: data.name ?? "", tagline: data.tagline ?? "", desc: data.desc ?? "", website: data.website ?? "", linkedin: data.linkedin ?? "" });
      }
    })();
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    await updateDoc(doc(db, "startups", id), { ...form, updatedAt: serverTimestamp() });
    router.push(`/startups/${slug}`);
  };

  return <main className="max-w-3xl mx-auto px-8 py-16"><Link href={`/startups/${slug}`} className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to Startup</Link><h1 className="text-4xl font-black text-[#002112] mb-6">Edit Startup</h1><form onSubmit={submit} className="space-y-4 bg-white rounded-2xl p-8 border border-[#dbeee2]"><input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Name" /><input value={form.tagline} onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Tagline" /><textarea value={form.desc} onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-40" placeholder="Description" /><input value={form.website} onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Website" /><input value={form.linkedin} onChange={(e) => setForm((prev) => ({ ...prev, linkedin: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="LinkedIn" /><button className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold">Save Changes</button></form></main>;
}