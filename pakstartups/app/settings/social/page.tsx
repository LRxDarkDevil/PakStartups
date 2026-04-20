"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function SocialAccountsPage() {
    const { user, profile } = useAuth();
    const [form, setForm] = useState({ linkedin: "", github: "", x: "" });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setForm({
            linkedin: profile?.socialLinks?.linkedin ?? "",
            github: profile?.socialLinks?.github ?? "",
            x: profile?.socialLinks?.x ?? profile?.socialLinks?.twitter ?? "",
        });
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const socialLinks = Object.fromEntries(
                Object.entries(form).filter(([, value]) => value.trim())
            );
            await updateDoc(doc(db, "users", user.uid), {
                socialLinks,
                updatedAt: serverTimestamp(),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } finally {
            setSaving(false);
        }
    };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Social Accounts</h2>
      <p className="text-[#707973] text-sm mb-8">Link your social profiles to build trust within the community.</p>

            <div className="space-y-6 max-w-2xl">
                {[
                    { label: "LinkedIn", key: "linkedin", color: "#0077b5", hint: "https://linkedin.com/in/your-name" },
                    { label: "GitHub", key: "github", color: "#333", hint: "https://github.com/your-handle" },
                    { label: "X (Twitter)", key: "x", color: "#000", hint: "https://x.com/your-handle" },
                ].map((item) => (
                    <div key={item.key} className="p-4 border border-[#bfc9c1] rounded-xl space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: item.color }}>
                                {item.label === "GitHub" ? <span className="material-symbols-outlined">code</span> : item.label === "X (Twitter)" ? "𝕏" : "in"}
                            </div>
                            <div>
                                <h4 className="font-bold text-[#002112]">{item.label}</h4>
                                <p className="text-sm text-[#707973]">Add your public profile link or handle.</p>
                            </div>
                        </div>
                        <input
                            value={form[item.key as keyof typeof form]}
                            onChange={(e) => setForm((prev) => ({ ...prev, [item.key]: e.target.value }))}
                            placeholder={item.hint}
                            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all"
                        />
                    </div>
                ))}

                <button onClick={() => void handleSave()} disabled={saving} className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60">
                    {saved ? "Saved!" : saving ? "Saving…" : "Save Social Links"}
                </button>
            </div>
    </div>
  );
}
