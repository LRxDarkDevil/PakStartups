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

const DOCUMENT_CHECKLISTS: Record<string, string[]> = {
  "SAFE Note Template (Pakistan-adapted)": [
    "SECP compliant pre-money valuation cap structure",
    "Discount rate parameter guidelines (typically 15-20%)",
    "Pro-rata rights and conversion event definitions",
    "Standard SECP registration guidelines attached"
  ],
  "Standard Co-Founder Agreement": [
    "Equity split and vesting schedules (e.g. 4-year vesting with 1-year cliff)",
    "Intellectual property assignment clauses",
    "Roles, responsibilities, and decision-making powers",
    "Founder exit and share buyback conditions"
  ],
  "Mutual NDA Template": [
    "Detailed definition of confidential business information",
    "Obligations of non-disclosure and restricted use",
    "Duration of confidentiality (typically 2-3 years)",
    "Remedies for breach of agreement"
  ]
};

export default function KnowledgeToolkitPage() {
  const [tools, setTools] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("All");

  const [selectedTool, setSelectedTool] = useState<KnowledgeResource | null>(null);
  
  // Runway Calculator State
  const [cash, setCash] = useState("1000000");
  const [inflow, setInflow] = useState("200000");
  const [outflow, setOutflow] = useState("500000");

  useEffect(() => {
    getKnowledgeResources("tool")
      .then(setTools)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const triggerDownload = (tool: KnowledgeResource) => {
    const content = `PakStartups - ${tool.title}\n\nThis is a template download for ${tool.title}.\n\nCategory: ${tool.category}\nDescription: ${tool.desc}\nFormat: ${tool.format}\n\nUse this template to model your operational workflows. For legal documents, ensure local SECP and regulatory compliance.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tool.title.replace(/[\s\(\)\-\,]+/g, "_")}_template.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
                  <button
                    onClick={() => {
                      setSelectedTool(tool);
                      if (tool.title.toLowerCase().includes("runway")) {
                        setCash("1000000");
                        setInflow("200000");
                        setOutflow("500000");
                      }
                    }}
                    className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:gap-2 transition-all"
                  >
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

      {selectedTool && (() => {
        const isRunway = selectedTool.title.toLowerCase().includes("runway");
        
        if (isRunway) {
          const cashNum = parseFloat(cash) || 0;
          const inflowNum = parseFloat(inflow) || 0;
          const outflowNum = parseFloat(outflow) || 0;
          const burnRate = Math.max(0, outflowNum - inflowNum);
          const runwayMonths = burnRate > 0 ? (cashNum / burnRate).toFixed(1) : "Infinite";

          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-[#bfc9c1]/20 animate-in fade-in zoom-in duration-200 relative">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="absolute top-4 right-4 text-[#707973] hover:text-[#002112]"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="w-16 h-16 bg-[#d5fde2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-[#0f5238] text-3xl font-bold">calculate</span>
                </div>
                <h3 className="text-2xl font-black text-[#002112] text-center mb-6">{selectedTool.title}</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-[#404943] uppercase tracking-wider mb-2">Starting Cash (PKR)</label>
                    <input
                      type="number"
                      value={cash}
                      onChange={(e) => setCash(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f5faf6] border border-[#bfc9c1]/30 rounded-lg outline-none focus:ring-2 focus:ring-[#0f5238]/30 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#404943] uppercase tracking-wider mb-2">Monthly Inflow</label>
                      <input
                        type="number"
                        value={inflow}
                        onChange={(e) => setInflow(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f5faf6] border border-[#bfc9c1]/30 rounded-lg outline-none focus:ring-2 focus:ring-[#0f5238]/30 font-bold text-green-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#404943] uppercase tracking-wider mb-2">Monthly Outflow</label>
                      <input
                        type="number"
                        value={outflow}
                        onChange={(e) => setOutflow(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f5faf6] border border-[#bfc9c1]/30 rounded-lg outline-none focus:ring-2 focus:ring-[#0f5238]/30 font-bold text-red-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5faf6] p-5 rounded-xl border border-[#bfc9c1]/10 space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#404943] font-medium">Monthly Burn Rate:</span>
                    <span className="font-bold text-[#002112]">PKR {burnRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#bfc9c1]/20 pt-3">
                    <span className="text-[#002112] font-black">Calculated Runway:</span>
                    <span className={`text-lg font-black ${burnRate > 0 ? "text-amber-700" : "text-[#0f5238]"}`}>
                      {runwayMonths === "Infinite" ? "Infinite Runway ✓" : `${runwayMonths} Months`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerDownload(selectedTool)}
                  className="w-full py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">download</span> Export Runway Model
                </button>
              </div>
            </div>
          );
        }

        const checklists = DOCUMENT_CHECKLISTS[selectedTool.title] || [
          "Operational guidelines for early-stage implementation",
          "Pakistan SECP regulatory alignment indicators",
          "Standard drafting templates and execution suggestions"
        ];

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-[#bfc9c1]/20 animate-in fade-in zoom-in duration-200 relative">
              <button
                onClick={() => setSelectedTool(null)}
                className="absolute top-4 right-4 text-[#707973] hover:text-[#002112]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="w-16 h-16 bg-[#d5fde2] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#0f5238] text-3xl font-bold">{selectedTool.icon}</span>
              </div>
              <h3 className="text-xl font-black text-[#002112] text-center mb-2">{selectedTool.title}</h3>
              <p className="text-[#404943] text-sm text-center mb-6">{selectedTool.desc}</p>
              
              <div className="bg-[#f5faf6] p-5 rounded-xl border border-[#bfc9c1]/10 mb-6">
                <h4 className="font-bold text-[#002112] text-xs uppercase tracking-wider mb-3">Template Contents</h4>
                <ul className="space-y-2.5">
                  {checklists.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#404943]">
                      <span className="material-symbols-outlined text-xs text-[#0f5238] mt-0.5">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => { triggerDownload(selectedTool); setSelectedTool(null); }}
                className="w-full py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">download</span> Download {selectedTool.format || "Template"}
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
}
