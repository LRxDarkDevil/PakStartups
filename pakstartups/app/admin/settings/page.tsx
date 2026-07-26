"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_FILTERS, getSiteFilters, saveSiteFilters } from "@/lib/services/siteConfig";
import { TagInput } from "@/components/ui/TagInput";
import { RotateCcw, Check, Save, Pin, Sparkles } from "lucide-react";

export default function AdminSiteConfigPage() {
  const [regions, setRegions] = useState<string[]>(DEFAULT_SITE_FILTERS.regions);
  const [categories, setCategories] = useState<string[]>(DEFAULT_SITE_FILTERS.categories);
  const [pinnedQuickSearch, setPinnedQuickSearch] = useState<string[]>(
    DEFAULT_SITE_FILTERS.pinnedQuickSearch
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getSiteFilters()
      .then((filters) => {
        setRegions(filters.regions);
        setCategories(filters.categories);
        setPinnedQuickSearch(filters.pinnedQuickSearch);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleTogglePin = (tag: string) => {
    setPinnedQuickSearch((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await saveSiteFilters({
        regions,
        categories,
        pinnedQuickSearch,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset regions, categories, and pinned quick search tags to default values?")) {
      setRegions(DEFAULT_SITE_FILTERS.regions);
      setCategories(DEFAULT_SITE_FILTERS.categories);
      setPinnedQuickSearch(DEFAULT_SITE_FILTERS.pinnedQuickSearch);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Site Config</h2>
          <p className="text-[#404943] font-medium mt-1">
            Edit directory regions, categories, and pinned Homepage Quick Search tags without touching app code.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#707973] hover:text-[#002112] bg-white border border-[#e0e0e0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
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
        <div className="space-y-6">
          {/* Main Config Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#002112] text-lg flex items-center gap-2">
                    <span>Regions</span>
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0f5238]/10 text-[#0f5238]">
                    {regions.length} {regions.length === 1 ? "region" : "regions"}
                  </span>
                </div>
                <p className="text-sm text-[#707973] mb-4">
                  Use the approved province and region labels shared across discovery features. Click <Pin className="w-3.5 h-3.5 inline text-amber-600" /> to pin to Homepage Quick Search.
                </p>
                <TagInput
                  tags={regions}
                  onChange={setRegions}
                  pinnedTags={pinnedQuickSearch}
                  onTogglePin={handleTogglePin}
                  placeholder="Add region and press Enter..."
                  ariaLabel="Directory regions"
                />
              </div>
              <p className="text-xs text-[#808983]">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">,</kbd> to add tag.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#002112] text-lg flex items-center gap-2">
                    <span>Categories</span>
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0f5238]/10 text-[#0f5238]">
                    {categories.length} {categories.length === 1 ? "category" : "categories"}
                  </span>
                </div>
                <p className="text-sm text-[#707973] mb-4">
                  Directory category pills shown on search, filter, and startup forms. Click <Pin className="w-3.5 h-3.5 inline text-amber-600" /> to pin to Homepage Quick Search.
                </p>
                <TagInput
                  tags={categories}
                  onChange={setCategories}
                  pinnedTags={pinnedQuickSearch}
                  onTogglePin={handleTogglePin}
                  placeholder="Add category and press Enter..."
                  ariaLabel="Directory categories"
                />
              </div>
              <p className="text-xs text-[#808983]">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">,</kbd> to add tag.
              </p>
            </div>
          </div>

          {/* Pinned Homepage Quick Search Chips Card */}
          <div className="bg-gradient-to-r from-amber-50/60 via-white to-emerald-50/40 rounded-xl border border-amber-300/60 p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-[#002112] text-lg flex items-center gap-2">
                  <Pin className="w-4 h-4 text-amber-600 fill-amber-500 rotate-45" />
                  <span>Homepage Quick Search Pinned Chips</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900 uppercase">
                    Live on Homepage
                  </span>
                </h3>
                <p className="text-sm text-[#505953] mt-1">
                  These tags appear under <strong className="text-[#002112]">QUICK SEARCH:</strong> on the Homepage Hero search box. Click 📌 on any tag above or add custom search terms below.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {pinnedQuickSearch.length} Pinned
              </span>
            </div>

            <TagInput
              tags={pinnedQuickSearch}
              onChange={setPinnedQuickSearch}
              pinnedTags={pinnedQuickSearch}
              onTogglePin={handleTogglePin}
              placeholder="Add custom quick search term (e.g. Pre-Seed, Lahore)..."
              ariaLabel="Pinned quick search chips"
            />

            {/* Live Preview Bar */}
            <div className="p-3 bg-white/80 rounded-lg border border-emerald-900/10 flex flex-wrap items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0f5238] shrink-0" />
              <span className="text-xs font-bold text-[#606d64] uppercase tracking-wider">
                Homepage Quick Search Preview:
              </span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {pinnedQuickSearch.length === 0 ? (
                  <span className="text-xs text-gray-400 font-medium italic">No tags pinned yet.</span>
                ) : (
                  pinnedQuickSearch.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0f5238]/10 text-[#0f5238] border border-[#0f5238]/20"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={() => void handleSave()}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all disabled:opacity-60 shadow-md cursor-pointer"
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
            Changes saved to database and live across the site.
          </span>
        )}
      </div>
    </div>
  );
}

