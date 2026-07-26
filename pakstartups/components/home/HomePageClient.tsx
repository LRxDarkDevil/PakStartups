"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FounderStoriesSection from "@/components/home/FounderStoriesSection";
import { useState } from "react";
import posthog from "posthog-js";

const features = [
  {
    icon: "list_alt",
    title: "Startup Directory",
    desc: "Browse hundreds of local startups across all verticals. Find your next investment, B2B client, or inspiration in the PK tech scene.",
    cta: "Explore Now",
    href: "/startups",
    gradient: "from-emerald-100/80 to-teal-100/80",
    borderHover: "hover:border-[#0f5238]/30",
    textHover: "group-hover:text-[#0f5238]",
    iconBg: "bg-emerald-100",
    delay: 0,
  },
  {
    icon: "handshake",
    title: "Co-Founder Matchmaking",
    desc: "Looking for a CTO or business lead? Create a profile and connect directly with vetted talent actively looking to build.",
    cta: "Find Partner",
    href: "/match",
    gradient: "from-blue-100/80 to-indigo-100/80",
    borderHover: "hover:border-blue-500/30",
    textHover: "group-hover:text-blue-700",
    iconBg: "bg-blue-100",
    delay: 0.2,
  },
  {
    icon: "menu_book",
    title: "Knowledge Hub",
    desc: "Free access to PK-specific legal templates, pitch deck tear-downs, and actionable guides from founders who have successfully scaled.",
    cta: "Learn More",
    href: "/knowledge",
    gradient: "from-purple-100/80 to-pink-100/80",
    borderHover: "hover:border-purple-500/30",
    textHover: "group-hover:text-purple-700",
    iconBg: "bg-purple-100",
    delay: 0.4,
  },
  {
    icon: "storefront",
    title: "B2B Marketplace",
    desc: "Save thousands of dollars with exclusive startup-to-startup discounts on cloud credits, SaaS tools, and local infrastructure.",
    cta: "Browse Deals",
    href: "/b2b",
    gradient: "from-orange-100/80 to-amber-100/80",
    borderHover: "hover:border-orange-500/30",
    textHover: "group-hover:text-orange-700",
    iconBg: "bg-orange-100",
    delay: 0.6,
  },
];

const community = [
  {
    icon: "forum",
    title: "Discord Community",
    desc: "Join Pakistan's premier startup Discord for real-time discussions, co-founder chats, and tech events.",
    cta: "Join Discord Server",
    href: "https://discord.gg/pakstartups",
  },
  {
    icon: "chat",
    title: "Help Center",
    desc: "Find answers, contribution guides, and platform support.",
    cta: "Open FAQ",
    href: "/faq",
  },
  {
    icon: "public",
    title: "Email & Support",
    desc: "Direct line to the PakStartups team for strategic partnerships.",
    cta: "Contact Us",
    href: "mailto:hello@pakstartups.org",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      posthog.capture("homepage_search_execute", { query: searchQuery.trim() });
      router.push(`/startups?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/startups");
    }
  };

  return (
    <div className="bg-[#e8ffee] text-[#002112] min-h-screen selection:bg-[#b1f0ce] selection:text-[#002114] overflow-hidden">
      {/* Calm Ambient Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,82,56,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,82,56,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[400px] bg-emerald-200/30 rounded-full blur-[140px]" />
      </div>

      {/* Hero Section: Centered Discovery Search */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6 lg:px-8 z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={containerVariants}
        >
          {/* Ecosystem Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-[#d5fde2] border border-[#a8e7c5] text-[#0f5238] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">hub</span>
            Pakistan&apos;s Startup Network
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-[#002112] leading-[1.1]"
          >
            Discover Pakistan&apos;s High-Growth{" "}
            <span className="relative inline-block text-[#0f5238]">
              Tech Startups
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#b1f0ce] -z-10 rounded" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[#404943] text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-semibold"
          >
            Search hundreds of verified local startups, research founding teams, and discover investment and growth opportunities.
          </motion.p>

          {/* URL-Backed Search Input */}
          <motion.div variants={itemVariants} className="w-full max-w-2xl mb-6">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center bg-white border-2 border-[#a8e7c5] focus-within:border-[#0f5238] focus-within:ring-4 focus-within:ring-[#0f5238]/10 rounded-2xl p-2 shadow-xl transition-all">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl ml-3 mr-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search startups by name, industry (Fintech, AI, SaaS), or city..."
                  className="w-full bg-transparent text-[#002112] text-base sm:text-lg font-medium outline-none placeholder-[#707973] py-2 px-1"
                  aria-label="Search startups"
                />
                <button
                  type="submit"
                  className="bg-[#0f5238] hover:bg-[#0b3d29] text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <span>Search</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Search Suggestions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#404943] mb-10"
          >
            <span className="text-[#707973]">Popular filters:</span>
            {["Fintech", "AI & SaaS", "Pre-Seed", "Lahore", "Karachi", "Agritech"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  posthog.capture("homepage_search_chip_click", { tag });
                  router.push(`/startups?search=${encodeURIComponent(tag)}`);
                }}
                className="bg-white hover:bg-[#d5fde2] text-[#0f5238] px-3.5 py-1.5 rounded-full border border-[#a8e7c5] transition-all cursor-pointer shadow-sm"
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/startups"
              onClick={() => posthog.capture("homepage_explore_directory_click", { source: "hero_cta" })}
              className="inline-flex items-center justify-center gap-3 bg-[#0f5238] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_8px_30px_rgba(15,82,56,0.2)] hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              <span>Explore All Startups</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>

            <Link
              href="/startups/submit"
              className="inline-flex items-center justify-center gap-3 bg-white border-2 border-[#bfc9c1] hover:border-[#0f5238] text-[#0f5238] px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-xl transition-all hover:bg-[#cff7dd]/30 hover:-translate-y-0.5"
            >
              Submit Your Startup
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Grid / Core Ecosystem Infrastructure */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 z-10 bg-[#f4fff7]/90 backdrop-blur-xl border-t border-[#dbeee2]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-14 md:mb-20 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#0f5238] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3">
              Ecosystem Features
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#002112]">
              Built for Pakistan&apos;s Builders &amp; Investors
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`group relative bg-white border border-[#dbeee2] rounded-3xl p-8 shadow-sm flex flex-col h-full ${f.borderHover} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/50 ${f.iconBg} text-[#0f5238]`}>
                    <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                  </div>
                  <h3 className={`text-xl font-bold text-[#002112] mb-3 transition-colors ${f.textHover}`}>{f.title}</h3>
                  <p className="text-[#404943] text-sm leading-relaxed flex-grow">{f.desc}</p>
                  <div className="pt-6 mt-auto">
                    <Link
                      href={f.href}
                      className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-500 ${f.textHover}`}
                    >
                      {f.cta}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Stories Section */}
      <div className="relative z-10 bg-[#e8ffee]">
        <FounderStoriesSection />
      </div>

      {/* Community Section */}
      <section className="relative py-24 px-6 lg:px-8 z-10 bg-[#0f5238] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Join the Network
            </h2>
            <p className="text-lg text-[#a8e7c5]">
              A highly active community of builders, operators, and investors shaping tech in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {community.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="group relative bg-[#2d6a4f] border border-[#2d6a4f] p-8 rounded-3xl transition-all duration-300 flex flex-col hover:bg-[#a8e7c5]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-white group-hover:text-[#002112] transition-colors">
                    <span className="material-symbols-outlined text-4xl">{c.icon}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#a8e7c5] group-hover:text-[#002112] transition-colors text-xl">
                    arrow_outward
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#002112] transition-colors">{c.title}</h3>
                <p className="text-[#a8e7c5]/80 text-sm mb-6 flex-grow group-hover:text-[#002112]/80 transition-colors">{c.desc}</p>
                <div className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-wider text-xs group-hover:text-[#002112] transition-colors">
                  {c.cta}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
