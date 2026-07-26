"use client";

import { useState, useEffect, useRef } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

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

  const handleAvatarFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const res = await uploadToCloudinary(file, { folder: "pakstartups/avatars", maxSizeMB: 5 });
      set("photoURL", res.secureUrl);
      setUploadSuccess("Picture uploaded to Cloudinary! Click 'Save Changes' below to update your profile.");
      setTimeout(() => setUploadSuccess(""), 4000);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image to Cloudinary.");
    } finally {
      setUploadingAvatar(false);
      if (event.target) event.target.value = "";
    }
  };

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

      await setDoc(doc(db, "users", user.uid), {
        fullName: form.fullName.trim(),
        bio: form.bio.trim(),
        ...location,
        city: location.city ?? "",
        role: form.role.toLowerCase(),
        photoURL: form.photoURL.trim() || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
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

  const [avatarImgError, setAvatarImgError] = useState(false);
  const currentAvatarUrl = form.photoURL || profile?.photoURL || user?.photoURL;

  useEffect(() => {
    setAvatarImgError(false);
  }, [currentAvatarUrl]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Public Profile</h2>
      <p className="text-[#707973] text-sm mb-8">This information is displayed publicly on your profile.</p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-[#f8faf9] border border-[#e8f0eb] rounded-2xl">
        <div
          onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
          className="relative w-24 h-24 rounded-full bg-[#b4ef9d] flex items-center justify-center overflow-hidden cursor-pointer group shadow-sm border-2 border-white ring-2 ring-[#0f5238]/20 hover:ring-[#0f5238] transition-all"
          title="Click to change picture"
        >
          {currentAvatarUrl && !avatarImgError
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={currentAvatarUrl} alt="Avatar" referrerPolicy="no-referrer" onError={() => setAvatarImgError(true)} className="w-full h-full object-cover" />
            : <span className="material-symbols-outlined text-[#0f5238] text-5xl">person</span>
          }
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
          </div>
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="flex items-center gap-2 bg-[#0f5238] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#2d6a4f] transition-all shadow-sm disabled:opacity-60"
            >
              {uploadingAvatar ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading to Cloudinary…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  Upload Picture
                </>
              )}
            </button>
            {form.photoURL && (
              <button
                type="button"
                onClick={() => {
                  set("photoURL", "");
                  setUploadSuccess("");
                  setUploadError("");
                }}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition-all"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove Photo
              </button>
            )}
          </div>
          <p className="text-xs text-[#707973]">Supported formats: JPEG, PNG, WebP, GIF (Max 5MB). Automatically uploaded to Cloudinary.</p>
        </div>
      </div>

      {uploadSuccess && (
        <div role="alert" className="mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium">
          <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span> {uploadSuccess}
        </div>
      )}

      {uploadError && (
        <div role="alert" className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          <span className="material-symbols-outlined text-red-600 text-base">error</span> {uploadError}
        </div>
      )}

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
