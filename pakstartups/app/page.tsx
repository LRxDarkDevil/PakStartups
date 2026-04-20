import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PakStartups — Where Pakistan's Founders Build Together",
  description:
    "Discover startups, find co-founders, access the B2B marketplace, and join Pakistan's most active startup community.",
};

const stats = [
  { value: "500+", label: "Startups Listed" },
  { value: "2,000+", label: "Community Members" },
  { value: "50+", label: "Events Held" },
  { value: "30+", label: "Resource Guides" },
];

const features = [
  {
    icon: "list_alt",
    title: "Startup Directory",
    desc: "Discover the next big things brewing in Pakistan's tech landscape across all verticals.",
    cta: "Explore Now",
    href: "/startups",
    offset: false,
  },
  {
    icon: "handshake",
    title: "Co-Founder Matchmaking",
    desc: "Find the Wozniak to your Jobs. Connect with talent that shares your vision and grit.",
    cta: "Find Partner",
    href: "/match",
    offset: true,
  },
  {
    icon: "menu_book",
    title: "Knowledge Hub",
    desc: "Access curated playbooks, legal templates, and localized guides for the PK market.",
    cta: "Learn More",
    href: "/knowledge",
    offset: false,
  },
  {
    icon: "storefront",
    title: "B2B Marketplace",
    desc: "Unlock exclusive startup-to-startup deals on services, tools, and local infra.",
    cta: "Browse Deals",
    href: "/b2b",
    offset: true,
  },
];

const community = [
  {
    icon: "forum",
    title: "Reddit",
    desc: "Raw discussions, Q&As, and community feedback on r/PakStartups.",
    cta: "Go to Subreddit",
    href: "https://reddit.com/r/PakStartups",
  },
  {
    icon: "chat",
    title: "Help Center",
    desc: "Find answers, guides, and support when you need it most.",
    cta: "Open FAQ",
    href: "/faq",
  },
  {
    icon: "public",
    title: "Email Support",
    desc: "Reach the PakStartups team directly for partnerships or help.",
    cta: "hello@pakstartups.org",
    href: "mailto:hello@pakstartups.org",
  },
];

const stories = [
  {
    tag: "FinTech • Karachi",
    title: "How 'PayPak' grew to 1M users in 12 months with $0 marketing.",
    excerpt:
      "An inside look at the product-led growth strategy that disrupted the local payments landscape...",
    author: "Ahmed Shah",
    readTime: "6 min read",
    bgColor: "bg-[#caf2d7]",
  },
  {
    tag: "AgriTech • Lahore",
    title: "Bridging the field: Why data is the new fertilizer for Punjab's farmers.",
    excerpt:
      "Zubair Malik discusses the challenges of digitizing the most traditional sector of our economy...",
    author: "Sara Khan",
    readTime: "8 min read",
    bgColor: "bg-[#d5fde2]",
  },
  {
    tag: "SaaS • Islamabad",
    title: "The Pivot: From failed e-commerce to Pakistan's fastest growing CRM.",
    excerpt:
      "The story of resilience and listening to the market when everyone else told them to quit...",
    author: "Bilal Murtaza",
    readTime: "5 min read",
    bgColor: "bg-[#cff7dd]",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#d5fde2] pt-20 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              {["r/PakStartups", "Discord", "LinkedIn"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-[#b7f2a0] text-[#1e5111] text-xs font-bold tracking-wider rounded-full uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#002112] leading-[1.05] tracking-tighter">
              Where curious minds, first timers and dreamers figure it out and build Pakistan&apos;s tomorrow together.
            </h1>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/startups"
                className="bg-gradient-to-br from-[#0f5238] to-[#2d6a4f] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-[0_8px_40px_rgba(15,82,56,0.15)] active:scale-95 transition-transform hover:opacity-95"
              >
                Explore the Ecosystem
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-[#0f5238] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#cff7dd] transition-colors active:scale-95 transition-transform"
              >
                Join Community
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#95d4b3]/20 rounded-full blur-3xl" />
            <div className="relative z-10 w-full aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(15,82,56,0.12)]">
              <img src="/images/image-038.jpg" alt="Pakistan's Startup Hub" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-16 px-8 relative -mt-12 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-xl max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-[#bfc9c1]/20">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-black text-[#0f5238] mb-2">{stat.value}</span>
              <span className="text-sm font-medium text-[#404943] uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About / Purpose */}
      <section className="bg-[#f4fff7] py-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f5238] mb-4">About PakStartups</p>
            <h2 className="text-4xl font-black text-[#002112] tracking-tight mb-6">A practical home base for founders building in Pakistan.</h2>
            <p className="text-[#404943] text-lg leading-relaxed mb-6">
              PakStartups exists to make the ecosystem easier to navigate: discover startups, find co-founders, validate ideas, and connect with organizations that can actually help you move forward.
            </p>
            <p className="text-[#404943] text-lg leading-relaxed">
              The goal is simple. Less scattered information, more useful action.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Discover", "Startups, stories, and ecosystem support in one place."],
              ["Connect", "Meet founders, mentors, and service providers."],
              ["Validate", "Tools and resources to pressure-test ideas early."],
              ["Grow", "Events, B2B, and community paths that stay useful."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,82,56,0.06)] border border-[#dbeee2]">
                <h3 className="font-black text-[#0f5238] mb-2">{title}</h3>
                <p className="text-sm text-[#404943] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-[#d5fde2]/30 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-[#002112] tracking-tight mb-4">
              Everything You Need to Build
            </h2>
            <div className="w-24 h-1.5 bg-[#0f5238] rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className={`bg-white p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.08)] transition-all duration-500 group${f.offset ? " lg:mt-8" : ""}`}
              >
                <div className="w-14 h-14 bg-[#caf2d7] rounded-xl flex items-center justify-center mb-6 text-[#0f5238] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#002112] mb-3">{f.title}</h3>
                <p className="text-[#404943] text-sm leading-relaxed mb-6">{f.desc}</p>
                <Link
                  href={f.href}
                  className="text-[#0f5238] font-bold text-xs uppercase tracking-widest flex items-center gap-2 group/link"
                >
                  {f.cta}{" "}
                  <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-[#0f5238] py-24 px-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <span className="material-symbols-outlined text-[400px] leading-none">diversity_3</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16 text-center">
            Join the Conversation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {community.map((c) => (
              <div
                key={c.title}
                className="bg-[#2d6a4f] p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-12">
                  <span
                    className="material-symbols-outlined text-5xl"
                    style={c.iconFilled ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {c.icon}
                  </span>
                  <span className="material-symbols-outlined opacity-40">open_in_new</span>
                </div>
                <h3 className="text-2xl font-black mb-4">{c.title}</h3>
                <p className="text-[#a8e7c5]/80 mb-8">{c.desc}</p>
                <a
                  href={c.href}
                  className="block bg-white text-[#0f5238] px-6 py-3 rounded-lg font-bold text-center hover:bg-[#d5fde2] transition-colors"
                >
                  {c.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-[#002112] tracking-tight mb-2">
                Founder Stories
              </h2>
              <p className="text-[#404943] font-medium">
                Real journeys from Pakistan&apos;s most resilient entrepreneurs.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-[#0f5238] font-bold flex items-center gap-2 group"
            >
              View All Stories{" "}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="space-y-12">
            {stories.map((s) => (
              <div
                key={s.title}
                className="flex flex-col md:flex-row gap-8 items-center group cursor-pointer"
              >
                <div
                  className={`w-full md:w-1/3 aspect-[16/10] rounded-xl overflow-hidden flex items-center justify-center`}
                >
                  <img src={`/images/image-0${39 + stories.indexOf(s)}.jpg`} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-full md:w-2/3">
                  <span className="text-[#0f5238] font-bold text-xs uppercase tracking-widest mb-3 block">
                    {s.tag}
                  </span>
                  <h3 className="text-3xl font-black text-[#002112] mb-4 group-hover:text-[#0f5238] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[#404943] text-lg leading-relaxed mb-6">{s.excerpt}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#cff7dd]" />
                    <span className="text-sm font-bold text-[#002112]">By {s.author}</span>
                    <span className="text-sm text-[#404943]">• {s.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
