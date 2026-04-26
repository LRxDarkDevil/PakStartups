"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getKnowledgeResources, type KnowledgeResource } from "@/lib/services/knowledge";

const CATEGORIES = ["All", "Legal", "Finance", "Marketing", "Product", "Team"];

const levelColors: Record<string, string> = {
  Beginner: "bg-[#d5fde2] text-[#0f5238]",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-purple-100 text-purple-800",
};

export default function KnowledgeGuidesPage() {
  const [guides, setGuides] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getKnowledgeResources("guide")
      .then(setGuides)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = guides.filter((g) => {
    const catMatch = activeCategory === "All" || g.category === activeCategory;
    const q = search.trim().toLowerCase();
    const textMatch = !q || [g.title, g.desc, g.category].join(" ").toLowerCase().includes(q);
    return catMatch && textMatch;
  });

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/knowledge" className="flex items-center gap-1 text-sm text-[#0f5238] font-bold mb-4 hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span> Knowledge Hub
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Learning Guides</h1>
          <p className="text-[#404943] text-lg max-w-2xl">
            Founder playbooks, registration checklists, and practical guides for building in Pakistan.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-sm">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0f5238] text-white"
                    : "bg-white border border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-[#e0e0e0]">
                <div className="w-10 h-10 bg-[#e0e0e0] rounded-lg mb-4" />
                <div className="h-5 bg-[#e0e0e0] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#e0e0e0] rounded mb-1" />
                <div className="h-4 bg-[#e0e0e0] rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-[#707973] mb-6">Showing <b className="text-[#002112]">{filtered.length}</b> guides</p>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-[#f5faf6] rounded-xl">
                <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">search_off</span>
                <p className="font-bold text-[#002112]">No guides found</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-3 text-sm text-[#0f5238] font-bold hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((g) => (
                  <div key={g.id ?? g.title} className="bg-white rounded-xl p-6 border border-[#e0e0e0] hover:shadow-lg hover:border-[#0f5238]/20 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-[#d5fde2] rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0f5238] text-lg">{g.icon}</span>
                      </div>
                      {g.level && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${levelColors[g.level] ?? "bg-gray-100 text-gray-600"}`}>
                          {g.level}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#f5faf6] text-[#0f5238] text-xs font-bold rounded uppercase">{g.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors leading-snug">{g.title}</h3>
                    <p className="text-sm text-[#404943] leading-relaxed mb-4">{g.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
                      {g.readTime && (
                        <span className="text-xs text-[#707973] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {g.readTime}
                        </span>
                      )}
                      <button className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:gap-2 transition-all ml-auto">
                        Read Guide <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured CTA */}
      <section className="bg-[#0f5238] py-16 px-8 mx-8 rounded-3xl mb-12 max-w-5xl lg:mx-auto">
        <p className="text-[#95d4b3] text-xs font-bold uppercase tracking-widest mb-4">Featured This Week</p>
        <h2 className="text-3xl font-black text-white mb-4 max-w-lg">The Ultimate Guide to Series A Funding in Pakistan</h2>
        <p className="text-[#a8e7c5] mb-6 max-w-xl">Everything from term sheets to due diligence — written by founders who have been through the process.</p>
        <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-[#0f5238] transition-all">
          Coming Soon →
        </button>
      </section>
    </>
  );
}
