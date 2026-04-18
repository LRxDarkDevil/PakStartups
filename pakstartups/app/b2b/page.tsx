"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const demands = [
  {
    icon: "code",
    category: "Tech & Dev",
    title: "Scalable E-commerce MVP Development",
    desc: "Looking for a full-stack team to build a headless commerce platform using Next.js and Shopify API. Focus on speed and mobile-first experience.",
    tags: ["FinTech", "MVP Stage"],
    budget: "PKR 150k–300k",
    deadline: "15 Days",
    poster: "Ahmed Raza, CEO",
    avatar: "/images/image-006.jpg",
  },
  {
    icon: "campaign",
    category: "Marketing",
    title: "B2B Content Strategy & Ghostwriting",
    desc: "Need a content lead to manage LinkedIn presence for our founding team. Experience in SaaS and logistics sector preferred.",
    tags: ["Logistics", "Post-Seed"],
    budget: "PKR 50k–80k / mo",
    deadline: "Open",
    poster: "Sara Malik, CMO",
    avatar: "/images/image-007.jpg",
  },
  {
    icon: "payments",
    category: "Finance",
    title: "Financial Modeling for Series A Funding",
    desc: "Seeking a fractional CFO or finance expert to prepare 3-year projections and unit economic analysis for upcoming fundraise.",
    tags: ["AgriTech", "Series A"],
    budget: "PKR 200k–500k",
    deadline: "30 Days",
    poster: "Zain Farooq, Founder",
    avatar: "/images/image-008.jpg",
  },
  {
    icon: "brush",
    category: "Design",
    title: "Rebranding & Visual Identity Package",
    desc: "Complete brand overhaul including logo design, typography, and marketing collateral for an EdTech startup.",
    tags: ["EdTech", "Scale-up"],
    budget: "PKR 100k–150k",
    deadline: "21 Days",
    poster: "Hina Khan, Ops Lead",
    avatar: "/images/image-009.jpg",
  },
  {
    icon: "gavel",
    category: "Legal",
    title: "Employment Contracts & Compliance",
    desc: "Need localized employment contracts for our Pakistan-based team including remote work and IP clauses.",
    tags: ["HR-Tech", "MVP Stage"],
    budget: "PKR 40k–60k",
    deadline: "7 Days",
    poster: "Osman Ali, COO",
    avatar: "/images/image-010.jpg",
  },
];

export default function B2BPage() {
  const [activeTab, setActiveTab] = useState("Browse Demands");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Mock filters for solutions
  const solutions = demands.map(d => ({...d, type: "Solution"})); // Fake list based off demands
  
  return (
    <>
      {/* Page Header */}
      <header className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#002112] mb-4 leading-tight">
              B2B Marketplace
            </h1>
            <p className="text-xl text-[#404943] font-medium">
              Connect with the services your startup needs. High-velocity solutions for the modern entrepreneur.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/b2b/post-demand" className="px-8 py-4 bg-[#0f5238] text-white rounded-lg font-bold text-lg flex items-center gap-2 shadow-xl shadow-[#0f5238]/10 hover:opacity-90 transition-all">
                <span className="material-symbols-outlined">add_circle</span>
                Post a Demand
              </Link>
              <Link href="/b2b/list-solution" className="px-8 py-4 bg-[#caf2d7] text-[#0f5238] rounded-lg font-bold text-lg border border-[#0f5238]/10 hover:bg-[#c4ecd2] transition-all">
                List Your Solution
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-md aspect-square bg-[#d5fde2] rounded-[40px] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[120px] text-[#0f5238] opacity-20">storefront</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* AI Match Banner */}
        <div className="mb-12 bg-[#0f5238] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-[#0f5238]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2d6a4f] flex items-center justify-center text-[#a8e7c5]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">3 solutions match your profile</h3>
              <p className="text-[#a8e7c5] text-sm">Our AI matched your recent activity with verified service providers.</p>
            </div>
          </div>
          <button className="px-6 py-2 border-2 border-[#a8e7c5] text-[#a8e7c5] rounded-lg font-bold hover:bg-[#a8e7c5] hover:text-[#0f5238] transition-all whitespace-nowrap">
            See AI Matches →
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-[#bfc9c1]/20 overflow-x-auto pb-1 no-scrollbar">
          {["Browse Demands", "Browse Solutions", "AI Matches ✨"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 whitespace-nowrap ${activeTab === tab ? "text-[#0f5238] font-bold border-b-4 border-[#0f5238]" : "text-[#404943] font-medium hover:text-[#0f5238] transition-colors"}`}
            >
              {tab}
            </button>
          ))}
          <Link href="/b2b/post-demand" className="pb-4 whitespace-nowrap text-[#404943] font-medium hover:text-[#0f5238] transition-colors ml-auto md:ml-0">Post a Demand</Link>
          <Link href="/b2b/list-solution" className="pb-4 whitespace-nowrap text-[#404943] font-medium hover:text-[#0f5238] transition-colors">List a Solution</Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {["All Categories", "Tech & Dev", "Marketing", "Legal", "Finance", "Design", "Operations"].map((cat) => (
            <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm ${activeCategory === cat ? "bg-[#0f5238] text-white shadow-md" : "bg-white text-[#404943] hover:bg-[#caf2d7] transition-all"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeTab === "Browse Demands" && (
            <>

        {/* Demand Cards */}
        <div className="grid grid-cols-1 gap-6">
          {demands.map((d) => (
            <div key={d.title} className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(15,82,56,0.04)] hover:shadow-xl transition-all border border-transparent hover:border-[#0f5238]/5 group">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#cff7dd] flex items-center justify-center text-[#0f5238]">
                      <span className="material-symbols-outlined">{d.icon}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0f5238]">{d.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors">{d.title}</h3>
                  <p className="text-[#404943] mb-6 line-clamp-2">{d.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <span key={t} className="px-3 py-1 bg-[#b7f2a0] text-[#032100] rounded-full text-xs font-bold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="md:w-72 flex flex-col justify-between border-l border-[#bfc9c1]/10 md:pl-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#404943]">Budget</span>
                      <span className="font-bold text-[#0f5238]">{d.budget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#404943]">Deadline</span>
                      <span className="font-bold text-[#002112]">{d.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#bfc9c1]/10">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                        <Image width={32} height={32} src={d.avatar} alt="Poster" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium">{d.poster}</span>
                    </div>
                  </div>
                  <button className="mt-6 w-full py-3 bg-[#0f5238] text-white rounded-lg font-bold active:scale-95 transition-all hover:bg-[#2d6a4f]">
                    View &amp; Respond
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 text-[#0f5238] font-bold border-2 border-[#0f5238] rounded-lg hover:bg-[#0f5238] hover:text-white transition-all">
            Load More Demands
          </button>
        </div>
        </>
        )}

        {activeTab === "Browse Solutions" && (
            <div className="text-center py-20 bg-white rounded-xl border border-[#bfc9c1]/20">
                <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">storefront</span>
                <h3 className="text-xl font-bold text-[#002112]">Service Directory</h3>
                <p className="text-[#404943] mt-2 mb-6">Explore agencies, freelancers, and B2B solutions listed on PakStartups.</p>
                <Link href="/b2b/list-solution" className="px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all inline-block">
                    List Your Agency
                </Link>
            </div>
        )}

        {activeTab === "AI Matches ✨" && (
            <div className="text-center py-20 bg-white rounded-xl border border-[#bfc9c1]/20">
                <span className="material-symbols-outlined text-4xl text-[#0f5238] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="text-xl font-bold text-[#002112]">Your AI Matches</h3>
                <p className="text-[#404943] mt-2 mb-6">Our system uses your profile skills and recent activity to instantly pair you with relevant demands or solutions.</p>
                <button className="px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all inline-block active:scale-95">
                    Generate New Matches
                </button>
            </div>
        )}
      </main>
    </>
  );
}
