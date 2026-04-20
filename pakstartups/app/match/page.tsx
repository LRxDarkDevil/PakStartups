"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getMatchProfiles, getMatchProfilesByIds, getMyConnections, getReceivedRequests, sendConnectionRequest, type MatchProfile } from "@/lib/services/match";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useAuth } from "@/lib/context/AuthContext";
import { db } from "@/lib/firebase/config";

const ROLES = ["Founder", "Freelancer", "Student", "Tech Lead", "Mentor"];
const CITIES = ["All Cities", "Lahore", "Karachi", "Islamabad", "Faisalabad", "Peshawar", "Rawalpindi", "Multan", "Hyderabad", "Gwadar"];

const roleColors: Record<string, string> = {
  Founder: "bg-[#2d6a4f] text-[#a8e7c5]",
  "Tech Lead": "bg-[#b4ef9d] text-[#3b6e2c]",
  Student: "bg-[#caf2d7] text-[#0f5238]",
  Freelancer: "bg-[#caf2d7] text-[#0f5238]",
  Mentor: "bg-[#0f5238] text-white",
};

function SkeletonProfile() {
  return (
    <div className="bg-white p-8 rounded-xl animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-full bg-[#e0e0e0]" />
        <div className="h-5 w-20 bg-[#e0e0e0] rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-[#e0e0e0] rounded mb-2" />
      <div className="h-4 w-1/2 bg-[#e0e0e0] rounded mb-6" />
      <div className="h-4 w-full bg-[#e0e0e0] rounded mb-1" />
      <div className="h-4 w-2/3 bg-[#e0e0e0] rounded mb-6" />
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => <div key={i} className="h-5 w-16 bg-[#e0e0e0] rounded" />)}
      </div>
      <div className="h-10 w-full bg-[#e0e0e0] rounded-lg" />
    </div>
  );
}

type TabType = "Browse Matches" | "My Requests" | "Received Requests" | "Saved Profiles";

export default function MatchPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Browse Matches");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<MatchProfile[]>([]);
  const [myRequests, setMyRequests] = useState<MatchProfile[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [connecting, setConnecting] = useState<Set<string>>(new Set());
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [bookmarking, setBookmarking] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        if (activeTab === "Browse Matches") {
          const data = await getMatchProfiles(selectedRole || undefined, selectedCity !== "All Cities" ? selectedCity : undefined);
          setProfiles(data);
        } else if (activeTab === "Saved Profiles" && profile?.savedMatchProfileIds?.length) {
          setSavedProfiles(await getMatchProfilesByIds(profile.savedMatchProfileIds));
        } else if (activeTab === "My Requests" && user) {
          const requests = await getMyConnections(user.uid);
          const ids = requests.map((r) => r.toUid);
          setMyRequests(await getMatchProfilesByIds(ids));
        } else if (activeTab === "Received Requests" && user) {
          const requests = await getReceivedRequests(user.uid);
          const ids = requests.map((r) => r.fromUid);
          setReceivedRequests(await getMatchProfilesByIds(ids));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab, selectedRole, selectedCity, profile?.savedMatchProfileIds?.join(","), user?.uid]);

  const handleBookmark = async (profileId: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    setBookmarking((prev) => new Set([...prev, profileId]));
    const ref = doc(db, "users", user.uid);
    const savedIds = profile?.savedMatchProfileIds ?? [];
    const alreadySaved = savedIds.includes(profileId);
    await updateDoc(ref, {
      savedMatchProfileIds: alreadySaved ? arrayRemove(profileId) : arrayUnion(profileId),
    });
    setBookmarking((prev) => {
      const next = new Set(prev);
      next.delete(profileId);
      return next;
    });
  };

  const handleConnect = async (profile: MatchProfile) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    if (!profile.id) return;
    const id = profile.id;
    setConnecting((prev) => new Set([...prev, id]));
    try {
      await sendConnectionRequest(
        { uid: user.uid, name: user.displayName ?? user.email ?? "Unknown" },
        { uid: profile.uid, name: profile.name }
      );
      setConnected((prev) => new Set([...prev, id]));
    } catch (e) {
      console.error(e);
    } finally {
      setConnecting((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const profileCards = activeTab === "Saved Profiles"
    ? savedProfiles
    : activeTab === "My Requests"
      ? myRequests
      : activeTab === "Received Requests"
        ? receivedRequests
        : profiles;

  const filteredProfiles = profileCards.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.city, p.role, p.looking, p.skills.join(" ")].join(" ").toLowerCase().includes(q);
  });

  const openProfile = (uid: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    router.push(`/profile/${uid}`);
  };

  return (
    <>
      {/* Page Header with Tabs */}
      <section className="bg-white px-8 py-16 text-center border-b border-[#bfc9c1]/10">
        <h1 className="text-[3.5rem] font-[900] tracking-[-0.04em] text-[#002112] mb-4">Find Your Co-Founder</h1>
        <p className="text-lg text-[#404943] max-w-2xl mx-auto mb-12">
          Connect with talented people building Pakistan&apos;s future
        </p>
        <div className="flex justify-center gap-12 border-b border-[#bfc9c1]/20 overflow-x-auto no-scrollbar">
          {(["Browse Matches", "My Requests", "Received Requests", "Saved Profiles"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-4 border-[#0f5238]" : "text-[#404943] font-medium hover:text-[#0f5238]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-8 items-start">
        {activeTab === "Browse Matches" && (
          <>
            {/* Sidebar Filter */}
            <aside className="w-full md:w-1/4 bg-[#d5fde2] p-8 rounded-xl sticky top-28">
              <div className="space-y-8">
                {/* Search */}
                <div>
                  <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973]">search</span>
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Name or keyword..." className="w-full pl-10 pr-4 py-3 bg-[#c4ecd2] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all outline-none" />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">Role</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role === selectedRole ? "" : role)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedRole === role ? "bg-[#0f5238] text-white" : "bg-[#c4ecd2] text-[#404943] hover:bg-[#b4ef9d]/30"}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-[#002112] mb-3 uppercase tracking-wider">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full py-3 bg-[#c4ecd2] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 outline-none"
                  >
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </aside>

            {/* Profile Grid */}
            <div className="w-full md:w-3/4">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <SkeletonProfile key={i} />)}
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-xl border border-[#e0e0e0]">
                  <span className="material-symbols-outlined text-6xl text-[#bfc9c1] mb-4">group_off</span>
                  <h3 className="text-2xl font-bold text-[#002112]">No profiles found</h3>
                  <p className="text-[#404943] mt-2">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((p) => (
                    <div key={p.id} onClick={() => p.uid && openProfile(p.uid)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") p.uid && openProfile(p.uid); }} className="bg-white p-8 rounded-xl shadow-[0_8px_32px_rgba(15,82,56,0.04)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.08)] transition-all flex flex-col h-full cursor-pointer">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-full bg-[#b4ef9d] overflow-hidden flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#0f5238] text-2xl">person</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${roleColors[p.role] ?? "bg-gray-100 text-gray-600"}`}>{p.role}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#002112] mb-1">{p.name}</h3>
                      <p className="flex items-center text-[#404943] text-sm mb-6">
                        <span className="material-symbols-outlined text-sm mr-1">location_on</span>{p.city}
                      </p>
                      <div className="mb-6 flex-grow">
                        <p className="text-xs font-bold text-[#002112] mb-1 uppercase">Looking for</p>
                        <p className="text-[#404943] italic text-sm">&ldquo;{p.looking}&rdquo;</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {p.skills.map((sk) => (
                          <span key={sk} className="px-2 py-1 bg-[#caf2d7] text-[#0f5238] text-[10px] font-bold rounded">{sk}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConnect(p)}
                          disabled={!user || connected.has(p.id!) || connecting.has(p.id!)}
                          className={`flex-grow py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${connected.has(p.id!) ? "bg-[#d5fde2] text-[#0f5238]" : "bg-[#0f5238] text-white hover:opacity-90"} disabled:opacity-60`}
                        >
                          {connecting.has(p.id!) ? "Sending..." : connected.has(p.id!) ? "Request Sent ✓" : "Connect"}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); if (p.id) void handleBookmark(p.id); }} className="p-2.5 border border-[#bfc9c1]/30 rounded-lg text-[#0f5238] hover:bg-[#d5fde2] transition-colors">
                          <span className="material-symbols-outlined">bookmark</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab !== "Browse Matches" && (
          <div className="w-full text-center py-32 bg-white rounded-xl border border-[#bfc9c1]/20">
            <span className="material-symbols-outlined text-6xl text-[#bfc9c1] mb-4">
              {activeTab === "Saved Profiles" ? "bookmarks" : "forum"}
            </span>
            <h3 className="text-2xl font-bold text-[#002112]">{activeTab}</h3>
            {!user ? (
              <>
                <p className="text-[#404943] mt-2 mb-6">Create an account to view your {activeTab.toLowerCase()}.</p>
                <Link href="/auth/signup" className="px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all inline-block">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <p className="text-[#404943] mt-2 mb-6">No records found here yet.</p>
                <button onClick={() => setActiveTab("Browse Matches")} className="px-8 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                  Find Co-Founders
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
