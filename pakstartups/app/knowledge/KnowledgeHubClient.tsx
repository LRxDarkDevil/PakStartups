"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllKnowledgeResources } from "@/lib/services/knowledge";

type Section = { icon: string; title: string; desc: string; cta: string; href: string };
type Recent = { tag: string; label: string; title: string; read: string };

function toRecentTag(resourceType: string) {
  if (resourceType === "guide") return "GUIDES";
  if (resourceType === "tool") return "TOOLKIT";
  if (resourceType === "report") return "INTELLIGENCE";
  return "RESOURCES";
}

function toRecentHref(resourceType: string) {
  if (resourceType === "guide") return "/knowledge/guides";
  if (resourceType === "tool") return "/knowledge/toolkit";
  if (resourceType === "report") return "/knowledge/reports";
  return "/knowledge/directory";
}

export default function KnowledgeHubClient({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<Array<Recent & { href: string }>>([]);
  const normalized = query.trim().toLowerCase();

  useEffect(() => {
    getAllKnowledgeResources()
      .then((resources) => {
        const recentItems = resources.slice(0, 4).map((item) => ({
          tag: toRecentTag(item.resourceType),
          label: "NEW",
          title: item.title,
          read: item.readTime ?? (item.format ? String(item.format) : "Resource"),
          href: toRecentHref(item.resourceType),
        }));
        setRecent(recentItems);
      })
      .catch(console.error);
  }, []);

  const filteredSections = sections.filter((section) => !normalized || [section.title, section.desc, section.cta].join(" ").toLowerCase().includes(normalized));
  const filteredRecent = recent.filter((item) => !normalized || [item.title, item.tag, item.label].join(" ").toLowerCase().includes(normalized));

  return (
    <div className="bg-[#f4faf6] min-h-screen text-[#002112]">
      {/* Editorial Header */}
      <section className="bg-[#e4f9eb] py-20 px-6 lg:px-8 text-center border-b border-[#0f5238]/15">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-[#002112] mb-4">
            Knowledge Vault &amp; Legal Playbooks
          </h1>
          <p className="text-lg text-[#304237] max-w-2xl mx-auto font-medium mb-10">
            Free access to Pakistani incorporation guides, SAFE investment agreements, pitch deck teardowns, and operational toolkits.
          </p>

          <div className="max-w-xl mx-auto relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0f5238] text-xl">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search legal templates, guides, toolkits..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#0f5238]/20 shadow-md focus:border-[#0f5238] focus:ring-4 focus:ring-[#0f5238]/10 outline-none text-[#002112] text-base font-medium"
            />
          </div>

          <div className="flex justify-center gap-4 text-xs font-bold text-[#0f5238] uppercase tracking-widest flex-wrap">
            {filteredSections.slice(0, 4).map((section) => (
              <Link key={section.title} href={section.href} className="hover:underline bg-white px-3 py-1 rounded-full border border-[#0f5238]/15">
                {section.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Core Sections Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="bg-white rounded-3xl p-8 border border-[#0f5238]/15 hover:border-[#0f5238] shadow-xs hover:shadow-xl transition-all duration-300 group block flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-[#0f5238] text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  <span className="material-symbols-outlined text-3xl">{section.icon}</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-[#002112] mb-3 group-hover:text-[#0f5238] transition-colors">
                  {section.title}
                </h2>
                <p className="text-[#404943] text-sm leading-relaxed mb-6 font-normal">
                  {section.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-auto">
                <span className="text-[#0f5238] text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>{section.cta}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="bg-[#e4f9eb]/60 py-20 px-6 lg:px-8 border-t border-[#0f5238]/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-black text-[#0f5238] uppercase tracking-widest mb-1 block">
              Recent Releases
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#002112]">
              Newly Added Playbooks &amp; Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecent.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="bg-white rounded-3xl p-6 border border-[#0f5238]/15 hover:border-[#0f5238] shadow-xs hover:shadow-lg transition-all cursor-pointer block flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-2 mb-4">
                    <span className="px-2.5 py-0.5 bg-[#0f5238] text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded-md uppercase tracking-wider border border-[#0f5238]/20">
                      {item.tag}
                    </span>
                  </div>
                  <p className="font-bold font-display text-[#002112] text-base mb-4 line-clamp-2">
                    {item.title}
                  </p>
                </div>
                <p className="text-xs text-[#606d64] font-medium flex items-center gap-1.5 pt-3 border-t border-gray-100 mt-auto">
                  <span className="material-symbols-outlined text-sm text-[#0f5238]">schedule</span>
                  {item.read}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 my-16">
        <div className="bg-[#072a1d] text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full inline-block mb-4">
              Featured Guide
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white mb-4 max-w-2xl leading-tight">
              The Founder&apos;s Guide to Raising Venture Capital in Pakistan
            </h2>
            <p className="text-emerald-200/90 text-sm max-w-xl font-medium">
              Step-by-step breakdown of term sheets, SAFE notes, valuation benchmarks, and regulatory compliance for Pakistani startups.
            </p>
          </div>

          <Link
            href="/knowledge/guides"
            className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#002112] px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base transition-all shrink-0 cursor-pointer shadow-lg"
          >
            <span>Read Full Guide</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}