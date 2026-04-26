"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getKnowledgeResources, type KnowledgeResource } from "@/lib/services/knowledge";

const SECTIONS = ["All", "Templates", "Calculators", "Checklists"];

const tagColors: Record<string, string> = {
  "Most Popular": "bg-[#0f5238] text-white",
  Popular: "bg-[#0f5238] text-white",
  Legal: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
  Beginner: "bg-[#d5fde2] text-[#0f5238]",
};

const formatIcons: Record<string, string> = {
  "Google Slides": "slideshow",
  "Google Sheets": "table_chart",
  "PDF + DOCX": "description",
  "Google Docs": "article",
  Interactive: "open_in_new",
  PDF: "picture_as_pdf",
};

export default function KnowledgeToolkitPage() {
  const [tools, setTools] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("All");

  useEffect(() => {
    getKnowledgeResources("tool")
      .then(setTools)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tools.filter((t) => activeSection === "All" || t.category === activeSection);

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/knowledge" className="flex items-center gap-1 text-sm text-[#0f5238] font-bold mb-4 hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span> Knowledge Hub
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Operational Toolkit</h1>
          <p className="text-[#404943] text-lg max-w-2xl">
            Templates, calculators, and operator tools for early-stage teams.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Section tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeSection === s
                  ? "bg-[#0f5238] text-white shadow-md"
                  : "bg-white border border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => (
              <div key={tool.id ?? tool.title} className="bg-white rounded-xl p-6 border border-[#e0e0e0] hover:shadow-lg hover:border-[#0f5238]/20 transition-all group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-[#d5fde2] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0f5238] text-lg">{tool.icon}</span>
                  </div>
                  {tool.tag && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${tagColors[tool.tag] ?? "bg-gray-100 text-gray-600"}`}>
                      {tool.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors leading-snug">{tool.title}</h3>
                <p className="text-sm text-[#404943] leading-relaxed mb-4 flex-1">{tool.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0] mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-[#707973]">
                    <span className="material-symbols-outlined text-xs">{formatIcons[tool.format ?? ""] ?? "description"}</span>
                    {tool.format}
                  </div>
                  <button className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:gap-2 transition-all">
                    Access <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA banner */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <div className="bg-[#f5faf6] rounded-2xl p-8 border border-[#d5fde2] flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-[#002112] mb-2">Missing a tool?</h3>
            <p className="text-[#404943]">Suggest a template or calculator and our team will build it for the community.</p>
          </div>
          <Link href="/contact" className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all whitespace-nowrap">
            Suggest a Tool
          </Link>
        </div>
      </div>
    </>
  );
}
