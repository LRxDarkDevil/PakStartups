"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getIdeas, getMyIdeas, upvoteIdea, downvoteIdea, type Idea } from "@/lib/services/ideas";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, type User } from "firebase/auth";

type Filter = "All" | "Most Voted" | "Most Discussed" | "Newest";

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-28 bg-[#e0e0e0] rounded-full" />
        <div className="h-4 w-32 bg-[#e0e0e0] rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-[#e0e0e0] rounded mb-2" />
      <div className="h-4 w-full bg-[#e0e0e0] rounded mb-1" />
      <div className="h-4 w-2/3 bg-[#e0e0e0] rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-[#e0e0e0] rounded-full" />
        <div className="h-5 w-20 bg-[#e0e0e0] rounded-full" />
      </div>
      <div className="h-px bg-[#f0f0f0] mb-4" />
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-[#e0e0e0] rounded" />
        <div className="h-4 w-20 bg-[#e0e0e0] rounded" />
      </div>
    </div>
  );
}

const stageColor: Record<string, string> = {
  "VALIDATION STAGE": "bg-[#b7f2a0] text-[#1e5111]",
  "PROBLEM DEFINED": "bg-[#caf2d7] text-[#0f5238]",
  "SOLUTION MVP": "bg-[#d5fde2] text-[#2d6a4f]",
  "SCALING": "bg-[#0f5238] text-white",
};

export default function IdeasPage() {
  const [activeTab, setActiveTab] = useState("Browse Ideas");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIdeas(activeFilter === "All" ? undefined : activeFilter);
      setIdeas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  useEffect(() => {
    if (activeTab === "My Ideas" && user) {
      getMyIdeas(user.uid).then(setMyIdeas);
    }
  }, [activeTab, user]);

  const handleUpvote = async (idea: Idea) => {
    if (!idea.id) return;
    const newSet = new Set(upvoted);
    if (newSet.has(idea.id)) return; // already voted
    newSet.add(idea.id);
    setUpvoted(newSet);
    setIdeas((prev) => prev.map((i) => i.id === idea.id ? { ...i, upvotes: i.upvotes + 1 } : i));
    await upvoteIdea(idea.id);
  };

  const handleDownvote = async (idea: Idea) => {
    if (!idea.id) return;
    setIdeas((prev) => prev.map((i) => i.id === idea.id ? { ...i, upvotes: Math.max(0, i.upvotes - 1) } : i));
    await downvoteIdea(idea.id);
  };

  const displayIdeas = (activeTab === "My Ideas" ? myIdeas : ideas).filter((idea) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [idea.title, idea.desc, idea.tags.join(" "), idea.stage].join(" ").toLowerCase().includes(q);
  });

  return (
    <>
      {/* Header */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Idea Validation</h1>
            <p className="text-[#404943] text-lg">Turn your idea into a validated business concept with community support</p>
          </div>
          <Link href="/ideas/submit" className="border-2 border-[#002112] text-[#002112] px-6 py-3 rounded-lg font-bold hover:bg-[#002112] hover:text-white transition-all">
            Submit an Idea
          </Link>
        </div>
      </section>

      <section className="bg-[#0f5238] px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
          <div>
            <p className="text-[#95d4b3] text-xs font-bold uppercase tracking-widest mb-2">Featured validation tools</p>
            <h2 className="text-3xl font-black">Validate faster before you build.</h2>
            <p className="text-[#a8e7c5] mt-2 max-w-2xl">Use the feasibility checker, survey builder, and MVP resources at the top of the page instead of hunting for them below.</p>
          </div>
          <Link href="/ideas/feasibility" className="px-5 py-3 rounded-lg bg-white text-[#0f5238] font-bold hover:bg-[#d5fde2] transition-all whitespace-nowrap">Open Feasibility Tool</Link>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap items-center gap-8 overflow-x-auto no-scrollbar">
            {["Browse Ideas", "My Ideas"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
              >
                {tab}
              </button>
            ))}
            <Link href="/ideas/submit" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">Submit an Idea</Link>
            <Link href="/ideas/feasibility" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">Feasibility Tool</Link>
            <Link href="/ideas/survey" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">Survey Builder</Link>
            <Link href="/ideas/resources" className="py-4 text-sm whitespace-nowrap text-[#404943] hover:text-[#0f5238] transition-colors">MVP Resources</Link>
            <div className="relative ml-auto">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-sm">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search ideas..." className="pl-10 pr-4 py-2.5 rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Ideas List */}
        <div className="flex-1">
          {activeTab === "My Ideas" && !user && (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">lock</span>
              <h3 className="text-xl font-bold text-[#002112]">Sign In Required</h3>
              <p className="text-[#404943] mt-2 mb-6">You need to be signed in to view your submitted ideas.</p>
              <Link href="/auth/login" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                Sign In
              </Link>
            </div>
          )}

          {activeTab === "My Ideas" && user && myIdeas.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">lightbulb</span>
              <h3 className="text-xl font-bold text-[#002112]">No Ideas Submitted</h3>
              <p className="text-[#404943] mt-2 mb-6">You haven&apos;t submitted any ideas yet.</p>
              <Link href="/ideas/submit" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                Submit Your First Idea
              </Link>
            </div>
          )}

          {activeTab === "Browse Ideas" && (
            <>
              {/* Sort/Filter bar */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm text-[#404943] font-medium">Sort by:</span>
                {(["All", "Most Voted", "Most Discussed", "Newest"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === f ? "bg-[#0f5238] text-white" : "bg-[#d5fde2] text-[#002112] hover:bg-[#caf2d7]"}`}
                  >
                    {f}
                  </button>
                ))}
                <div className="relative ml-auto">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973]">search</span>
                  <input type="text" placeholder="Search ideas..." className="pl-10 pr-4 py-2 bg-[#f5f5f5] rounded-lg text-sm outline-none" />
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : displayIdeas.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-[#e0e0e0]">
                  <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">lightbulb</span>
                  <h3 className="text-xl font-bold text-[#002112]">No ideas yet</h3>
                  <p className="text-[#404943] mt-2 mb-6">Be the first to share a startup idea with the community.</p>
                  <Link href="/ideas/submit" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                    Submit an Idea
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayIdeas.map((idea) => (
                    <div key={idea.id} className="bg-white border border-[#e0e0e0] rounded-xl p-6 hover:shadow-[0_8px_32px_rgba(15,82,56,0.08)] transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${stageColor[idea.stage] ?? "bg-gray-100 text-gray-600"}`}>{idea.stage}</span>
                        <div className="flex items-center gap-2">
                          {idea.authorAvatar && (
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <Image width={24} height={24} src={idea.authorAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="text-xs text-[#707973]">{idea.authorName}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-[#002112] text-lg mb-2">{idea.title}</h3>
                      <p className="text-[#404943] text-sm mb-4 line-clamp-2">{idea.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {idea.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded uppercase">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
                        <div className="flex items-center gap-4 text-sm text-[#707973]">
                          <button
                            onClick={() => handleUpvote(idea)}
                            className={`flex items-center gap-1 transition-colors ${upvoted.has(idea.id!) ? "text-[#0f5238] font-bold" : "hover:text-[#0f5238]"}`}
                          >
                            <span className="material-symbols-outlined text-sm">arrow_upward</span>{idea.upvotes}
                          </button>
                          <button onClick={() => void handleDownvote(idea)} className="flex items-center gap-1 hover:text-[#0f5238] transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_downward</span> Downvote
                          </button>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>{idea.comments}
                          </span>
                        </div>
                        <Link href={`/ideas/view?id=${idea.id ?? ""}`} className="text-[#0f5238] font-bold text-sm flex items-center gap-1">
                          View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#0f5238] rounded-xl p-6 text-white">
            <p className="text-[#95d4b3] text-xs font-bold uppercase tracking-wider mb-2">Premium Access</p>
            <h2 className="text-2xl font-black mb-3">Score your idea in 5 minutes</h2>
            <p className="text-[#a8e7c5] text-sm mb-6">Use our AI-driven validation engine to check market feasibility, competition, and regulatory hurdles.</p>
            <Link href="/ideas/feasibility" className="block bg-white text-[#0f5238] px-5 py-3 rounded-lg font-bold w-full hover:bg-[#d5fde2] transition-all text-center">Try the Tool →</Link>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e0e0e0]">
            <h3 className="font-bold text-[#002112] mb-4">Community Tips</h3>
            <div className="space-y-4">
              {[
                "Define the Problem Clearly — Focus on a specific pain point rather than a broad market gap.",
                "Early Feedback is Gold — Respond to all comments. The community loves engaged founders.",
                "Use Quantitative Data — Back your claims with initial survey data or research snippets.",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0f5238] mt-2 shrink-0" />
                  <p className="text-sm text-[#404943]"><b className="text-[#002112]">{tip.split("—")[0]}</b>{tip.includes("—") ? `— ${tip.split("—")[1]}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#d5fde2] rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-[#0f5238] mb-1">{ideas.length}+</div>
            <div className="text-sm text-[#404943] uppercase tracking-wider font-bold">Ideas Submitted</div>
          </div>
        </div>
      </div>
    </>
  );
}
