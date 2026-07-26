"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const MATCH_PROFILES = [
  {
    role: "Looking for CTO / Tech Co-Founder",
    founder: "Mustafa R.",
    background: "Ex-KPMG Fintech Strategy Lead",
    stage: "Building B2B Credit Risk Engine",
    location: "Lahore",
    lookingFor: "Full-Stack Engineer with React & Node experience",
    tag: "Fintech",
  },
  {
    role: "Looking for Business / Growth Partner",
    founder: "Sara K.",
    background: "AI Researcher (Fast NUCES)",
    stage: "Building Multilingual Voice AI for Commerce",
    location: "Karachi",
    lookingFor: "GTM & Operations Lead with enterprise sales network",
    tag: "AI & SaaS",
  },
  {
    role: "Looking for Hardware / IoT Lead",
    founder: "Ali Raza",
    background: "Mechatronics Engineer (NUST)",
    stage: "Building Smart Agri-Sensors for Sugarcane Belt",
    location: "Faisalabad",
    lookingFor: "Embedded Systems Engineer & Agribusiness Partner",
    tag: "Agritech",
  },
];

export default function CoFounderHighlightSection() {
  return (
    <section className="relative py-24 px-6 lg:px-8 z-10 bg-[#e8ffee]/70 border-t border-[#0f5238]/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#002112]">
              Active Co-Founder Openings
            </h2>
            <p className="text-[#404943] text-base sm:text-lg mt-2 max-w-xl font-medium">
              Vetted Pakistani founders actively seeking technical CTOs, growth partners, and domain leads.
            </p>
          </div>

          <Link
            href="/match"
            className="inline-flex items-center justify-center gap-2 bg-[#0f5238] hover:bg-[#072a1d] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Create Matchmaking Profile</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MATCH_PROFILES.map((profile, i) => (
            <motion.div
              key={profile.founder}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white border border-[#0f5238]/15 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold text-[#0f5238] bg-[#d5fde2] px-3 py-1 rounded-full">
                    {profile.tag}
                  </span>
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#0f5238]">location_on</span>
                    {profile.location}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#002112] mb-1">
                  {profile.role}
                </h3>
                <div className="text-xs font-bold text-[#0f5238] mb-3">
                  {profile.founder} • {profile.background}
                </div>

                <div className="bg-[#f4faf6] p-3.5 rounded-2xl mb-4 border border-[#0f5238]/10">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Venture Concept:
                  </div>
                  <p className="text-xs font-semibold text-[#002112]">
                    {profile.stage}
                  </p>
                </div>

                <p className="text-xs text-[#404943] leading-relaxed">
                  <span className="font-bold text-[#002112]">Seeking:</span> {profile.lookingFor}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <Link
                  href="/match"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5238] hover:underline"
                >
                  <span>Connect with Founder</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
