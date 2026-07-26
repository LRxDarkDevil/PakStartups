"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const POPULAR_TAGS = [
  { label: "Fintech", icon: "payments" },
  { label: "AI & SaaS", icon: "auto_awesome" },
  { label: "Pre-Seed", icon: "rocket_launch" },
  { label: "Agritech", icon: "agriculture" },
  { label: "Lahore", icon: "location_city" },
  { label: "Karachi", icon: "location_city" },
];

const LOOPING_PHRASES = [
  "Tech Giants",
  "Unicorns",
  "AI Pioneers",
  "Fintech Leaders",
  "SaaS Platforms",
];

function TypewriterHeadline() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Typewriter typing & deleting loop
  useEffect(() => {
    const currentWord = LOOPING_PHRASES[index];

    if (!reverse && subIndex === currentWord.length + 1) {
      const pauseTimeout = setTimeout(() => {
        setReverse(true);
      }, 2200);
      return () => clearTimeout(pauseTimeout);
    }

    if (reverse && subIndex === 0) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % LOOPING_PHRASES.length);
      return;
    }

    const typeTimeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 40 : 85
    );

    return () => clearTimeout(typeTimeout);
  }, [subIndex, index, reverse]);

  const textToDisplay = LOOPING_PHRASES[index].substring(0, subIndex);

  return (
    <span className="inline-flex items-center justify-center whitespace-nowrap relative min-h-[1.1em]">
      <span className="font-display font-normal italic text-[#0f5238] tracking-tight underline decoration-emerald-300 decoration-wavy decoration-2">
        {textToDisplay || "\u00A0"}
      </span>
      <span
        className={`inline-block font-sans font-light text-[#0f5238] ml-1 transition-opacity duration-100 ${
          blink ? "opacity-100" : "opacity-0"
        }`}
      >
        |
      </span>
    </span>
  );
}

export default function EditorialHero() {
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
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 lg:px-8 z-10 overflow-hidden bg-gradient-to-b from-[#e4f9eb] via-[#e8ffee] to-[#f4faf6]">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,82,56,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,82,56,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-emerald-200/40 rounded-full blur-[150px]" />
      </div>

      {/* Floating Animated Multiple Small & Crisp Geometric Shapes (No Giant Box) */}
      {!shouldReduceMotion && (
        <>
          {/* Shape 1: Small Glass Diamond (Top-Left of Headline) */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [45, 55, 45] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-[18%] lg:left-[24%] z-0 w-12 h-12 rounded-xl border-2 border-[#0f5238]/35 bg-white/80 backdrop-blur-xs shadow-md transform rotate-45 pointer-events-none opacity-90"
          />

          {/* Shape 2: Small Dashed Emerald Ring (Top-Right of Headline) */}
          <motion.div
            animate={{ y: [0, 12, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-[18%] lg:right-[24%] z-0 w-14 h-14 rounded-full border-2 border-dashed border-[#0f5238]/40 bg-emerald-400/20 backdrop-blur-xs pointer-events-none opacity-90"
          />

          {/* Shape 3: Small Floating Pill (Behind "Pakistan's") */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-36 left-[14%] sm:left-[20%] z-0 w-20 h-9 rounded-full border-2 border-emerald-600/35 bg-gradient-to-r from-emerald-300/35 via-white/80 to-emerald-200/40 shadow-sm pointer-events-none opacity-90"
          />

          {/* Shape 4: Small Dark Emerald Cube (Behind "Next") */}
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [-12, -24, -12] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-32 right-[14%] sm:right-[20%] z-0 w-10 h-10 rounded-lg border-2 border-[#072a1d]/35 bg-[#072a1d]/15 backdrop-blur-xs shadow-sm transform -rotate-12 pointer-events-none opacity-90"
          />

          {/* Shape 5: Small Glowing Mint Disc (Behind Line 3 Typewriter) */}
          <motion.div
            animate={{ y: [0, -9, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute top-56 left-[30%] sm:left-[35%] z-0 w-11 h-11 rounded-full border-2 border-emerald-500/40 bg-emerald-400/30 shadow-md backdrop-blur-xs pointer-events-none opacity-90"
          />

          {/* Shape 6: Small Glass Tile (Behind Right Side of Line 3) */}
          <motion.div
            animate={{ y: [0, 9, 0], rotate: [12, 24, 12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute top-52 right-[30%] sm:right-[35%] z-0 w-11 h-11 rounded-xl border-2 border-[#0f5238]/35 bg-white/85 shadow-sm transform rotate-12 pointer-events-none opacity-90"
          />

          {/* Shape 7: Small Floating Outer Diamond (Far Left) */}
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [15, 30, 15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:block absolute top-20 left-8 lg:left-14 z-0 w-14 h-14 rounded-2xl border-2 border-emerald-600/30 bg-white/70 backdrop-blur-xs shadow-lg transform rotate-12 pointer-events-none opacity-90"
          />

          {/* Shape 8: Small Outer Orbit Ring (Far Right) */}
          <motion.div
            animate={{ y: [0, 14, 0], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden md:block absolute top-24 right-8 lg:right-14 z-0 w-16 h-16 rounded-full border-2 border-emerald-600/35 bg-emerald-500/10 pointer-events-none opacity-90"
          />

          {/* Shape 9: Small Floating Gem (Subtitle Left) */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [45, 90, 45] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="hidden sm:block absolute top-76 left-[22%] z-0 w-8 h-8 rounded-lg border-2 border-emerald-600/40 bg-emerald-500/20 transform rotate-45 pointer-events-none opacity-90"
          />

          {/* Shape 10: Small Translucent Capsule (Subtitle Right) */}
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [-6, 6, -6] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            className="hidden sm:block absolute top-72 right-[22%] z-0 w-16 h-8 rounded-full border-2 border-emerald-600/35 bg-white/75 shadow-sm pointer-events-none opacity-90"
          />
        </>
      )}

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center w-full"
        >
          {/* Institutional Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-bricolage tracking-tight text-[#002112] leading-[1.15] mb-6 max-w-4xl text-center"
          >
            Discover &amp; Build <br />
            Pakistan&apos;s Next <br />
            <span className="inline-block whitespace-nowrap text-[#0f5238] mt-1">
              <TypewriterHeadline />
            </span>
          </motion.h1>

          {/* Subtitle & Value Proposition */}
          <motion.p
            variants={itemVariants}
            className="text-[#2c3d33] text-lg sm:text-xl md:text-2xl max-w-3xl leading-relaxed mb-10 font-medium"
          >
            Pakistan&apos;s primary startup registry. Research 100+ verified local ventures, connect with vetted co-founders, and explore open founder resources.
          </motion.p>

          {/* High-Impact CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12"
          >
            <Link
              href="/startups/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0f5238] hover:bg-[#072a1d] text-white px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-emerald-900/15 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border border-[#0f5238]"
            >
              <span className="material-symbols-outlined text-xl">add_business</span>
              <span>Submit Your Startup</span>
            </Link>

            <Link
              href="/match"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-[#d5fde2]/50 text-[#0f5238] border-2 border-[#0f5238]/30 hover:border-[#0f5238] px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">handshake</span>
              <span>Find Co-Founder</span>
            </Link>

            <Link
              href="/startups"
              onClick={() => posthog.capture("homepage_explore_directory_click", { source: "hero_cta" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0f5238] hover:text-[#072a1d] font-bold text-sm sm:text-base px-5 py-4 hover:underline transition-all cursor-pointer"
            >
              <span>Explore Directory</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </motion.div>

          {/* Universal Search Engine */}
          <motion.div variants={itemVariants} className="w-full max-w-3xl">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center bg-white border-2 border-[#0f5238]/20 focus-within:border-[#0f5238] focus-within:ring-4 focus-within:ring-[#0f5238]/10 rounded-2xl p-2.5 shadow-xl transition-all">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl ml-3 mr-2">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 100+ startups by name, vertical (Fintech, AI), or city..."
                  className="w-full bg-transparent text-[#002112] text-base sm:text-lg font-medium outline-none placeholder-[#707973] py-2 px-1"
                  aria-label="Search startups directory"
                />
                <button
                  type="submit"
                  className="bg-[#0f5238] hover:bg-[#072a1d] text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <span>Search</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </form>

            {/* Popular Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#404943] mt-4">
              <span className="text-[#606d64] font-bold uppercase tracking-wider text-[11px]">
                Quick Search:
              </span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.label);
                    posthog.capture("homepage_search_chip_click", { tag: tag.label });
                    router.push(`/startups?search=${encodeURIComponent(tag.label)}`);
                  }}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-[#0f5238] hover:text-white text-[#0f5238] px-3 py-1 rounded-full border border-[#0f5238]/20 transition-all cursor-pointer shadow-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">{tag.icon}</span>
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
