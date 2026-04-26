"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIdeaResources, type IdeaResource } from "@/lib/services/ideaResources";

const TABS = ["All", "Templates", "Playbooks", "Tools", "Reading"];

const tagColors: Record<string, string> = {
  Popular: "bg-[#d5fde2] text-[#0f5238]",
  "Most Popular": "bg-[#0f5238] text-white",
  Essential: "bg-amber-100 text-amber-800",
  "Built-in": "bg-blue-100 text-blue-700",
};

const formatIcons: Record<string, string> = {
  "Google Sheets": "table_chart",
  "Google Docs": "article",
  PDF: "picture_as_pdf",
  Interactive: "open_in_new",
  Figma: "design_services",
  Article: "auto_stories",
};

export default function IdeaResourcesPage() {
  const [resources, setResources] = useState<IdeaResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    getIdeaResources()
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter((r) => activeTab === "All" || r.tab === activeTab);

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/ideas" className="flex items-center gap-1 text-sm text-[#0f5238] font-bold mb-4 hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span> Ideas
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">MVP Resources</h1>
          <p className="text-[#404943] text-lg max-w-2xl">
            Templates, playbooks, tools, and reading for founders building their first product.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === tab
                  ? "bg-[#0f5238] text-white shadow-md"
                  : "bg-white border border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-[#e0e0e0] h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((r) => {
              const isInternal = !!r.href;
              const Wrapper = isInternal
                ? ({ children }: { children: React.ReactNode }) => <Link href={r.href!} className="flex flex-col h-full">{children}</Link>
                : ({ children }: { children: React.ReactNode }) => <div className="flex flex-col h-full">{children}</div>;

              return (
                <div
                  key={r.id ?? r.title}
                  className="bg-white rounded-xl p-6 border border-[#e0e0e0] hover:shadow-lg hover:border-[#0f5238]/20 transition-all group flex flex-col"
                >
                  <Wrapper>
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-[#707973] uppercase">{r.tab}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors leading-snug flex-1">{r.title}</h3>
                    <p className="text-sm text-[#404943] leading-relaxed mb-4">{r.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0] mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-[#707973]">
                        <span className="material-symbols-outlined text-xs">{formatIcons[r.format] ?? "description"}</span>
                        {r.format}
                      </div>
                      <span className="text-xs font-bold text-[#0f5238] flex items-center gap-1 group-hover:gap-2 transition-all">
                        {isInternal ? "Open Tool" : "Access"} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </span>
                    </div>
                  </Wrapper>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick access banner */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/ideas/feasibility" className="bg-[#0f5238] rounded-2xl p-6 flex items-center gap-4 hover:bg-[#2d6a4f] transition-all group">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">quiz</span>
            </div>
            <div>
              <h3 className="font-black text-white">Feasibility Assessment</h3>
              <p className="text-[#a8e7c5] text-sm">Score your idea in 2 minutes →</p>
            </div>
          </Link>
          <Link href="/ideas/survey" className="bg-[#d5fde2] rounded-2xl p-6 flex items-center gap-4 hover:bg-[#c4ecd2] transition-all group border border-[#b7f2a0]">
            <div className="w-12 h-12 bg-[#0f5238]/10 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#0f5238] text-2xl">checklist</span>
            </div>
            <div>
              <h3 className="font-black text-[#002112]">Survey Builder</h3>
              <p className="text-[#404943] text-sm">Build a validation survey in minutes →</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
