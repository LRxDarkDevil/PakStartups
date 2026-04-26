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
    <>
      <section className="bg-[#d5fde2] py-20 px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#002112] mb-4">Knowledge Hub</h1>
        <p className="text-[#404943] text-lg mb-10 max-w-xl mx-auto">Everything you need to start, validate, and grow your startup in Pakistan</p>
        <div className="max-w-xl mx-auto relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#707973]">search</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search guides, tools, resources..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-[0_4px_24px_rgba(15,82,56,0.08)] focus:ring-2 focus:ring-[#0f5238]/40 outline-none text-[#002112] text-lg" />
        </div>
        <div className="flex justify-center gap-6 text-xs font-bold text-[#0f5238] uppercase tracking-widest flex-wrap">
          {filteredSections.slice(0, 3).map((section) => (
            <Link key={section.title} href={section.href} className="hover:underline">{section.title}</Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSections.map((section) => (
            <Link key={section.title} href={section.href} className="bg-white rounded-2xl p-10 border-l-4 border-[#0f5238] shadow-[0_4px_24px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.1)] transition-all group block">
              <div className="w-12 h-12 bg-[#d5fde2] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl">{section.icon}</span>
              </div>
              <h2 className="text-2xl font-bold text-[#002112] mb-3">{section.title}</h2>
              <p className="text-[#404943] mb-6">{section.desc}</p>
              <span className="text-[#0f5238] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                {section.cta} <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#d5fde2]/30 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-xs font-bold text-[#0f5238] uppercase tracking-widest mb-1">New Arrivals</p>
              <h2 className="text-3xl font-black text-[#002112]">Recently Added</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecent.map((item) => (
              <Link key={item.title} href={item.href} className="bg-white rounded-xl p-6 shadow-[0_4px_24px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.1)] transition-all cursor-pointer block">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-[#0f5238] text-white text-[10px] font-bold rounded uppercase">{item.label}</span>
                  <span className="px-2 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded uppercase">{item.tag}</span>
                </div>
                <p className="font-bold text-[#002112] text-sm mb-4 line-clamp-2">{item.title}</p>
                <p className="text-xs text-[#707973] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {item.read}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f5238] py-20 px-8 mx-8 rounded-3xl my-12 max-w-7xl lg:mx-auto">
        <p className="text-[#95d4b3] text-xs font-bold uppercase tracking-widest mb-4">Featured This Week</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 max-w-lg">The Ultimate Guide to Series A Funding in Pakistan</h2>
        <Link href="/knowledge/guides" className="inline-flex border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-[#0f5238] transition-all">Start Learning →</Link>
      </section>
    </>
  );
}