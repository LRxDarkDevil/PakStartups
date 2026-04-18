"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ideas = [
  { avatar: "/images/image-018.jpg", stage: "VALIDATION STAGE", stageColor: "bg-[#b7f2a0] text-[#1e5111]", author: "Ahmed K.", date: "Oct 12, 2024", title: "AgriTech Supply Chain Optimizer", desc: "Connecting small-scale farmers directly to urban markets using AI-driven logistics to...", tags: ["Logistics","AI/ML"], up: 42, comments: 12 },
  { avatar: "/images/image-019.jpg", stage: "PROBLEM DEFINED", stageColor: "bg-[#caf2d7] text-[#0f5238]", author: "Zainab S.", date: "Oct 14, 2024", title: "EduLink Remote Tutoring", desc: "A low-bandwidth video platform specifically for rural education where 4G signals are...", tags: ["EdTech","Social Impact"], up: 28, comments: 5 },
  { avatar: "/images/image-020.jpg", stage: "SOLUTION MVP", stageColor: "bg-[#d5fde2] text-[#2d6a4f]", author: "Omar F.", date: "Oct 11, 2024", title: "SolarShare Neighborhood Grid", desc: "Peer-to-peer excess solar energy trading platform for residential housing societies.", tags: ["Energy","Blockchain"], up: 56, comments: 24 },
  { avatar: "/images/image-021.jpg", stage: "SCALING", stageColor: "bg-[#0f5238] text-white", author: "Sana M.", date: "Oct 15, 2024", title: "CareCart Health Delivery", desc: "Verified prescription medicine delivery service with temperature-controlled transit for...", tags: ["HealthTech","Pharma"], up: 112, comments: 38 },
];

export default function IdeasPage() {
  const [activeTab, setActiveTab] = useState("Browse Ideas");

  return (
    <>
      {/* Header */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Idea Validation</h1>
            <p className="text-[#404943] text-lg">Turn your idea into a validated business concept with community support</p>
          </div>
          <Link href="/ideas/submit" className="border-2 border-[#002112] text-[#002112] px-6 py-3 rounded-lg font-bold hover:bg-[#002112] hover:text-white transition-all">
            Submit an Idea
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {["Browse Ideas", "My Ideas"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
              >
                {tab}
              </button>
            ))}
            <Link href="/ideas/submit" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">Submit an Idea</Link>
            <Link href="/ideas/feasibility" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">Feasibility Tool</Link>
            <Link href="/ideas/survey" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">Survey Builder</Link>
            <Link href="/ideas/resources" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">MVP Resources</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Ideas List */}
        <div className="flex-1">
          {activeTab === "Browse Ideas" && (
            <>
          {/* Sort/Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button className="flex items-center gap-2 border border-[#bfc9c1] px-4 py-2 rounded-lg text-sm font-medium text-[#404943] hover:border-[#0f5238] transition-all">
              Sort by <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            {["All","Most Voted","Most Discussed","Newest"].map((f,i)=>(
              <button key={f} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${i===0?"bg-[#0f5238] text-white":"bg-[#d5fde2] text-[#002112] hover:bg-[#caf2d7]"}`}>{f}</button>
            ))}
            <div className="relative ml-auto">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973]">search</span>
              <input type="text" placeholder="Search ideas..." className="pl-10 pr-4 py-2 bg-[#f5f5f5] rounded-lg text-sm outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea) => (
              <div key={idea.title} className="bg-white border border-[#e0e0e0] rounded-xl p-6 hover:shadow-[0_8px_32px_rgba(15,82,56,0.08)] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${idea.stageColor}`}>{idea.stage}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                      <Image width={24} height={24} src={idea.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-[#707973]">{idea.author} · {idea.date}</span>
                  </div>
                </div>
                <h3 className="font-bold text-[#002112] text-lg mb-2">{idea.title}</h3>
                <p className="text-[#404943] text-sm mb-4 line-clamp-2">{idea.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map(t=>(
                    <span key={t} className="px-2 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded uppercase">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
                  <div className="flex items-center gap-4 text-sm text-[#707973]">
                    <button className="flex items-center gap-1 hover:text-[#0f5238] transition-colors">
                      <span className="material-symbols-outlined text-sm">arrow_upward</span>{idea.up}
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#0f5238] transition-colors">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>{idea.comments}
                    </button>
                  </div>
                  <a href="#" className="text-[#0f5238] font-bold text-sm flex items-center gap-1">
                    View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          </>
          )}

          {activeTab === "My Ideas" && (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">lightbulb</span>
              <h3 className="text-xl font-bold text-[#002112]">No Ideas Submitted</h3>
              <p className="text-[#404943] mt-2 mb-6">You haven't submitted any ideas for community validation yet.</p>
              <Link href="/ideas/submit" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                Submit Your First Idea
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#0f5238] rounded-xl p-6 text-white">
            <p className="text-[#95d4b3] text-xs font-bold uppercase tracking-wider mb-2">Premium Access</p>
            <h2 className="text-2xl font-black mb-3">Score your idea in 5 minutes</h2>
            <p className="text-[#a8e7c5] text-sm mb-6">Use our AI-driven validation engine to check market feasibility, competition, and regulatory hurdles.</p>
            <button className="bg-white text-[#0f5238] px-5 py-3 rounded-lg font-bold w-full hover:bg-[#d5fde2] transition-all">Try the Tool →</button>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e0e0e0]">
            <h3 className="font-bold text-[#002112] mb-4">Community Tips</h3>
            <div className="space-y-4">
              {["Define the Problem Clearly — Focus on a specific pain point rather than a broad market gap.","Early Feedback is Gold — Respond to all comments. The community loves engaged founders.","Use Quantitative Data — Back your claims with initial survey data or research snippets."].map((tip,i)=>(
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0f5238] mt-2 shrink-0" />
                  <p className="text-sm text-[#404943]"><b className="text-[#002112]">{tip.split("—")[0]}</b>{tip.includes("—") ? `— ${tip.split("—")[1]}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#d5fde2] rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-[#0f5238] mb-1">1,240+</div>
            <div className="text-sm text-[#404943] uppercase tracking-wider font-bold">Validated Ideas</div>
          </div>
        </div>
      </div>
    </>
  );
}
