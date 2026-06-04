"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Link from "next/link";
import FounderStoriesSection from "@/components/home/FounderStoriesSection";
import { useRef } from "react";

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
    title: "Reddit",
    desc: "Raw, unfiltered discussions, AMAs, and feedback on r/PakStartups.",
    cta: "Join Subreddit",
    href: "https://reddit.com/r/PakStartups",
  },
  {
    icon: "chat",
    title: "Help Center",
    desc: "Find answers, contribution guides, and support.",
    cta: "Open FAQ",
    href: "/faq",
  },
  {
    icon: "public",
    title: "Email Support",
    desc: "Direct line to the PakStartups team for partnerships.",
    cta: "Contact Us",
    href: "mailto:hello@pakstartups.org",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const float1: Variants = {
  animate: {
    y: [0, -12, 0],
    rotate: [-1, 1, -1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const float2: Variants = {
  animate: {
    y: [-8, 8, -8],
    rotate: [1, -1, 1],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5
    }
  }
};

const float3: Variants = {
  animate: {
    y: [4, -8, 4],
    rotate: [-0.5, 0.5, -0.5],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }
  }
};

export default function HomePageClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-[#e8ffee] text-[#002112] min-h-screen selection:bg-[#b1f0ce] selection:text-[#002114] overflow-hidden" ref={containerRef}>
      
      {/* Dynamic Grid Background - Light Mode */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f523812_1px,transparent_1px),linear-gradient(to_bottom,#0f523812_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 px-6 lg:px-8 z-10 flex items-center justify-center min-h-[80vh] overflow-hidden">
        {/* Glow Orbs - Larger, brighter for SaaS styling, but keeping light mode theme */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-[50vw] h-[50vw] bg-[#a8e7c5]/50 rounded-full blur-[120px] pointer-events-none -z-10"
          animate={{ 
            x: [0, 80, -80, 0], 
            y: [0, -60, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[#b1f0ce]/40 rounded-full blur-[100px] pointer-events-none -z-10"
          animate={{ 
            x: [0, -80, 80, 0], 
            y: [0, 80, -80, 0],
            scale: [1, 0.9, 1.1, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Headline and Badges */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ y: y1, opacity: opacity1 }}
          >
            {/* Live Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-[#d5fde2] border border-[#a8e7c5] text-[#0f5238] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 w-fit shadow-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="material-symbols-outlined text-sm animate-pulse">hub</span>
              Pakistan&apos;s Startup Network
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="text-4xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.2rem] font-black tracking-tight mb-6 text-[#002112]"
            >
              Pakistan&apos;s Startup Ecosystem,{" "}
              <br className="hidden sm:block" />
              <span className="relative inline-block text-[#0f5238]">
                All in One Place.
                <motion.div 
                  className="absolute bottom-1 sm:bottom-2 left-0 w-full h-3 bg-[#b1f0ce] -z-10"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.2, type: "spring", stiffness: 50 }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-[#404943] text-lg md:text-xl max-w-xl leading-relaxed mb-8 font-semibold"
            >
              Stop searching across fragmented networks. PakStartups is the central hub to discover local startups, find your technical or co-founder partner, and claim exclusive B2B deals.
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10"
            >
              <Link
                href="/startups"
                className="group relative inline-flex items-center justify-center gap-3 bg-[#0f5238] text-white px-8 py-4 rounded-xl font-bold text-lg overflow-hidden w-full sm:w-auto shadow-[0_8px_30px_rgba(15,82,56,0.25)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Explore Directory</span>
                <motion.span 
                  className="material-symbols-outlined text-xl relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  arrow_forward
                </motion.span>
              </Link>
              
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-3 bg-white border-2 border-[#bfc9c1] hover:border-[#0f5238] text-[#0f5238] px-8 py-4 rounded-xl font-bold text-lg w-full sm:w-auto shadow-sm hover:shadow-xl transition-all hover:bg-[#cff7dd]/30 hover:-translate-y-0.5"
              >
                Join Community
              </Link>
            </motion.div>

            {/* Core Pillars Feature Badges */}
            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-2 gap-4 border-t border-[#0f5238]/10 pt-8 max-w-lg w-full"
            >
              {[
                { icon: "list_alt", title: "Startup Directory", desc: "Discover vetted startups", href: "/startups" },
                { icon: "handshake", title: "Co-Founder Match", desc: "Connect with building partners", href: "/match" },
                { icon: "storefront", title: "B2B Marketplace", desc: "SaaS & infrastructure deals", href: "/b2b" },
                { icon: "menu_book", title: "Knowledge Hub", desc: "Legal & pitch templates", href: "/knowledge" }
              ].map((badge) => (
                <Link 
                  key={badge.title}
                  href={badge.href}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#d5fde2]/40 transition-colors group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#d5fde2] flex items-center justify-center text-[#0f5238] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl">{badge.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#002112] group-hover:text-[#0f5238] transition-colors">{badge.title}</h4>
                    <p className="text-xs text-[#707973] font-medium">{badge.desc}</p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive SaaS Mock Dashboard Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px] w-full mt-10 lg:mt-0">
            {/* Glow backing */}
            <div className="absolute w-[300px] h-[300px] bg-[#a8e7c5] rounded-full blur-[80px] opacity-30 -z-10 pointer-events-none" />
            
            {/* Interactive Dashboard Area */}
            <div className="relative w-full max-w-[420px] lg:max-w-none h-full scale-90 sm:scale-100 origin-center">
              
              {/* Card 1: Startup Directory Card */}
              <motion.div 
                className="absolute top-0 left-0 z-20 bg-white/95 backdrop-blur-md border border-[#bfc9c1]/40 shadow-[0_15px_35px_rgba(0,0,0,0.08)] rounded-2xl p-4 w-[260px] sm:w-[280px]"
                variants={float1}
                animate="animate"
                whileHover={{ scale: 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(15,82,56,0.18)", borderColor: "#0f5238" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0f5238]">
                      <span className="material-symbols-outlined text-xl">payments</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-[#002112]">PayEasy</span>
                        <span className="material-symbols-outlined text-xs text-emerald-600 fill-1">verified</span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#707973]">Fintech • Lahore</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#d5fde2] text-[#0f5238] px-2 py-0.5 rounded-full font-black">Pre-Seed</span>
                </div>
                <p className="text-xs text-[#404943] leading-normal mt-3">
                  Next-generation billing and local payment API infrastructure for startups in PK.
                </p>
                <div className="mt-4 flex items-center justify-between bg-[#f4fff7] rounded-xl p-2.5 border border-[#d5fde2]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-base font-black animate-bounce">trending_up</span>
                    <span className="text-xs font-black text-[#0f5238]">+38% MoM</span>
                  </div>
                  {/* Miniature Sparkline */}
                  <div className="flex items-end gap-1 h-6">
                    <div className="w-1.5 bg-emerald-200 h-2 rounded-t" />
                    <div className="w-1.5 bg-emerald-200 h-3 rounded-t" />
                    <div className="w-1.5 bg-emerald-300 h-2.5 rounded-t" />
                    <div className="w-1.5 bg-emerald-400 h-4.5 rounded-t" />
                    <div className="w-1.5 bg-[#0f5238] h-6 rounded-t" />
                  </div>
                </div>
                <div className="mt-3.5 flex gap-1.5">
                  <span className="text-[10px] bg-[#f0f3f1] text-[#404943] px-2 py-0.5 rounded font-bold">API</span>
                  <span className="text-[10px] bg-[#f0f3f1] text-[#404943] px-2 py-0.5 rounded font-bold">B2B</span>
                </div>
              </motion.div>

              {/* Card 2: Founder Matchmaking Card */}
              <motion.div 
                className="absolute top-28 right-0 sm:right-2 z-30 bg-white/95 backdrop-blur-md border border-[#bfc9c1]/40 shadow-[0_20px_45px_rgba(0,0,0,0.1)] rounded-2xl p-4 w-[250px] sm:w-[270px]"
                variants={float2}
                animate="animate"
                whileHover={{ scale: 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(15,82,56,0.18)", borderColor: "#0f5238" }}
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  CTO Match suggestion
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    ZR
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#002112]">Zainab Raza</h4>
                    <p className="text-[10px] font-semibold text-[#707973]">Full-Stack Lead • Karachi</p>
                  </div>
                </div>
                <div className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold mt-3 w-fit">
                  Looking for: Co-Founder & CEO
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {["React", "NodeJS", "AI Integrations"].map((s) => (
                    <span key={s} className="text-[9px] bg-blue-50/50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100">{s}</span>
                  ))}
                </div>
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-semibold">96% Skills Match</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-md">
                    Connect
                    <span className="material-symbols-outlined text-[10px] fill-1">send</span>
                  </button>
                </div>
              </motion.div>

              {/* Card 3: B2B Deal Card */}
              <motion.div 
                className="absolute bottom-0 left-4 sm:left-8 z-40 bg-white/97 backdrop-blur-md border border-[#bfc9c1]/40 shadow-[0_15px_30px_rgba(0,0,0,0.08)] rounded-2xl p-4 w-[230px] sm:w-[250px]"
                variants={float3}
                animate="animate"
                whileHover={{ scale: 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(15,82,56,0.18)", borderColor: "#0f5238" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-sm">gavel</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#707973]">Incorporation Partner</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <div className="text-2xl font-black text-amber-600 leading-none">Rs. 15,000</div>
                    <div className="text-[9px] text-[#707973] font-semibold mt-0.5">SECP Registration & Tax Setup</div>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded font-black">30% OFF</span>
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-dashed border-gray-150 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-semibold">TaxFast PK</span>
                  <span className="text-[10px] text-[#0f5238] font-black flex items-center gap-0.5 cursor-pointer hover:underline">
                    Claim Deal
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </div>
              </motion.div>
              
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid / What We Do */}
      <section className="relative py-24 md:py-32 px-6 lg:px-8 z-10 bg-[#f4fff7]/80 backdrop-blur-2xl border-t border-[#dbeee2]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <motion.div 
                className="w-12 h-1 bg-[#0f5238]"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <p className="text-[#0f5238] font-black uppercase tracking-[0.2em] text-sm">Ecosystem Infrastructure</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#002112] max-w-3xl">
              Everything you need to scale, <span className="text-gray-400">zero friction.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`group relative bg-white border border-[#dbeee2] rounded-3xl p-8 overflow-hidden shadow-sm flex flex-col h-full ${f.borderHover}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6, type: "spring", bounce: 0.4 }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(15,82,56,0.15)"
                }}
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/50 transition-colors duration-300 ${f.iconBg} text-[#0f5238]`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="material-symbols-outlined text-4xl">{f.icon}</span>
                  </motion.div>
                  <h3 className={`text-2xl font-bold text-[#002112] mb-4 transition-colors ${f.textHover}`}>{f.title}</h3>
                  <p className="text-[#404943] text-sm md:text-base leading-relaxed flex-grow">
                    {f.desc}
                  </p>
                  
                  <div className="pt-8 mt-auto">
                    <Link
                      href={f.href}
                      className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors text-gray-500 ${f.textHover}`}
                    >
                      {f.cta}
                      <motion.span 
                        className="material-symbols-outlined text-sm"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        arrow_forward
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Stories Integration */}
      <div className="relative z-10 bg-[#e8ffee]">
        <FounderStoriesSection />
      </div>

      {/* Community Section */}
      <section className="relative py-32 px-6 lg:px-8 z-10 bg-[#0f5238] text-white overflow-hidden">
        {/* Dynamic Background */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#2d6a4f] via-[#0f5238] to-[#0f5238] -z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                Join the Network
              </h2>
              <p className="text-xl text-[#a8e7c5]">
                A highly active community of builders, operators, and investors shaping the next decade of tech in Pakistan.
              </p>
            </div>
            <div className="hidden md:block">
              <motion.div 
                className="w-24 h-24 rounded-full border-2 border-[#a8e7c5]/30 flex items-center justify-center bg-[#a8e7c5]/5"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="material-symbols-outlined text-[#a8e7c5] text-4xl">diversity_3</span>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {community.map((c, i) => (
              <motion.a
                key={c.title}
                href={c.href}
                className="group relative bg-[#2d6a4f] border border-[#2d6a4f] p-8 rounded-3xl transition-all duration-300 flex flex-col overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
                whileHover={{ 
                  y: -10,
                  backgroundColor: "#a8e7c5",
                }}
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <motion.div 
                    className="text-white group-hover:text-[#002112] transition-colors"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <span className="material-symbols-outlined text-5xl">
                      {c.icon}
                    </span>
                  </motion.div>
                  <motion.span 
                    className="material-symbols-outlined text-[#a8e7c5] group-hover:text-[#002112] transition-colors text-2xl"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, x: 5, y: -5 }}
                  >
                    arrow_outward
                  </motion.span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#002112] transition-colors relative z-10">{c.title}</h3>
                <p className="text-[#a8e7c5]/80 mb-8 flex-grow group-hover:text-[#002112]/80 transition-colors relative z-10">{c.desc}</p>
                <div className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-wider text-xs group-hover:text-[#002112] transition-colors relative z-10">
                  {c.cta}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
