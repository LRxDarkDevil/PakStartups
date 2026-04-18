"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";



const startups = [
  { name: "FinFlow", desc: "Revolutionizing digital payments for underserved merchants across Punjab.", stage: "Growth", city: "Lahore", category: "FinTech", slug: "finflow", logo: "/images/image-055.jpg" },
  { name: "AgriSense", desc: "AI-powered soil analysis and weather forecasting for small-scale farmers.", stage: "MVP", city: "Faisalabad", category: "AgriTech", slug: "agrisense", logo: "/images/image-056.jpg" },
  { name: "SehatLink", desc: "Connecting rural patients with top-tier specialists through video consults.", stage: "Scaling", city: "Karachi", category: "HealthTech", slug: "sehatlink", logo: "/images/image-057.jpg" },
  { name: "EduPeak", desc: "Gamified learning platform tailored for the national curriculum of Pakistan.", stage: "Growth", city: "Islamabad", category: "EdTech", slug: "edupeak", logo: "/images/image-058.jpg" },
  { name: "ZippyCart", desc: "Ultra-fast grocery delivery service operating in metropolitan hubs.", stage: "Scaling", city: "Lahore", category: "E-Commerce", slug: "zippycart", logo: "/images/image-059.jpg" },
  { name: "SaaSFlow", desc: "Simplified ERP solutions for small to medium scale manufacturing units.", stage: "Idea", city: "Sialkot", category: "SaaS", slug: "saasflow", logo: "/images/image-060.jpg" },
  { name: "CloudOps PK", desc: "Affordable cloud infrastructure management for local tech agencies.", stage: "Growth", city: "Karachi", category: "SaaS", slug: "cloudops-pk", logo: "/images/image-061.jpg" },
  { name: "VoltCharge", desc: "Building a nationwide network of EV charging stations in major cities.", stage: "MVP", city: "Islamabad", category: "Cleantech", slug: "voltcharge", logo: "/images/image-062.jpg" },
  { name: "LendCare", desc: "Peer-to-peer lending platform focusing on student and medical micro-loans.", stage: "Growth", city: "Peshawar", category: "FinTech", slug: "lendcare", logo: "/images/image-063.jpg" },
];

const stageColors: Record<string, string> = {
  Idea: "bg-[#b7f2a0] text-[#032100]",
  MVP: "bg-[#b7f2a0] text-[#032100]",
  Growth: "bg-[#b7f2a0] text-[#032100]",
  Scaling: "bg-[#b7f2a0] text-[#032100]",
};

export default function StartupsPage() {
  const [activeFilter, setActiveFilter] = useState("All Startups");

  return (
    <>
      {/* Page Header */}
      <header className="bg-white py-16 px-8 border-b border-[#cff7dd]">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#002112] mb-4">
              Startup Directory
            </h1>
            <p className="text-[#404943] text-xl max-w-2xl">
              Discover Pakistan&apos;s most innovative startups and connect with the next generation of founders.
            </p>
          </div>
          <Link
            href="/startups/submit"
            className="flex items-center gap-2 bg-[#0f5238] text-white px-8 py-4 rounded-lg font-bold shadow-[0_8px_24px_rgba(15,82,56,0.12)] hover:shadow-[0_12px_32px_rgba(15,82,56,0.2)] transition-all active:scale-95"
          >
            Submit Your Startup
            <span className="material-symbols-outlined">add</span>
          </Link>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-8 py-12">
        {/* Filter Tabs & Result Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-wrap gap-2">
            {["All Startups", "Recently Added", "Trending", "By Industry"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={
                  activeFilter === tab
                    ? "px-6 py-2.5 rounded-full bg-[#0f5238] text-white font-bold transition-colors"
                    : "px-6 py-2.5 rounded-full bg-[#cff7dd] text-[#002112] hover:bg-[#caf2d7] transition-colors font-semibold"
                }
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-[#404943] font-medium">
            Showing <span className="text-[#002112] font-bold">142</span> startups
          </div>
        </div>

        {/* Two-column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-28 bg-[#d5fde2] rounded-xl p-8 shadow-sm">
              {/* Search */}
              <div className="mb-8">
                <label className="block text-sm font-bold uppercase tracking-wider text-[#404943] mb-3">
                  Search
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Startup name..."
                    className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 text-[#002112] placeholder:text-[#707973] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-8">
                {/* Stage Filter */}
                <div>
                  <h3 className="font-bold text-[#002112] mb-4">Startup Stage</h3>
                  <div className="space-y-3">
                    {["Idea", "MVP", "Growth", "Scaling"].map((s, i) => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          defaultChecked={i === 1}
                          className="w-5 h-5 rounded border-[#bfc9c1] text-[#0f5238] focus:ring-[#0f5238]"
                        />
                        <span className="text-[#404943] group-hover:text-[#002112] transition-colors">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="font-bold text-[#002112] mb-4">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {["FinTech", "HealthTech", "EdTech", "AgriTech", "E-Commerce"].map((cat, i) => (
                      <button
                        key={cat}
                        className={
                          i === 0
                            ? "px-3 py-1.5 bg-[#c4ecd2] text-[#0f5238] text-xs font-bold rounded-full uppercase"
                            : "px-3 py-1.5 bg-white text-[#404943] text-xs font-bold rounded-full uppercase hover:bg-[#c4ecd2] hover:text-[#0f5238] transition-all"
                        }
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <h3 className="font-bold text-[#002112] mb-4">City</h3>
                  <select className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 text-[#002112] py-3 outline-none">
                    <option>All Cities</option>
                    <option>Karachi</option>
                    <option>Lahore</option>
                    <option>Islamabad</option>
                    <option>Faisalabad</option>
                  </select>
                </div>

                <div className="pt-6 space-y-4">
                  <button className="w-full bg-[#0f5238] text-white py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                    Apply Filters
                  </button>
                  <button className="w-full text-[#404943] font-bold text-sm hover:text-[#0f5238] transition-colors uppercase tracking-widest text-center">
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Card Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {startups.map((s) => (
                <div
                  key={s.slug}
                  className="group bg-white rounded-xl p-8 shadow-[0_8px_32px_rgba(15,82,56,0.06)] hover:shadow-[0_16px_48px_rgba(15,82,56,0.12)] transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                    <Image width={64} height={64} src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-[#002112] mb-2">{s.name}</h3>
                  <p className="text-[#404943] text-sm line-clamp-2 mb-6">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${stageColors[s.stage]}`}>
                      {s.stage}
                    </span>
                    <span className="px-3 py-1 bg-[#cff7dd] text-[#404943] text-[10px] font-black uppercase rounded-full">
                      {s.city}
                    </span>
                    <span className="px-3 py-1 bg-[#cff7dd] text-[#404943] text-[10px] font-black uppercase rounded-full">
                      {s.category}
                    </span>
                  </div>
                  <Link
                    href={`/startups/${s.slug}`}
                    className="flex items-center gap-2 text-[#0f5238] font-black group-hover:gap-4 transition-all uppercase tracking-tighter text-sm"
                  >
                    View Startup{" "}
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-4">
              <button className="w-12 h-12 rounded-full border-2 border-[#cff7dd] flex items-center justify-center text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238] transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0f5238]" />
                <span className="w-3 h-3 rounded-full bg-[#cff7dd]" />
                <span className="w-3 h-3 rounded-full bg-[#cff7dd]" />
                <span className="w-3 h-3 rounded-full bg-[#cff7dd]" />
              </div>
              <button className="w-12 h-12 rounded-full border-2 border-[#cff7dd] flex items-center justify-center text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238] transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
