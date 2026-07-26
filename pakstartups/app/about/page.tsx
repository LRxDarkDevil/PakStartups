"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4faf6] text-[#002112]">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-24 pb-20 overflow-hidden bg-[#e4f9eb] border-b border-[#0f5238]/15">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display text-[#002112] tracking-tight mb-6 leading-[1.08]">
            Catalyzing Pakistan&apos;s <br className="hidden md:block" />
            <span className="italic text-[#0f5238] underline decoration-emerald-300 decoration-wavy decoration-2">
              Innovation Era.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#304237] max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            We are building the definitive digital infrastructure to connect, empower,
            and scale the next generation of Pakistani entrepreneurs and tech startups.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-[#072a1d] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center border border-emerald-800">
                <div className="flex items-center justify-between mb-8">
                  <span className="material-symbols-outlined text-6xl text-emerald-400">
                    public
                  </span>
                </div>
                <h3 className="text-3xl font-black font-display text-white mb-4">
                  Global Hub for Tech Innovation
                </h3>
                <p className="text-emerald-100/90 text-base font-normal leading-relaxed">
                  To position Pakistan as a leading regional hub of technology innovation by breaking down barriers to knowledge, funding, and talent for every founder—no matter where they start.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0f5238] mb-2 block">
                  The Problem
                </span>
                <h2 className="text-3xl font-bold font-display text-[#002112] mb-3">
                  Bridging the Ecosystem Gap
                </h2>
                <p className="text-[#404943] text-base leading-relaxed font-normal">
                  Too many brilliant ideas die in isolation. Pakistan has a remarkably young and energetic population, yet founders often navigate fragmented networks, opaque market data, and missing early-stage support structures.
                </p>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0f5238] mb-2 block">
                  The Solution
                </span>
                <h2 className="text-3xl font-bold font-display text-[#002112] mb-3">
                  Operating System for Builders
                </h2>
                <p className="text-[#404943] text-base leading-relaxed font-normal">
                  PakStartups acts as the operating system for the tech ecosystem. We unify the community through a verified startup directory, co-founder matchmaking, and free educational and legal resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & People */}
      <section className="py-24 px-6 lg:px-8 bg-[#f4faf6] border-t border-[#0f5238]/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black font-display text-[#002112] tracking-tight mb-4">
            Built by Founders, for Founders.
          </h2>
          <p className="text-base sm:text-lg text-[#404943] max-w-3xl mx-auto font-medium leading-relaxed mb-16">
            Managed by a dedicated team of engineers, operators, and ecosystem builders who have navigated the Pakistani market firsthand.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 border border-[#0f5238]/15 shadow-xs flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl mb-4 bg-[#0f5238] text-white flex items-center justify-center font-black text-2xl font-display shadow-md">
                MT
              </div>
              <h3 className="font-bold text-[#002112] text-lg font-display">Muhammad Taha</h3>
              <p className="text-[#0f5238] font-bold text-xs mb-3">Technical Lead &amp; Architect</p>
              <p className="text-[#606d64] text-xs leading-relaxed">
                Directing platform engineering, database architecture, and technical roadmap delivery across PakStartups.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#0f5238]/15 shadow-xs flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl mb-4 bg-[#0f5238] text-white flex items-center justify-center font-black text-2xl font-display shadow-md">
                AL
              </div>
              <h3 className="font-bold text-[#002112] text-lg font-display">Administration Lead</h3>
              <p className="text-[#0f5238] font-bold text-xs mb-3">Community &amp; Operations Lead</p>
              <p className="text-[#606d64] text-xs leading-relaxed">
                Directing strategic ecosystem partnerships, community operations, and founder support workflows.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#0f5238]/15 shadow-xs flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl mb-4 bg-[#0f5238] text-white flex items-center justify-center font-black text-2xl font-display shadow-md">
                J
              </div>
              <h3 className="font-bold text-[#002112] text-lg font-display">Javad</h3>
              <p className="text-[#0f5238] font-bold text-xs mb-3">Growth &amp; Ecosystem Advisor</p>
              <p className="text-[#606d64] text-xs leading-relaxed">
                Guiding ecosystem expansion, investor relations, and strategic growth initiatives for local startups.
              </p>
            </div>
          </div>

          {/* Volunteer Roster Callout */}
          <div className="bg-white border-2 border-[#0f5238]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-xs">
            <div>
              <h3 className="text-xl font-bold font-display text-[#002112] mb-1">
                Volunteers &amp; Open Source Mentors
              </h3>
              <p className="text-[#404943] text-xs leading-relaxed max-w-xl">
                Our network includes community volunteers, technical mentors, and open-source contributors supporting founders nationwide.
              </p>
            </div>
            <Link
              href="/volunteer"
              className="bg-[#0f5238] hover:bg-[#072a1d] text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer shadow-md"
            >
              Explore Volunteer Roster &amp; Apply →
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 lg:px-8 bg-white border-t border-[#0f5238]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start bg-[#f4faf6] p-8 md:p-12 rounded-3xl border border-[#0f5238]/15">
            <div className="w-full md:w-1/3">
              <span className="text-xs font-black uppercase tracking-widest text-[#0f5238] mb-2 block">
                Guiding Principles
              </span>
              <h2 className="text-3xl font-black font-display text-[#002112] mb-3">
                Our Core Values
              </h2>
              <p className="text-[#404943] text-xs leading-relaxed">
                The non-negotiable principles that drive our software design and community decisions.
              </p>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl shrink-0">
                  volunteer_activism
                </span>
                <div>
                  <h4 className="font-bold text-[#002112] text-base mb-1 font-display">
                    Collaboration Over Competition
                  </h4>
                  <p className="text-[#404943] text-xs leading-relaxed">
                    The Pakistani market presents immense growth potential. We aim to multiply opportunities for all founders rather than divide them.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl shrink-0">
                  lock_open
                </span>
                <div>
                  <h4 className="font-bold text-[#002112] text-base mb-1 font-display">
                    Democratized Access
                  </h4>
                  <p className="text-[#404943] text-xs leading-relaxed">
                    Data and legal tools essential to startup creation should never be hidden behind expensive paywalls.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl shrink-0">
                  verified
                </span>
                <div>
                  <h4 className="font-bold text-[#002112] text-base mb-1 font-display">
                    Uncompromising Data Integrity
                  </h4>
                  <p className="text-[#404943] text-xs leading-relaxed">
                    We maintain strict verification standards across our startup registry to deliver trustworthy intelligence to investors and partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
