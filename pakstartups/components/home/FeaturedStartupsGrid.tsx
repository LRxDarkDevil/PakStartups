"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getStartups, type Startup } from "@/lib/services/startups";

const CATEGORIES = ["All", "Fintech", "AI & SaaS", "Healthtech", "Agritech", "E-commerce"];

export default function FeaturedStartupsGrid() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStartups() {
      setLoading(true);
      try {
        const fetched = await getStartups(activeCategory === "All" ? undefined : activeCategory);
        setStartups(fetched || []);
      } catch (err) {
        console.warn("Error fetching startups for homepage grid:", err);
        setStartups([]);
      } finally {
        setLoading(false);
      }
    }
    loadStartups();
  }, [activeCategory]);


  return (
    <section className="relative py-24 px-6 lg:px-8 z-10 bg-[#f4faf6]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#002112]">
              Featured Pakistani Startups
            </h2>
            <p className="text-[#404943] text-base sm:text-lg mt-2 max-w-xl font-medium">
              Explore high-growth ventures building across fintech, AI, agritech, and deep tech.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0f5238] text-white shadow-md"
                    : "bg-white text-[#0f5238] hover:bg-[#d5fde2] border border-[#0f5238]/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-[#0f5238]/15 rounded-3xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-12 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#0f5238]/15 rounded-3xl p-8">
            <span className="material-symbols-outlined text-5xl text-[#0f5238]/40 mb-3">search_off</span>
            <h3 className="text-xl font-bold font-display text-[#002112]">No startups found in this category</h3>
            <p className="text-sm text-[#404943] mt-1 font-medium">Try selecting another category or explore all verified startups.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.slice(0, 6).map((startup, i) => (
              <motion.div
                key={startup.id || startup.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group bg-white border border-[#0f5238]/15 hover:border-[#0f5238] rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#e8ffee] border border-[#0f5238]/20 flex items-center justify-center text-[#0f5238] font-bold text-xl overflow-hidden shrink-0">
                      {startup.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Verified
                      </span>
                      <span className="text-[11px] font-bold text-[#0f5238] bg-[#d5fde2] px-2.5 py-0.5 rounded-full">
                        {startup.stage}
                      </span>
                    </div>
                  </div>

                  {/* Name & Category */}
                  <h3 className="text-xl font-bold text-[#002112] group-hover:text-[#0f5238] transition-colors mb-1">
                    {startup.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#606d64] mb-3">
                    <span>{startup.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#0f5238]">location_on</span>
                      {startup.city}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#404943] text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                    {startup.desc}
                  </p>
                </div>

                {/* Bottom Details Row */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-medium text-[#707973]">
                    By {startup.ownerName}
                  </span>
                  <Link
                    href={`/startups/${startup.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5238] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/startups"
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-[#d5fde2] text-[#0f5238] border-2 border-[#0f5238] px-8 py-4 rounded-2xl font-bold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>Explore All 100+ Startups</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
