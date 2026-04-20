"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function PrivacyPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ profileVisibility: "Public", emailVisibility: "Hidden" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      profileVisibility: profile?.privacyPrefs?.profileVisibility ?? "Public",
      emailVisibility: profile?.privacyPrefs?.emailVisibility ?? "Hidden",
    });
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        privacyPrefs: form,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Privacy & Visibility</h2>
      <p className="text-[#707973] text-sm mb-8">Control who can see your profile and activity across the ecosystem.</p>

      <div className="space-y-6 max-w-2xl">
        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Profile Visibility</h4>
                <p className="text-sm text-[#707973]">Make your profile discoverable in the Co-Founder match directory.</p>
            </div>
            <select value={form.profileVisibility} onChange={(e) => setForm((prev) => ({ ...prev, profileVisibility: e.target.value }))} className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-[#002112] font-semibold focus:ring-2 focus:ring-[#0f5238]/40 outline-none">
                <option>Public</option>
                <option>Platform Members Only</option>
                <option>Private</option>
            </select>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Show Email Address</h4>
                <p className="text-sm text-[#707973]">Allow other users to see your email address on your profile page.</p>
            </div>
            <select value={form.emailVisibility} onChange={(e) => setForm((prev) => ({ ...prev, emailVisibility: e.target.value }))} className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-[#002112] font-semibold focus:ring-2 focus:ring-[#0f5238]/40 outline-none">
                <option>Hidden</option>
                <option>Visible to Connections</option>
                <option>Public</option>
            </select>
        </div>

        <div className="pt-4">
            <button onClick={() => void handleSave()} disabled={saving} className="bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60">
            {saving ? "Saving…" : "Save Privacy Settings"}
            </button>
        </div>
      </div>
    </div>
  );
}
