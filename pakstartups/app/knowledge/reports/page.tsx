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

const REPORT_INSIGHTS: Record<string, { stats: { label: string; value: string }[]; insights: string[] }> = {
  "Pakistan Startup Ecosystem Report 2025": {
    stats: [
      { label: "Total Startup Funding", value: "$182M" },
      { label: "Deal Count", value: "48 Deals" },
      { label: "Top Sector", value: "E-Commerce" },
      { label: "Avg. Deal Size", value: "$3.8M" }
    ],
    insights: [
      "Funding saw a stabilization compared to 2024 with seed rounds dominating 60% of overall transactions.",
      "Fintech and Logistics remain the highest funded verticals, accounting for 72% of total capital inflow.",
      "An increase in regional venture funds setting up dedicated Pakistan desks was observed.",
      "Local regulatory adjustments (SECP startup definition) improved foreign investment ease."
    ]
  },
  "FinTech Pakistan: Growth & Regs": {
    stats: [
      { label: "Active FinTechs", value: "120+" },
      { label: "Digital Wallet Users", value: "35M+" },
      { label: "Funding Growth", value: "+24% YoY" },
      { label: "Avg Transaction Value", value: "PKR 4.2K" }
    ],
    insights: [
      "Digital payments (Rast integration) grew exponentially by 140% over the last fiscal year.",
      "B2B fintech and embedded finance solutions show the strongest revenue traction.",
      "Compliance costs increased by 15% due to updated AML/KYC guidelines from SBP.",
      "EMIs (Electronic Money Institutions) are expanding services into micro-lending."
    ]
  }
};

const getReportInsights = (title: string, sector: string) => {
  const normalized = title.toLowerCase();
  for (const key of Object.keys(REPORT_INSIGHTS)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return REPORT_INSIGHTS[key];
    }
  }
  return {
    stats: [
      { label: "Relevant Sector", value: sector },
      { label: "Release Period", value: "2025-2026" },
      { label: "Confidence Index", value: "High" },
      { label: "Data Points", value: "500+" }
    ],
    insights: [
      `A comprehensive analysis of key indicators driving the ${sector} industry.`,
      "Identified prominent growth bottlenecks and operational expansion opportunities.",
      "Highlights structural recommendations for early-stage startup operators in Pakistan.",
      "Includes regulatory review and FBR/SECP compliance impacts."
    ]
  };
};

export default function KnowledgeReportsPage() {
  const [reports, setReports] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("All");
  
  const [selectedReport, setSelectedReport] = useState<KnowledgeResource | null>(null);

  useEffect(() => {
    getKnowledgeResources("report")
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const triggerDownload = (report: KnowledgeResource) => {
    const insights = getReportInsights(report.title, report.sector || "General");
    let content = `PakStartups Research Brief: ${report.title}\n\n`;
    content += `Date: ${report.date || "2025"}\n`;
    content += `Sector: ${report.sector || "General"}\n`;
    content += `Pages: ${report.pages || "—"}\n\n`;
    content += `=== KEY STATISTICS ===\n`;
    insights.stats.forEach(s => {
      content += `${s.label}: ${s.value}\n`;
    });
    content += `\n=== CRITICAL INSIGHTS ===\n`;
    insights.insights.forEach((ins, i) => {
      content += `${i+1}. ${ins}\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.replace(/[\s\(\)\-\,]+/g, "_")}_summary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
                    <button
                      onClick={() => setSelectedReport(featured)}
                      className="ml-auto border-2 border-white text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-[#0f5238] transition-all"
                    >
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
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:gap-2 transition-all"
                      >
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

      {selectedReport && (() => {
        const insights = getReportInsights(selectedReport.title, selectedReport.sector || "General");

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-[#bfc9c1]/20 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-[#707973] hover:text-[#002112]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="flex items-start gap-4 mb-6 border-b border-[#bfc9c1]/10 pb-4">
                <div className="w-12 h-12 bg-[#d5fde2] rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#0f5238] text-2xl">{selectedReport.icon}</span>
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-[#f5faf6] text-[#0f5238] text-[10px] font-bold rounded uppercase tracking-wider mb-1.5 inline-block">
                    {selectedReport.sector || "General"}
                  </span>
                  <h3 className="text-lg font-black text-[#002112] leading-tight">{selectedReport.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {insights.stats.map((stat, i) => (
                  <div key={i} className="bg-[#f5faf6] p-3 rounded-lg border border-[#bfc9c1]/10">
                    <span className="block text-[10px] font-bold text-[#707973] uppercase tracking-wider">{stat.label}</span>
                    <span className="text-base font-black text-[#0f5238] mt-0.5 block">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto mb-6 pr-2">
                <h4 className="font-bold text-[#002112] text-xs uppercase tracking-wider mb-3">Key Highlights & Insights</h4>
                <ul className="space-y-3">
                  {insights.insights.map((ins, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#404943] leading-relaxed">
                      <span className="material-symbols-outlined text-xs text-[#0f5238] mt-1 shrink-0">arrow_right_alt</span>
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#bfc9c1]/10 gap-4 mt-auto">
                <div className="text-xs text-[#707973] font-medium">
                  {selectedReport.pages ? `${selectedReport.pages} pages` : ""} {selectedReport.date ? `• ${selectedReport.date}` : ""}
                </div>
                <button
                  onClick={() => { triggerDownload(selectedReport); setSelectedReport(null); }}
                  className="px-5 py-3 bg-[#0f5238] text-white rounded-lg font-bold text-sm hover:bg-[#2d6a4f] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">download</span> Download Summary Brief
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
