"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_FILTERS, getSiteFilters, saveSiteFilters } from "@/lib/services/siteConfig";

export default function AdminSiteConfigPage() {
  const [regions, setRegions] = useState(DEFAULT_SITE_FILTERS.regions.join("\n"));
  const [categories, setCategories] = useState(DEFAULT_SITE_FILTERS.categories.join("\n"));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteFilters().then((filters) => {
      setRegions(filters.regions.join("\n"));
      setCategories(filters.categories.join("\n"));
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteFilters({
        regions: regions.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
        categories: categories.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Site Config</h2>
        <p className="text-[#404943] font-medium mt-1">Edit directory regions and categories without touching app code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6">
          <h3 className="font-bold text-[#002112] mb-3">Regions</h3>
          <p className="text-sm text-[#707973] mb-3">Use the approved province and region labels shared across discovery features.</p>
          <textarea aria-label="Directory regions" value={regions} onChange={(e) => setRegions(e.target.value)} rows={12} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg outline-none focus:ring-2 focus:ring-[#0f5238]/30 resize-y" />
        </div>
        <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6">
          <h3 className="font-bold text-[#002112] mb-3">Categories</h3>
          <textarea aria-label="Directory categories" value={categories} onChange={(e) => setCategories(e.target.value)} rows={12} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg outline-none focus:ring-2 focus:ring-[#0f5238]/30 resize-y" />
        </div>
      </div>

      <button onClick={() => void handleSave()} disabled={saving} className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60">
        {saving ? "Saving…" : "Save Config"}
      </button>
    </div>
  );
}
