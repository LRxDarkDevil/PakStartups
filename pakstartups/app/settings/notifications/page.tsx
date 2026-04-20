"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function NotificationsPage() {
  const { user, profile } = useAuth();
  const [prefs, setPrefs] = useState({ email: true, matches: true, b2b: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrefs({
      email: profile?.notificationPrefs?.email ?? true,
      matches: profile?.notificationPrefs?.matches ?? true,
      b2b: profile?.notificationPrefs?.b2b ?? false,
    });
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        notificationPrefs: prefs,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Notifications & Alerts</h2>
      <p className="text-[#707973] text-sm mb-8">Choose what you want to be notified about.</p>

      <div className="space-y-6">
        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Email Notifications</h4>
                <p className="text-sm text-[#707973]">Receive daily digests and important platform announcements.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={prefs.email} onChange={(e) => setPrefs((prev) => ({ ...prev, email: e.target.checked }))} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5238]"></div>
            </label>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Co-Founder Match Alerts</h4>
                <p className="text-sm text-[#707973]">Get notified immediately when someone requests to connect with you.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={prefs.matches} onChange={(e) => setPrefs((prev) => ({ ...prev, matches: e.target.checked }))} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5238]"></div>
            </label>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">B2B Marketplace Matches</h4>
                <p className="text-sm text-[#707973]">Weekly summary of demands or solutions that match your skills.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={prefs.b2b} onChange={(e) => setPrefs((prev) => ({ ...prev, b2b: e.target.checked }))} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5238]"></div>
            </label>
        </div>

        <button onClick={() => void handleSave()} disabled={saving} className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60">
          {saving ? "Saving…" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
