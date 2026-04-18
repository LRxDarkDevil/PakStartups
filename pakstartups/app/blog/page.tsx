"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const featured = {
  category: "FOUNDER JOURNEY",
  title: "How I Built Pakistan's First AgriTech Platform With Zero Funding",
  excerpt: "A deep dive into the challenges of scaling technology in rural Sindh and the unconventional strategies used to achieve product-market fit without VC capital.",
  author: "Fatima Khan",
  readTime: "12 min read",
  date: "Apr 2024",
  cover: "/images/image-026.jpg",
  avatar: "/images/image-025.jpg"
};

const posts = [
  { cover: "/images/image-027.jpg", avatar: "/images/image-028.jpg", category: "Case Study", title: "Scaling a Fintech Startup for the Unbanked Population", author: "Ahmed Ali", date: "May 10, 2024", read: "8 min read" },
  { cover: "/images/image-029.jpg", avatar: "/images/image-030.jpg", category: "Founder Journey", title: "The Eco-Friendly Revolution: From Karachi to the World", author: "Sara Sheikh", date: "May 10, 2024", read: "15 min read" },
  { cover: "/images/image-031.jpg", avatar: "/images/image-032.jpg", category: "Lessons Learned", title: "5 Mistakes We Made While Hiring Our First Engineering Team", author: "Zaid Munir", date: "May 05, 2024", read: "6 min read" },
  { cover: "/images/image-033.jpg", avatar: "/images/image-034.jpg", category: "Case Study", title: "Optimizing Supply Chains for the E-commerce Boom", author: "Hames Javed", date: "Apr 28, 2024", read: "10 min read" },
  { cover: "/images/image-035.jpg", avatar: "/images/image-036.jpg", category: "Founder Journey", title: "From Freelancer to Agency Owner: A 5-Year Roadmap", author: "Nida Malik", date: "Apr 25, 2024", read: "20 min read" },
  { cover: "/images/image-037.jpg", avatar: "/images/image-028.jpg", category: "Lessons Learned", title: "Closing Your First B2B Enterprise Client in MENA", author: "Usman Tariq", date: "Apr 11, 2024", read: "12 min read" },
];

const catColors: Record<string,string> = {
  "Case Study": "bg-[#d5fde2] text-[#0f5238]",
  "Founder Journey": "bg-[#b7f2a0] text-[#1e5111]",
  "Lessons Learned": "bg-[#caf2d7] text-[#2d6a4f]",
};

const bgColors = ["bg-[#caf2d7]","bg-[#d5fde2]","bg-[#cff7dd]","bg-[#c4ecd2]","bg-[#b7f2a0]","bg-[#caf2d7]"];
const icons = ["corporate_fare","park","menu_book","tablet","groups","location_city"];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("All Posts");

  const filteredPosts = activeTab === "All Posts" 
    ? posts 
    : posts.filter(p => p.category === (activeTab === "Founder Journeys" ? "Founder Journey" : activeTab === "Case Studies" ? "Case Study" : "Lessons Learned"));

  return (
    <>
      {/* Header */}
      <section className="bg-white py-12 px-8 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-2">Stories & Insights</h1>
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
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {["All Posts","Founder Journeys","Case Studies","Lessons Learned"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
              >
                {tab}
              </button>
            ))}
            <Link href="/blog/submit" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors ml-auto md:ml-0">
               Submit Your Story
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Featured Post */}
        <div className="bg-[#d5fde2] rounded-2xl p-8 mb-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <span className="inline-block bg-[#0f5238] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {featured.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#002112] mb-4 leading-tight">
              {featured.title}
            </h2>
            <p className="text-[#404943] mb-6 leading-relaxed">{featured.excerpt}</p>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <Image width={32} height={32} src={featured.avatar} alt="Author" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-[#002112]">{featured.author}</span>
              <span className="text-sm text-[#707973]">{featured.readTime} · {featured.date}</span>
              <button className="bg-[#0f5238] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2d6a4f] transition-all flex items-center gap-1">
                Read Story <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="w-full md:w-80 shrink-0 aspect-square rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
            <Image width={320} height={320} src={featured.cover} alt={featured.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.length > 0 ? filteredPosts.map((p, i) => (
            <div key={p.title} className="group cursor-pointer">
              <div className={`rounded-xl aspect-[16/10] flex items-center justify-center mb-4 overflow-hidden border border-[#e0e0e0]`}>
                <Image width={400} height={250} src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 ${catColors[p.category] || "bg-[#d5fde2] text-[#0f5238]"}`}>
                {p.category}
              </span>
              <h3 className="font-bold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors">{p.title}</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden"><Image width={24} height={24} src={p.avatar} alt={p.author} className="w-full h-full object-cover" /></div>
                <span className="text-xs text-[#707973]">{p.author}</span>
                <span className="text-xs text-[#707973]">· {p.date} · {p.read}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-16 text-center text-[#404943]">
                <span className="material-symbols-outlined text-5xl opacity-40 mb-3">article</span>
                <p className="font-bold">No stories found</p>
                <p className="text-sm">There are currently no featured {activeTab} available.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mb-20">
          <button className="border-2 border-[#cff7dd] text-[#002112] px-8 py-3 rounded-lg font-bold hover:border-[#0f5238] hover:text-[#0f5238] transition-all flex items-center gap-2 mx-auto">
            Load More Stories <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </div>

      {/* CTA Banner */}
      <section className="bg-[#0f5238] py-20 px-8 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Your Journey Inspires Others.</h2>
        <p className="text-[#a8e7c5] mb-8 max-w-xl mx-auto">
          We believe in the power of shared knowledge. Contribute your story and help cultivate the next generation of Pakistani founders.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-[#0f5238] transition-all">Submit Your Draft</button>
          <button className="bg-white text-[#0f5238] px-6 py-3 rounded-lg font-bold hover:bg-[#d5fde2] transition-all">View Contributor Guidelines</button>
        </div>
      </section>
    </>
  );
}
