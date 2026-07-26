"use client";

import { motion } from "framer-motion";

const stats = [
  {
    number: "100+",
    label: "Verified Startups",
    detail: "Curated national tech directory",
    icon: "verified",
  },
  {
    number: "14k+",
    label: "Ecosystem Builders",
    detail: "Active founder community network",
    icon: "groups",
  },
  {
    number: "National",
    label: "Pakistan-Wide Scope",
    detail: "Spanning all tech hubs & diaspora",
    icon: "map",
  },
  {
    number: "100%",
    label: "Free & Open Access",
    detail: "Public dealflow & founder guides",
    icon: "workspace_premium",
  },
];

export default function ProofStatsBar() {
  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#072a1d] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#0f5238]/60 relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10 divide-y divide-emerald-900/60 lg:divide-y-0 lg:divide-x">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`flex flex-col justify-between ${
                index > 0 ? "pt-4 lg:pt-0 lg:pl-8" : ""
              }`}
            >
              <div className="mb-2">
                <span className="material-symbols-outlined text-emerald-400 text-2xl sm:text-3xl">
                  {stat.icon}
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm font-bold text-emerald-200">
                  {stat.label}
                </div>
                <div className="text-xs text-emerald-400/80 mt-0.5 font-medium">
                  {stat.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
