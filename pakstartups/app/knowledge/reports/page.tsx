"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getKnowledgeResources, type KnowledgeResource } from "@/lib/services/knowledge";

const SECTORS = ["All", "FinTech", "EdTech", "AgriTech", "HealthTech", "E-Commerce", "Ecosystem"];

const tagColors: Record<string, string> = {
  "Annual Report": "bg-[#0f5238] text-white",
  "Sector Report": "bg-[#d5fde2] text-[#0f5238]",
  "Opportunity Report": "bg-amber-100 text-amber-800",
  Trends: "bg-blue-100 text-blue-700",
  Directory: "bg-purple-100 text-purple-700",
};

export default function KnowledgeReportsPage() {
  const [reports, setReports] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("All");

  useEffect(() => {
    getKnowledgeResources("report")
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = reports.find((r) => r.featured);
  const filtered = reports.filter((r) => !r.featured && (activeSector === "All" || r.sector === activeSector));

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/knowledge" className="flex items-center gap-1 text-sm text-[#0f5238] font-bold mb-4 hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span> Knowledge Hub
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Market Intelligence</h1>
          <p className="text-[#404943] text-lg max-w-2xl">
            Sector reports and research snapshots for the Pakistan market.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {loading ? (
          <div className="space-y-6">
            <div className="animate-pulse bg-[#0f5238]/10 rounded-2xl h-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-[#e0e0e0] h-40" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured report */}
            {featured && (
              <div className="bg-[#0f5238] rounded-2xl p-8 mb-12 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-3xl">{featured.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded uppercase">Featured</span>
                    {featured.tag && (
                      <span className="px-2.5 py-0.5 bg-[#b7f2a0]/30 text-[#b7f2a0] text-xs font-bold rounded uppercase">{featured.tag}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">{featured.title}</h2>
                  <p className="text-[#a8e7c5] mb-4 leading-relaxed">{featured.desc}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    {featured.date && (
                      <span className="text-xs text-[#a8e7c5] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span> {featured.date}
                      </span>
                    )}
                    {featured.pages && (
                      <span className="text-xs text-[#a8e7c5] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">article</span> {featured.pages} pages
                      </span>
                    )}
                    <button className="ml-auto border-2 border-white text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-[#0f5238] transition-all">
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sector filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSector(s)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeSector === s
                      ? "bg-[#0f5238] text-white"
                      : "bg-white border border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Report grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-[#f5faf6] rounded-xl">
                <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">search_off</span>
                <p className="font-bold text-[#002112]">No reports in this sector yet</p>
                <button onClick={() => setActiveSector("All")} className="mt-3 text-sm text-[#0f5238] font-bold hover:underline">Show all reports</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((r) => (
                  <div key={r.id ?? r.title} className="bg-white rounded-xl p-6 border border-[#e0e0e0] hover:shadow-lg hover:border-[#0f5238]/20 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-[#d5fde2] rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0f5238] text-lg">{r.icon}</span>
                      </div>
                      {r.tag && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${tagColors[r.tag] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors leading-snug">{r.title}</h3>
                    <p className="text-sm text-[#404943] leading-relaxed mb-4 line-clamp-2">{r.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
                      <div className="flex items-center gap-3 text-xs text-[#707973]">
                        {r.date && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">calendar_today</span> {r.date}
                          </span>
                        )}
                        {r.pages && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">article</span> {r.pages}p
                          </span>
                        )}
                      </div>
                      <button className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:gap-2 transition-all">
                        View <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
