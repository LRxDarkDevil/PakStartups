"use client";

import { useState } from "react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function SecurityPage() {
  const { user } = useAuth();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!user || !user.email) { setError("Not signed in."); return; }
    if (newPw.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setSaving(true);
    try {
      // Re-authenticate first
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setSuccess("Password updated successfully!");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Current password is incorrect.");
      } else {
        setError(msg || "Failed to update password.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Google-signed-in users can't change password this way
  const isGoogleUser = user?.providerData?.some((p) => p.providerId === "google.com");

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Security Settings</h2>
      <p className="text-[#707973] text-sm mb-8">Manage your password and secure your account.</p>

      {isGoogleUser ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600">info</span>
          <div>
            <p className="font-bold text-blue-800">Signed in with Google</p>
            <p className="text-sm text-blue-600 mt-1">Your account password is managed by Google. Visit your Google Account settings to change it.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-sm">error</span> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-[#d5fde2] border border-[#b4ef9d] text-[#0f5238] px-4 py-3 rounded-lg text-sm font-bold">
              <span className="material-symbols-outlined text-sm">check_circle</span> {success}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#404943] mb-2">Current Password</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#404943] mb-2">New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#404943] mb-2">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60">
            {saving ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</> : "Update Password"}
          </button>
        </form>
      )}

      <div className="mt-10 pt-10 border-t border-[#e0e0e0]">
        <h3 className="text-lg font-bold text-[#002112] mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between p-4 border border-[#bfc9c1] rounded-xl bg-[#f9f9f9]">
          <div>
            <h4 className="font-bold text-[#002112]">Authenticator App</h4>
            <p className="text-sm text-[#707973]">Use Google Authenticator or Authy. Coming soon.</p>
          </div>
          <button disabled className="px-4 py-2 border border-[#bfc9c1] text-[#bfc9c1] rounded-lg text-sm font-bold cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
