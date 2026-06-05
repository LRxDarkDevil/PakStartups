"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { logout } from "@/lib/firebase/auth";

export default function DangerZonePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = () => {
    if (!user) return;
    setExporting(true);
    try {
      const dataToExport = {
        exportedAt: new Date().toISOString(),
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        },
        profile: profile || {},
        instructions: "This is a package of your personal account data on the PakStartups platform.",
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pakstartups-data-export-${user.uid}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
      alert("Failed to export account data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = window.confirm(
      "WARNING: Are you absolutely sure you want to delete your account? This will permanently remove your profile, startups, and data from PakStartups. This action is irreversible."
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      // 1. Delete user profile doc from Firestore
      await deleteDoc(doc(db, "users", user.uid));
      // 2. Sign out the user
      await logout();
      alert("Your account has been successfully deleted.");
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)] border border-red-100">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h2>
      <p className="text-[#707973] text-sm mb-8">Irreversible actions regarding your data and account.</p>

      <div className="space-y-6 max-w-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-red-200 rounded-xl bg-red-50/50 gap-4">
          <div>
            <h4 className="font-bold text-red-700">Export Account Data</h4>
            <p className="text-sm text-red-600/80 mt-1">Download a copy of all your submitted startups, connections, and platform activity in JSON format.</p>
          </div>
          <button
            onClick={handleExportData}
            disabled={exporting || !user}
            className="whitespace-nowrap px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-50 transition-all disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Request Data Export"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-red-200 rounded-xl bg-red-50/50 gap-4">
          <div>
            <h4 className="font-bold text-red-700">Delete Account & Data</h4>
            <p className="text-sm text-red-600/80 mt-1">Permanently remove your personal account and all of its contents from the PakStartups ecosystem. This action is not reversible.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || !user}
            className="whitespace-nowrap px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
