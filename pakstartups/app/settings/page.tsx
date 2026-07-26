"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import {
  REGIONS,
  createCanonicalLocation,
  inferRegionIdFromCity,
  isRegionId,
  type RegionId,
} from "@/lib/location";

const ROLES = ["Founder", "Freelancer", "Student", "Investor", "Mentor", "Tech Lead"];

type SettingsForm = {
  fullName: string;
  bio: string;
  regionId: RegionId | "";
  city: string;
  role: string;
  photoURL: string;
};

type LocationAwareProfile = {
  regionId?: unknown;
  city?: string;
};

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState<SettingsForm>({
    fullName: "",
    bio: "",
    regionId: "",
    city: "",
    role: "",
    photoURL: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!profile) return;

    const locationProfile = profile as typeof profile & LocationAwareProfile;
    const regionId = isRegionId(locationProfile.regionId)
      ? locationProfile.regionId
      : inferRegionIdFromCity(locationProfile.city);

    setForm({
      fullName: profile.fullName || "",
      bio: profile.bio || "",
      regionId,
      city: profile.city || "",
      role: profile.role || "founder",
      photoURL: profile.photoURL || "",
    });
  }, [profile]);

  const set = <K extends keyof SettingsForm>(field: K, value: SettingsForm[K]) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleSave = async () => {
    if (!user) return;
    if (!isRegionId(form.regionId)) {
      setSaveError("Select a valid region before saving.");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const location = createCanonicalLocation({
        regionId: form.regionId,
        city: form.city,
      });

      await updateDoc(doc(db, "users", user.uid), {
        fullName: form.fullName.trim(),
        bio: form.bio.trim(),
        ...location,
        city: location.city ?? "",
        role: form.role.toLowerCase(),
        photoURL: form.photoURL.trim() || null,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
        <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-3">lock</span>
        <p className="text-[#404943] font-medium">Sign in to manage your settings.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Public Profile</h2>
      <p className="text-[#707973] text-sm mb-8">This information is displayed publicly on your profile.</p>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-[#b4ef9d] flex items-center justify-center overflow-hidden">
          {profile?.photoURL
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            : <span className="material-symbols-outlined text-[#0f5238] text-4xl">person</span>
          }
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="avatar-url" className="block text-sm font-medium text-[#404943] mb-2">Avatar URL</label>
        <input
          id="avatar-url"
          value={form.photoURL}
          onChange={(event) => set("photoURL", event.target.value)}
          placeholder="Paste a Cloudinary image URL"
          className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all"
        />
        <p className="text-xs text-[#707973] mt-2">Store your avatar URL in Firestore. Cloudinary links work best.</p>
      </div>

      {saveError && (
        <div role="alert" className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <span className="material-symbols-outlined text-sm">error</span> {saveError}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-[#404943] mb-2">Full Name</label>
          <input
            id="full-name"
            value={form.fullName}
            onChange={(event) => set("fullName", event.target.value)}
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="profile-bio" className="block text-sm font-medium text-[#404943] mb-2">Bio</label>
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={(event) => set("bio", event.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none resize-none transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-region" className="block text-sm font-medium text-[#404943] mb-2">Region</label>
            <select
              id="profile-region"
              value={form.regionId}
              onChange={(event) => set("regionId", event.target.value as RegionId | "")}
              required
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none"
            >
              <option value="">Select region...</option>
              {REGIONS.map((region) => (
                <option key={region.id} value={region.id}>{region.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profile-city" className="block text-sm font-medium text-[#404943] mb-2">City <span className="font-normal text-[#707973]">(optional)</span></label>
            <input
              id="profile-city"
              value={form.city}
              onChange={(event) => set("city", event.target.value)}
              placeholder="e.g. Lahore"
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="primary-role" className="block text-sm font-medium text-[#404943] mb-2">Primary Role</label>
          <select
            id="primary-role"
            value={form.role}
            onChange={(event) => set("role", event.target.value)}
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none"
          >
            {ROLES.map((role) => <option key={role} value={role.toLowerCase()}>{role}</option>)}
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60"
        >
          {saving
            ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : saved
              ? <><span className="material-symbols-outlined text-sm">check</span> Saved!</>
              : "Save Changes"
          }
        </button>
      </div>

      <div className="mt-10 pt-10 border-t border-[#e0e0e0]">
        <h3 className="text-lg font-bold text-[#002112] mb-6">Account Info</h3>
        <div>
          <label htmlFor="account-email" className="block text-sm font-medium text-[#404943] mb-2">Email Address</label>
          <div className="relative">
            <input id="account-email" value={user.email ?? ""} readOnly className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#707973] bg-[#f9f9f9] pr-10 outline-none" />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#0f5238] text-sm">verified</span>
          </div>
          <p className="text-xs text-[#707973] mt-2">Email is verified and tied to your Firebase account.</p>
        </div>
      </div>
    </div>
  );
}
