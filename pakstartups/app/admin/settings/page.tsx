"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_FILTERS, getSiteFilters, saveSiteFilters } from "@/lib/services/siteConfig";
import { TagInput } from "@/components/ui/TagInput";
import { RotateCcw, Check, Save } from "lucide-react";

export default function AdminSiteConfigPage() {
  const [regions, setRegions] = useState<string[]>(DEFAULT_SITE_FILTERS.regions);
  const [categories, setCategories] = useState<string[]>(DEFAULT_SITE_FILTERS.categories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getSiteFilters()
      .then((filters) => {
        setRegions(filters.regions);
        setCategories(filters.categories);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await saveSiteFilters({
        regions,
        categories,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset regions and categories to default values?")) {
      setRegions(DEFAULT_SITE_FILTERS.regions);
      setCategories(DEFAULT_SITE_FILTERS.categories);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Site Config</h2>
          <p className="text-[#404943] font-medium mt-1">
            Edit directory regions and categories without touching app code.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#707973] hover:text-[#002112] bg-white border border-[#e0e0e0] hover:bg-slate-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center text-[#707973] font-medium">
          Loading configuration…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#002112] text-lg">Regions</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0f5238]/10 text-[#0f5238]">
                  {regions.length} {regions.length === 1 ? "region" : "regions"}
                </span>
              </div>
              <p className="text-sm text-[#707973] mb-4">
                Use the approved province and region labels shared across discovery features.
              </p>
              <TagInput
                tags={regions}
                onChange={setRegions}
                placeholder="Add region and press Enter..."
                ariaLabel="Directory regions"
              />
            </div>
            <p className="text-xs text-[#808983]">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">,</kbd> to add tag. You can also paste comma-separated values.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#002112] text-lg">Categories</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0f5238]/10 text-[#0f5238]">
                  {categories.length} {categories.length === 1 ? "category" : "categories"}
                </span>
              </div>
              <p className="text-sm text-[#707973] mb-4">
                Directory category pills shown on search, filter, and startup profile forms.
              </p>
              <TagInput
                tags={categories}
                onChange={setCategories}
                placeholder="Add category and press Enter..."
                ariaLabel="Directory categories"
              />
            </div>
            <p className="text-xs text-[#808983]">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">,</kbd> to add tag. You can also paste comma-separated values.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={() => void handleSave()}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60 shadow-md"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{saving ? "Saving…" : "Save Config"}</span>
            </>
          )}
        </button>

        {savedSuccess && (
          <span className="text-sm font-semibold text-[#0f5238] animate-fadeIn">
            Changes saved to database.
          </span>
        )}
      </div>
    </div>
  );
}

