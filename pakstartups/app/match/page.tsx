"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";



const profiles = [
  { name: "Ahmed Khan", city: "Lahore", role: "Founder", roleColor: "bg-[#2d6a4f] text-[#a8e7c5]", looking: "A technical co-founder to build a sustainable agri-tech marketplace.", skills: ["Product", "AgriTech", "Strategy"] },
  { name: "Sara Ahmed", city: "Karachi", role: "Tech Lead", roleColor: "bg-[#b4ef9d] text-[#3b6e2c]", looking: "Scale-up opportunities in Fintech. Passionate about blockchain security.", skills: ["React Native", "FinTech", "Web3"] },
  { name: "Zain Malik", city: "Islamabad", role: "Student", roleColor: "bg-[#caf2d7] text-[#0f5238]", looking: "Early-stage mentorship and a chance to build the MVP for a logistics startup.", skills: ["Python", "Logistics", "MVP"] },
  { name: "Fatima Jinnah", city: "Lahore", role: "Founder", roleColor: "bg-[#2d6a4f] text-[#a8e7c5]", looking: "Growth hackers and marketing wizards for an e-commerce fashion venture.", skills: ["Marketing", "E-commerce", "Branding"] },
  { name: "Bilal Rauf", city: "Faisalabad", role: "Freelancer", roleColor: "bg-[#caf2d7] text-[#0f5238]", looking: "Operations and supply chain projects in the textile sector. 8+ years exp.", skills: ["Operations", "Supply Chain", "Textiles"] },
  { name: "Madiha Ali", city: "Lahore", role: "Founder", roleColor: "bg-[#2d6a4f] text-[#a8e7c5]", looking: "CFO partner for a social enterprise focused on financial literacy for women.", skills: ["Finance", "Social Impact", "EdTech"] },
];

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState("Browse Matches");

  return (
    <>
      {/* Page Header with Tabs */}
      <section className="bg-white px-8 py-16 text-center border-b border-[#bfc9c1]/10">
        <h1 className="text-[3.5rem] font-[900] tracking-[-0.04em] text-[#002112] mb-4">
          Find Your Co-Founder
        </h1>
        <p className="text-lg text-[#404943] max-w-2xl mx-auto mb-12">
          Connect with talented people building Pakistan&apos;s future
        </p>
        <div className="flex justify-center gap-12 border-b border-[#bfc9c1]/20 overflow-x-auto no-scrollbar">
          {["Browse Matches", "My Requests", "Received Requests", "Saved Profiles"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-[#0f5238] font-bold border-b-4 border-[#0f5238]"
                  : "text-[#404943] font-medium hover:text-[#0f5238]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-8 items-start">
        {activeTab === "Browse Matches" && (
            <>
        {/* Sidebar Filter */}
        <aside className="w-full md:w-1/4 bg-[#d5fde2] p-8 rounded-xl sticky top-28">
          <div className="space-y-8">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">
                Search
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Name or keyword..."
                  className="w-full pl-10 pr-4 py-3 bg-[#c4ecd2] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">
                Role
              </label>
              <div className="flex flex-wrap gap-2">
                {["Founder", "Freelancer", "Student"].map((role, i) => (
                  <button
                    key={role}
                    className={
                      i === 0
                        ? "px-4 py-2 rounded-full bg-[#0f5238] text-white text-xs font-bold transition-all"
                        : "px-4 py-2 rounded-full bg-[#c4ecd2] text-[#404943] text-xs font-bold hover:bg-[#b4ef9d]/30"
                    }
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">
                Skills
              </label>
              <div className="space-y-3">
                {["Product Management", "Tech / Engineering", "Marketing & Growth", "Finance", "Operations"].map((skill, i) => (
                  <label key={skill} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked={i === 1}
                      className="w-5 h-5 rounded border-[#bfc9c1] text-[#0f5238] focus:ring-[#0f5238]"
                    />
                    <span className="text-[#404943] group-hover:text-[#0f5238] transition-colors">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">
                City
              </label>
              <select className="w-full py-3 bg-[#c4ecd2] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 outline-none">
                <option>All Cities</option>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option>
              </select>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#002112] uppercase tracking-wider">
                Open to Connect
              </span>
              <button className="w-12 h-6 bg-[#0f5238] rounded-full relative transition-all">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>

            <button className="w-full bg-[#0f5238] text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-[#0f5238]/20 active:scale-[0.98] transition-all mt-4">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Profile Grid */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div
                key={p.name}
                className="bg-white p-8 rounded-xl shadow-[0_8px_32px_rgba(15,82,56,0.04)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.08)] transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#b4ef9d] overflow-hidden flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0f5238] text-2xl">person</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.roleColor}`}>
                    {p.role}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#002112] mb-1">{p.name}</h3>
                <p className="flex items-center text-[#404943] text-sm mb-6">
                  <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                  {p.city}
                </p>
                <div className="mb-6 flex-grow">
                  <p className="text-xs font-bold text-[#002112] mb-1 uppercase">Looking for</p>
                  <p className="text-[#404943] italic text-sm">&ldquo;{p.looking}&rdquo;</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.skills.map((sk) => (
                    <span key={sk} className="px-2 py-1 bg-[#caf2d7] text-[#0f5238] text-[10px] font-bold rounded">
                      {sk}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-grow bg-[#0f5238] text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
                    Connect
                  </button>
                  <button className="p-2.5 border border-[#bfc9c1]/30 rounded-lg text-[#0f5238] hover:bg-[#d5fde2] transition-colors">
                    <span className="material-symbols-outlined">bookmark</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-6 mt-16">
            <button className="flex items-center px-4 py-2 text-[#404943] font-bold hover:text-[#0f5238] transition-colors opacity-30" disabled>
              <span className="material-symbols-outlined mr-2">chevron_left</span>
              Prev
            </button>
            <span className="text-sm font-bold text-[#002112]">Page 1 of 12</span>
            <button className="flex items-center px-4 py-2 text-[#0f5238] font-bold hover:text-[#2d6a4f] transition-colors">
              Next
              <span className="material-symbols-outlined ml-2">chevron_right</span>
            </button>
          </div>
        </div>
        </>
        )}

        {activeTab !== "Browse Matches" && (
            <div className="w-full text-center py-32 bg-white rounded-xl border border-[#bfc9c1]/20">
                <span className="material-symbols-outlined text-6xl text-[#bfc9c1] mb-4">
                    {activeTab === "Saved Profiles" ? "bookmarks" : "forum"}
                </span>
                <h3 className="text-2xl font-bold text-[#002112]">{activeTab}</h3>
                <p className="text-[#404943] mt-2 mb-6">No records found for this section yet.</p>
                <button onClick={() => setActiveTab("Browse Matches")} className="px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                    Find Co-Founders
                </button>
            </div>
        )}
      </div>
    </>
  );
}
