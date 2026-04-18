"use client";

import { use, useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

type Startup = {
  id: string;
  name: string;
  tagline?: string;
  desc: string;
  category: string;
  city: string;
  stage: string;
  website?: string;
  linkedin?: string;
  founders?: string[];
  teamSize?: string;
  ownerId: string;
  ownerName: string;
  views?: number;
};

export default function StartupProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchStartup = async () => {
      // try slug field first, fallback to name-based match
      const q = query(collection(db, "startups"), where("slug", "==", slug), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setStartup({ id: snap.docs[0].id, ...snap.docs[0].data() } as Startup);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchStartup();
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-8xl mx-auto px-8 py-8 bg-[#e8ffee] min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-[#b4ef9d] rounded-xl" />
          <div className="h-32 bg-[#d5fde2] rounded-xl" />
          <div className="h-64 bg-white rounded-xl" />
        </div>
      </main>
    );
  }

  if (notFound || !startup) {
    return (
      <main className="max-w-3xl mx-auto px-8 py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-[#bfc9c1]">search_off</span>
        <h1 className="text-3xl font-black text-[#002112] mt-4 mb-2">Startup Not Found</h1>
        <p className="text-[#404943] mb-8">This startup may have been removed or the link is incorrect.</p>
        <Link href="/startups" className="bg-[#0f5238] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">Back to Directory</Link>
      </main>
    );
  }

  const isOwner = user?.uid === startup.ownerId;

  return (
    <main className="max-w-8xl mx-auto px-8 py-8 bg-[#e8ffee] min-h-screen">
      {/* Header */}
      <section className="relative mb-12 overflow-hidden rounded-xl bg-[#d5fde2]">
        <div className="h-48 w-full bg-[#b4ef9d]" />
        <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-12 relative z-10">
          <div className="bg-white p-2 rounded-xl shadow-lg border border-[#bfc9c1]/10">
            <div className="w-32 h-32 rounded-lg bg-[#caf2d7] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0f5238] text-6xl">rocket_launch</span>
            </div>
          </div>
          <div className="flex-1 mb-2">
            <h1 className="text-4xl font-black tracking-tighter text-[#002112] mb-2">{startup.name}</h1>
            {startup.tagline && <p className="text-lg text-[#404943] font-medium mb-4">{startup.tagline}</p>}
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1 rounded-full bg-[#0f5238] text-white text-xs font-bold tracking-wider uppercase">{startup.stage}</span>
              <span className="px-4 py-1 rounded-full bg-[#b4ef9d] text-[#3b6e2c] text-xs font-bold tracking-wider uppercase">{startup.category}</span>
              <span className="px-4 py-1 rounded-full bg-[#002112] text-white text-xs font-bold tracking-wider uppercase">{startup.city}</span>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            {isOwner ? (
              <Link href={`/startups/${slug}/edit`}
                className="flex items-center gap-2 px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold shadow-xl hover:-translate-y-[2px] transition-all">
                <span className="material-symbols-outlined text-xl">edit</span> Edit Startup
              </Link>
            ) : (
              <button className="flex items-center gap-2 px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold shadow-xl hover:-translate-y-[2px] transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl">connect_without_contact</span> Connect with Founder
              </button>
            )}
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#0f5238]/20 text-[#0f5238] rounded-lg font-bold hover:bg-[#0f5238]/5 transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl">language</span> Website
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-xl shadow-[0_8px_32px_rgba(15,82,56,0.04)]">
            <h3 className="text-2xl font-black text-[#002112] mb-4 tracking-tight">About</h3>
            <p className="text-[#404943] leading-relaxed text-lg">{startup.desc}</p>

            {startup.linkedin && (
              <div className="mt-8">
                <h3 className="text-xl font-black text-[#002112] mb-4 tracking-tight">Links</h3>
                <div className="flex flex-wrap gap-4">
                  {startup.website && (
                    <a href={startup.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3 rounded-lg bg-[#d5fde2] hover:bg-[#caf2d7] transition-colors group">
                      <span className="material-symbols-outlined text-[#0f5238]">language</span>
                      <span className="font-bold text-[#0f5238]">Website</span>
                    </a>
                  )}
                  <a href={startup.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 rounded-lg bg-[#d5fde2] hover:bg-[#caf2d7] transition-colors group">
                    <span className="material-symbols-outlined text-[#0f5238]">share</span>
                    <span className="font-bold text-[#0f5238]">LinkedIn</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#cff7dd] p-8 rounded-xl">
            <h4 className="text-xl font-black text-[#002112] mb-6">Startup Info</h4>
            <div className="space-y-4">
              {[
                ["Stage", startup.stage],
                ["Category", startup.category],
                ["City", startup.city],
                ["Team Size", startup.teamSize || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#002112]/5">
                  <span className="text-[#404943] font-medium">{label}</span>
                  <span className="font-bold text-[#0f5238]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {startup.founders && startup.founders.length > 0 && (
            <div className="bg-[#cff7dd] p-8 rounded-xl">
              <h4 className="text-xl font-black text-[#002112] mb-6">Founders</h4>
              <div className="space-y-4">
                {startup.founders.map((f) => (
                  <div key={f} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#b4ef9d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#0f5238] text-sm">person</span>
                    </div>
                    <span className="font-bold text-[#002112]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0f5238] p-8 rounded-xl text-white">
            <h4 className="font-black text-lg mb-3">Interested in connecting?</h4>
            <p className="text-[#a8e7c5] text-sm mb-4">Reach out to {startup.ownerName} to explore collaborations, investment, or partnerships.</p>
            <button className="w-full bg-white text-[#0f5238] font-bold py-3 rounded-lg text-sm hover:bg-[#d5fde2] transition-colors">
              Send Connection Request
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
