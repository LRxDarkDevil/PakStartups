"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts, getFeaturedPost, type BlogPost } from "@/lib/services/blog";

const catColors: Record<string, string> = {
  "Case Study": "bg-[#d5fde2] text-[#0f5238]",
  "Founder Journey": "bg-[#b7f2a0] text-[#1e5111]",
  "Lessons Learned": "bg-[#caf2d7] text-[#2d6a4f]",
};

const TABS = ["All Posts", "Founder Journeys", "Case Studies", "Lessons Learned"];

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl aspect-[16/10] bg-[#e0e0e0] mb-4" />
      <div className="h-5 w-24 bg-[#e0e0e0] rounded-full mb-2" />
      <div className="h-6 w-3/4 bg-[#e0e0e0] rounded mb-1" />
      <div className="h-4 w-full bg-[#e0e0e0] rounded" />
    </div>
  );
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("All Posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [feat, data] = await Promise.all([
          getFeaturedPost(),
          getBlogPosts(activeTab),
        ]);
        setFeatured(feat);
        // Exclude the featured post from the grid
        setPosts(data.filter((p) => !feat || p.id !== feat.id));
        setVisibleCount(6);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab]);

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [post.title, post.excerpt, post.category, post.authorName].join(" ").toLowerCase().includes(q);
  });

  return (
    <>
      {/* Header */}
      <section className="bg-white py-12 px-8 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-2">Stories &amp; Insights</h1>
            <p className="text-[#404943]">Real journeys from Pakistan&apos;s builders</p>
          </div>
          <Link href="/blog/submit" className="flex items-center gap-2 bg-[#0f5238] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            <span className="material-symbols-outlined text-sm">edit</span>
            Share Your Story
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-6 overflow-x-auto no-scrollbar items-center">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
              >
                {tab}
              </button>
            ))}
            <Link href="/blog/submit" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors ml-auto">
              Submit Your Story
            </Link>
            <div className="relative ml-4 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-sm">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search stories..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Featured Post */}
        {featured && (
          <div className="bg-[#d5fde2] rounded-2xl p-8 mb-16 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <span className="inline-block bg-[#0f5238] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {featured.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#002112] mb-4 leading-tight">{featured.title}</h2>
              <p className="text-[#404943] mb-6 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-4">
                {featured.authorAvatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image width={32} height={32} src={featured.authorAvatar} alt="Author" className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="text-sm font-bold text-[#002112]">{featured.authorName}</span>
                <span className="text-sm text-[#707973]">{featured.readTime}</span>
                <button className="bg-[#0f5238] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2d6a4f] transition-all flex items-center gap-1">
                  Read Story <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
            {featured.cover && (
              <div className="w-full md:w-80 shrink-0 aspect-square rounded-2xl overflow-hidden">
                <Image width={320} height={320} src={featured.cover} alt={featured.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#f5faf6] rounded-xl">
            <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">article</span>
            <p className="font-bold text-[#002112]">No stories found</p>
            <p className="text-[#404943] text-sm mt-1">No posts in &quot;{activeTab}&quot; yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPosts.slice(0, visibleCount).map((p) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="rounded-xl aspect-[16/10] mb-4 overflow-hidden border border-[#e0e0e0]">
                  {p.cover ? (
                    <Image width={400} height={250} src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-[#d5fde2] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#0f5238]">article</span>
                    </div>
                  )}
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${catColors[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {p.category}
                </span>
                <h3 className="font-bold text-[#002112] text-lg leading-snug mb-3 group-hover:text-[#0f5238] transition-colors line-clamp-2">{p.title}</h3>
                <div className="flex items-center gap-2">
                  {p.authorAvatar && (
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image width={24} height={24} src={p.authorAvatar} alt={p.authorName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#002112]">{p.authorName}</span>
                  <span className="text-xs text-[#707973]">· {p.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && filteredPosts.length > visibleCount && (
          <div className="text-center">
            <button onClick={() => setVisibleCount((count) => count + 6)} className="px-8 py-3 border-2 border-[#0f5238] text-[#0f5238] rounded-lg font-bold hover:bg-[#0f5238] hover:text-white transition-all">
              Load More Stories
            </button>
          </div>
        )}
      </div>
    </>
  );
}
