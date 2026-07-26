"use client";

import { motion } from "framer-motion";

const communityChannels = [
  {
    icon: "forum",
    title: "14k+ Reddit Community",
    desc: "Join Pakistan's largest startup subreddit for ecosystem news, pitch feedback, and founder discussions.",
    cta: "Join Subreddit",
    href: "https://reddit.com/r/PakStartups",
    badge: "14,000+ Members",
  },
  {
    icon: "groups",
    title: "Vetted Founder WhatsApp Group",
    desc: "Concentrated network of 100+ active Pakistani founders, operators, and ecosystem mentors.",
    cta: "Request Access",
    href: "/contact?ref=whatsapp_group",
    badge: "100+ Vetted Founders",
  },
  {
    icon: "chat",
    title: "Discord & Live Discussions",
    desc: "Real-time tech channels, co-founder match calls, and community AMA sessions.",
    cta: "Join Discord Server",
    href: "https://discord.gg/pakstartups",
    badge: "Live Server",
  },
];

export default function CommunityHubSection() {
  return (
    <section className="relative py-28 px-6 lg:px-8 z-10 bg-[#072a1d] text-white overflow-hidden border-t border-[#0f5238]">
      {/* Background ambient highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mb-4">
            Join 14,000+ Builders Nationwide
          </h2>
          <p className="text-lg text-emerald-200/90 font-medium">
            Connect directly with verified Pakistani founders, operators, investors, and startup mentors across our active channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communityChannels.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group relative bg-[#0f5238]/60 hover:bg-emerald-950 border border-emerald-700/50 hover:border-emerald-400 p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-900/80 border border-emerald-700 text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{c.icon}</span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-400 group-hover:text-white transition-colors text-2xl">
                    arrow_outward
                  </span>
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full inline-block mb-3">
                  {c.badge}
                </span>

                <h3 className="text-2xl font-bold font-display text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-emerald-200/80 text-sm leading-relaxed mb-6 font-normal">
                  {c.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-800/60 mt-auto">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 group-hover:text-white transition-colors">
                  <span>{c.cta}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
