"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const pillars = [
  {
    icon: "list_alt",
    badge: "Startup Registry",
    title: "National Startup Directory",
    desc: "Browse 100+ verified Pakistani startups across Fintech, AI, Agritech, and Logistics. Research founding teams, funding stages, and market signals.",
    cta: "Explore Directory",
    href: "/startups",
    gradient: "bg-emerald-50",
    borderHover: "hover:border-[#0f5238]",
  },
  {
    icon: "handshake",
    badge: "Co-Founder Network",
    title: "Vetted Matchmaking Engine",
    desc: "Looking for a CTO, business lead, or domain co-founder? Connect directly with pre-screened talent actively building in Pakistan.",
    cta: "Find Partner",
    href: "/match",
    gradient: "bg-teal-50",
    borderHover: "hover:border-[#0f5238]",
  },
  {
    icon: "menu_book",
    badge: "Free Resources",
    title: "Legal & Knowledge Vault",
    desc: "100% free access to PK-specific SAFE notes, founder vesting agreements, pitch deck teardowns, and actionable scaling playbooks.",
    cta: "Access Vault",
    href: "/knowledge",
    gradient: "bg-emerald-50",
    borderHover: "hover:border-[#0f5238]",
  },
];

export default function EcosystemPillarsSection() {
  return (
    <section className="relative py-28 px-6 lg:px-8 z-10 bg-white border-t border-[#0f5238]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#002112]">
            Built for Pakistan&apos;s Founders &amp; Investors
          </h2>
          <p className="text-[#404943] text-base sm:text-lg mt-4 font-medium">
            Everything you need to discover ventures, build strong founding teams, and scale tech companies nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative bg-white border-2 border-[#0f5238]/15 rounded-3xl p-8 shadow-sm flex flex-col justify-between ${p.borderHover} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0f5238] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-3xl">{p.icon}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#d5fde2] text-[#0f5238] px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#002112] group-hover:text-[#0f5238] transition-colors mb-3 font-display">
                  {p.title}
                </h3>
                <p className="text-[#404943] text-sm leading-relaxed mb-8 font-normal">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-auto">
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0f5238] group-hover:underline"
                >
                  <span>{p.cta}</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
