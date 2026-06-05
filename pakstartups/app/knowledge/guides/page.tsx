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

const GUIDE_STEPS: Record<string, { title: string; content: string }[]> = {
  "Company Registration in Pakistan (SECP)": [
    {
      title: "Step 1: Name Reservation",
      content: "Choose three unique names. Submit them to SECP via the eServices portal. Fee is PKR 200. SECP typically approves within 1-2 working days."
    },
    {
      title: "Step 2: Documentation Drafting",
      content: "Draft your Memorandum of Association (MOA) and Articles of Association (AOA) detailing principal business activities and share distribution."
    },
    {
      title: "Step 3: Document Submission & Payment",
      content: "Upload signed documents, CNIC copies of all directors, and bank receipts for incorporation fee (ranges from PKR 1,000 to 5,000 based on capital)."
    },
    {
      title: "Step 4: Certificate of Incorporation",
      content: "SECP reviews documents. Once approved, the digital incorporation certificate is sent to your registered email address. Congratulations, your entity is live!"
    }
  ],
  "FBR NTN Registration & Tax Filings": [
    {
      title: "Step 1: Obtain Company NTN",
      content: "Go to FBR Iris portal. Register the company using incorporation details. This requires a business bank account and office tenancy agreement."
    },
    {
      title: "Step 2: Register for Sales Tax (STRN)",
      content: "If you deal in taxable goods or services, register for Sales Tax (STRN). In Pakistan, services are taxed at provincial levels (PRA, SRB, etc.)."
    },
    {
      title: "Step 3: Biometric Verification",
      content: "Directors must visit a local FBR facilitation center (LTO/MTO) for fingerprint biometric verification within 30 days of registration."
    },
    {
      title: "Step 4: Monthly & Annual Filings",
      content: "File monthly sales tax returns and annual income tax returns. Keep meticulous records of business invoices to claim input tax credits."
    }
  ]
};

const getGuideSteps = (title: string, category: string) => {
  const normalized = title.toLowerCase();
  for (const key of Object.keys(GUIDE_STEPS)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return GUIDE_STEPS[key];
    }
  }
  return [
    {
      title: "1. Foundations & Fundamentals",
      content: `Begin by understanding the core concepts of ${title}. Research target audiences, collect initial validation data, and outline key project milestones.`
    },
    {
      title: "2. Strategic Execution",
      content: `Create a comprehensive operational checklist for this ${category} phase. Implement standard practices, optimize pipelines, and review compliance parameters.`
    },
    {
      title: "3. Measuring Progress & Scaling",
      content: `Establish feedback loops and KPIs. Regularly check performance metrics and expand activities once initial assumptions are validated.`
    }
  ];
};

export default function KnowledgeGuidesPage() {
  const [guides, setGuides] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<KnowledgeResource | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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
                      <button
                        onClick={() => { setSelectedGuide(g); setCurrentStep(0); }}
                        className="text-xs font-bold text-[#0f5238] flex items-center gap-1 hover:gap-2 transition-all ml-auto"
                      >
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

      {selectedGuide && (() => {
        const steps = getGuideSteps(selectedGuide.title, selectedGuide.category);
        const step = steps[currentStep] || { title: "", content: "" };
        const progress = Math.round(((currentStep + 1) / steps.length) * 100);

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-[#bfc9c1]/20 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#bfc9c1]/20 pb-4 mb-6">
                <div>
                  <span className="px-2.5 py-0.5 bg-[#f5faf6] text-[#0f5238] text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
                    {selectedGuide.category} • {selectedGuide.level || "Beginner"}
                  </span>
                  <h3 className="text-xl font-black text-[#002112] leading-tight">{selectedGuide.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="text-[#707973] hover:text-[#002112] ml-4 shrink-0"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#f5faf6] rounded-full h-1.5 mb-6 overflow-hidden">
                <div className="bg-[#0f5238] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto mb-6 pr-2">
                <h4 className="font-bold text-[#002112] text-lg mb-3">{step.title}</h4>
                <p className="text-[#404943] leading-relaxed text-sm whitespace-pre-line">{step.content}</p>
              </div>

              {/* Footer Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-[#bfc9c1]/20">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-sm font-bold text-[#0f5238] hover:bg-[#d5fde2] rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Previous
                </button>
                <span className="text-xs text-[#707973] font-medium">Step {currentStep + 1} of {steps.length}</span>
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-5 py-2 bg-[#0f5238] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="px-5 py-2 bg-[#2d6a4f] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    Finish <span className="material-symbols-outlined text-xs">check</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
