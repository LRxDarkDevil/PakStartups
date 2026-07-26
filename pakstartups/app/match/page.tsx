"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { arrayRemove, arrayUnion, doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
  getMatchProfiles,
  getMatchProfilesByIds,
  getMyConnections,
  getReceivedRequests,
  sendConnectionRequest,
  updateConnectionStatus,
  cancelConnectionRequest,
  type MatchProfile,
  type ConnectionRequest,
} from "@/lib/services/match";
import { formatLocation, REGIONS, type RegionId } from "@/lib/location";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useAuth } from "@/lib/context/AuthContext";

const ROLES = ["Founder", "Freelancer", "Student", "Tech Lead", "Mentor"];

const roleColors: Record<string, string> = {
  Founder: "bg-[#072a1d] text-emerald-300 border border-emerald-700",
  "Tech Lead": "bg-emerald-900 text-white border border-emerald-700",
  Student: "bg-emerald-100 text-[#0f5238] border border-emerald-300",
  Freelancer: "bg-emerald-100 text-[#0f5238] border border-emerald-300",
  Mentor: "bg-[#0f5238] text-white border border-[#0f5238]",
};

function SkeletonProfile() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#0f5238]/15 animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gray-200" />
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-6" />
      <div className="h-4 w-full bg-gray-100 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-100 rounded mb-6" />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => <div key={i} className="h-5 w-16 bg-gray-200 rounded" />)}
      </div>
      <div className="h-10 w-full bg-gray-200 rounded-xl" />
    </div>
  );
}

function AvatarDisplay({ photoURL, name, className = "w-14 h-14" }: { photoURL?: string; name: string; className?: string }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  if (photoURL && !imgErr) {
    return (
      <div className={`${className} rounded-2xl overflow-hidden shrink-0 border border-[#0f5238]/20 bg-[#e8ffee]`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoURL}
          alt={name}
          onError={() => setImgErr(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-2xl bg-[#0f5238] text-white font-black flex items-center justify-center shrink-0 border border-[#0f5238]/20 text-sm`}>
      {initials}
    </div>
  );
}

type TabType = "Browse Matches" | "My Connections" | "Received Requests" | "Saved Profiles";

function MatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Browse Matches");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionId | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<MatchProfile[]>([]);
  const [myRequestsList, setMyRequestsList] = useState<{ request: ConnectionRequest; profile?: MatchProfile }[]>([]);
  const [receivedRequestsList, setReceivedRequestsList] = useState<{ request: ConnectionRequest; profile?: MatchProfile }[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [connecting, setConnecting] = useState<Set<string>>(new Set());
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [bookmarking, setBookmarking] = useState<Set<string>>(new Set());
  const [sentRequestToUids, setSentRequestToUids] = useState<Set<string>>(new Set());
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [noteTarget, setNoteTarget] = useState<MatchProfile | null>(null);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const normalized = tabParam.toLowerCase().replace(/[-_]/g, " ");
      if (normalized.includes("received")) setActiveTab("Received Requests");
      else if (normalized.includes("saved")) setActiveTab("Saved Profiles");
      else if (normalized.includes("connect") || normalized.includes("request")) setActiveTab("My Connections");
      else if (normalized.includes("browse")) setActiveTab("Browse Matches");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const q = query(
        collection(db, "connections"),
        where("fromUid", "==", user.uid)
      );
      const snap = await getDocs(q);
      const uids = new Set(snap.docs.map((d) => d.data().toUid));
      setSentRequestToUids(uids);
    })();
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        if (activeTab === "Browse Matches") {
          const data = await getMatchProfiles(selectedRole || undefined, selectedRegion || undefined);
          setProfiles(data);
        } else if (activeTab === "Saved Profiles" && profile?.savedMatchProfileIds?.length) {
          setSavedProfiles(await getMatchProfilesByIds(profile.savedMatchProfileIds));
        } else if (activeTab === "My Connections" && user) {
          const requests = await getMyConnections(user.uid);
          const partnerUids = requests.map((r) => r.fromUid === user.uid ? r.toUid : r.fromUid);
          const profs = await getMatchProfilesByIds(partnerUids);
          const profMap = new Map(profs.map((p) => [p.uid, p]));
          setMyRequestsList(requests.map((r) => {
            const partnerUid = r.fromUid === user.uid ? r.toUid : r.fromUid;
            return { request: r, profile: profMap.get(partnerUid) };
          }));
        } else if (activeTab === "Received Requests" && user) {
          const requests = await getReceivedRequests(user.uid);
          const uids = requests.map((r) => r.fromUid);
          const profs = await getMatchProfilesByIds(uids);
          const profMap = new Map(profs.map((p) => [p.uid, p]));
          setReceivedRequestsList(requests.map((r) => ({ request: r, profile: profMap.get(r.fromUid) })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab, selectedRole, selectedRegion, profile?.savedMatchProfileIds?.join(","), user?.uid]);

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

    if (alreadySaved) {
      setSavedProfiles((prev) => prev.filter((p) => p.id !== profileId && p.uid !== profileId));
    }

    setBookmarking((prev) => {
      const next = new Set(prev);
      next.delete(profileId);
      return next;
    });
  };

  const handleConnect = async (p: MatchProfile, note?: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    const targetId = p.id || p.uid;
    if (!targetId) return;
    setConnecting((prev) => new Set([...prev, targetId]));
    try {
      const actorName = profile?.fullName || user.displayName || user.email || "User";
      await sendConnectionRequest(
        { uid: user.uid, name: actorName },
        { uid: p.uid, name: p.name },
        note
      );
      setConnected((prev) => new Set([...prev, targetId]));
      setSentRequestToUids((prev) => new Set([...prev, p.uid]));
    } catch (e) {
      console.error(e);
    } finally {
      setConnecting((prev) => { const s = new Set(prev); s.delete(targetId); return s; });
    }
  };

  const handleAcceptRequest = async (connId: string, fromUid: string) => {
    if (!user || !connId) return;
    setProcessingAction(connId);
    try {
      const actorName = profile?.fullName || user.displayName || user.email || "User";
      await updateConnectionStatus(connId, "accepted", { uid: user.uid, name: actorName });
      setReceivedRequestsList((prev) => prev.filter((item) => item.request.id !== connId));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeclineRequest = async (connId: string) => {
    if (!user || !connId) return;
    setProcessingAction(connId);
    try {
      const actorName = profile?.fullName || user.displayName || user.email || "User";
      await updateConnectionStatus(connId, "declined", { uid: user.uid, name: actorName });
      setReceivedRequestsList((prev) => prev.filter((item) => item.request.id !== connId));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleCancelRequest = async (connId: string, toUid: string) => {
    if (!user || !connId) return;
    setProcessingAction(connId);
    try {
      await cancelConnectionRequest(connId);
      setMyRequestsList((prev) => prev.filter((item) => item.request.id !== connId));
      setSentRequestToUids((prev) => {
        const next = new Set(prev);
        next.delete(toUid);
        return next;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  const openProfile = (uid: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    router.push(`/profile/${uid}`);
  };

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.city, p.region, p.role, p.looking || "", p.skills.join(" ")].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#f4faf6] min-h-screen">
      {/* Header with Navigation Tabs */}
      <header className="bg-[#e4f9eb] py-16 px-6 lg:px-8 text-center border-b border-[#0f5238]/15">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black font-display text-[#002112] tracking-tight mb-4">
            Co-Founder Matchmaking Engine
          </h1>
          <p className="text-lg text-[#304237] font-medium max-w-2xl mx-auto mb-10">
            Connect directly with technical CTOs, business builders, and domain partners building Pakistan&apos;s tech future.
          </p>

          <div className="flex justify-center gap-6 sm:gap-10 border-b border-[#0f5238]/20 overflow-x-auto no-scrollbar pb-0">
            {(["Browse Matches", "My Connections", "Received Requests", "Saved Profiles"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 whitespace-nowrap text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "text-[#0f5238] border-b-3 border-[#0f5238]"
                    : "text-[#606d64] hover:text-[#0f5238]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 items-start">
        {activeTab === "Browse Matches" && (
          <>
            {/* Sidebar Filter */}
            <aside className="w-full md:w-1/4 bg-white border border-[#0f5238]/15 p-6 rounded-3xl shadow-sm sticky top-28 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#0f5238]">
                    search
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Name, skills, or role..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4faf6] border border-[#0f5238]/20 rounded-xl focus:border-[#0f5238] text-xs font-medium text-[#002112] outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2">
                  Role
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role === selectedRole ? "" : role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedRole === role
                          ? "bg-[#0f5238] text-white"
                          : "bg-[#f4faf6] text-[#0f5238] hover:bg-[#d5fde2]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="match-region"
                  className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2"
                >
                  Region
                </label>
                <select
                  id="match-region"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as RegionId | "")}
                  className="w-full py-2.5 px-3 bg-[#f4faf6] border border-[#0f5238]/20 focus:border-[#0f5238] rounded-xl outline-none text-xs font-bold text-[#002112]"
                >
                  <option value="">All Pakistan Regions</option>
                  {REGIONS.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </aside>

            {/* Profile Grid */}
            <main className="w-full md:w-3/4">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <SkeletonProfile key={i} />)}
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-[#0f5238]/15">
                  <span className="material-symbols-outlined text-6xl text-[#0f5238]/40 mb-4">group_off</span>
                  <h3 className="text-2xl font-bold font-display text-[#002112]">No profiles found</h3>
                  <p className="text-[#404943] text-sm mt-2">Try adjusting your role or keyword filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((p) => {
                    const profileIdKey = p.id || p.uid;
                    const isSaved = profile?.savedMatchProfileIds?.includes(profileIdKey) || profile?.savedMatchProfileIds?.includes(p.uid);
                    return (
                      <div
                        key={profileIdKey}
                        onClick={() => p.uid && openProfile(p.uid)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") p.uid && openProfile(p.uid); }}
                        className="bg-white p-6 rounded-3xl border border-[#0f5238]/15 hover:border-[#0f5238] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <AvatarDisplay photoURL={p.photoURL} name={p.name} />
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${roleColors[p.role] ?? "bg-gray-100 text-gray-700"}`}>
                              {p.role}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-display text-[#002112] mb-1">{p.name}</h3>
                          <p className="flex items-center text-[#606d64] text-xs font-semibold mb-4">
                            <span className="material-symbols-outlined text-sm mr-1 text-[#0f5238]">location_on</span>
                            {formatLocation(p)}
                          </p>

                          {Boolean(p.looking?.trim()) && (
                            <div className="mb-4 bg-[#f4faf6] p-3 rounded-xl border border-[#0f5238]/10">
                              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Looking For:</p>
                              <p className="text-xs font-medium text-[#002112] italic">&ldquo;{p.looking?.trim()}&rdquo;</p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {p.skills.map((sk) => (
                              <span key={sk} className="px-2 py-0.5 bg-[#e8ffee] text-[#0f5238] text-[10px] font-bold rounded-md border border-[#0f5238]/20">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!user) { router.push("/auth/signup"); return; }
                              setNoteTarget(p);
                              setNoteInput("");
                            }}
                            disabled={!user || connected.has(profileIdKey) || connecting.has(profileIdKey) || sentRequestToUids.has(p.uid)}
                            className={`flex-grow py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                              connected.has(profileIdKey) || sentRequestToUids.has(p.uid)
                                ? "bg-[#d5fde2] text-[#0f5238] border border-[#0f5238]/30"
                                : "bg-[#0f5238] text-white hover:bg-[#072a1d]"
                            } disabled:opacity-60`}
                          >
                            {connecting.has(profileIdKey) ? "Sending..." : (connected.has(profileIdKey) || sentRequestToUids.has(p.uid)) ? "Request Sent ✓" : "Connect"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); void handleBookmark(profileIdKey); }}
                            className={`p-2.5 border border-[#0f5238]/20 rounded-xl hover:bg-[#d5fde2] transition-all flex items-center justify-center cursor-pointer ${
                              isSaved ? "bg-[#d5fde2] text-[#0f5238] font-bold" : "text-[#606d64]"
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {isSaved ? "bookmark" : "bookmark_border"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </>
        )}

        {activeTab !== "Browse Matches" && (
          <div className="w-full">
            {!user ? (
              <div className="w-full text-center py-28 bg-white rounded-3xl border border-[#0f5238]/15">
                <span className="material-symbols-outlined text-6xl text-[#0f5238]/40 mb-4">
                  {activeTab === "Saved Profiles" ? "bookmarks" : "forum"}
                </span>
                <h3 className="text-2xl font-bold font-display text-[#002112] mb-2">{activeTab}</h3>
                <p className="text-[#404943] text-sm mb-6 max-w-sm mx-auto">
                  Create a free account to access your saved co-founder matches and connection requests.
                </p>
                <Link href="/auth/signup" className="px-8 py-3.5 bg-[#0f5238] text-white rounded-xl font-bold text-sm hover:bg-[#072a1d] transition-all inline-block shadow-md">
                  Sign Up Free
                </Link>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <SkeletonProfile key={i} />)}
              </div>
            ) : activeTab === "Saved Profiles" ? (
              savedProfiles.length === 0 ? (
                <div className="w-full text-center py-24 bg-white rounded-3xl border border-[#0f5238]/15">
                  <span className="material-symbols-outlined text-6xl text-[#0f5238]/40 mb-4">bookmark_border</span>
                  <h3 className="text-2xl font-bold font-display text-[#002112]">No Saved Profiles</h3>
                  <p className="text-[#404943] text-sm mt-2 mb-6">Click the bookmark icon on any match profile to save it here.</p>
                  <button onClick={() => setActiveTab("Browse Matches")} className="px-6 py-3 bg-[#0f5238] text-white rounded-xl font-bold text-xs hover:bg-[#072a1d] transition-all">
                    Browse Active Matches
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {savedProfiles.map((p) => {
                    const key = p.id || p.uid;
                    return (
                      <div key={key} onClick={() => p.uid && openProfile(p.uid)} className="bg-white p-6 rounded-3xl border border-[#0f5238]/15 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <AvatarDisplay photoURL={p.photoURL} name={p.name} />
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${roleColors[p.role] ?? "bg-gray-100 text-gray-700"}`}>
                              {p.role}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold font-display text-[#002112] mb-1">{p.name}</h3>
                          <p className="flex items-center text-[#606d64] text-xs font-semibold mb-4">
                            <span className="material-symbols-outlined text-sm mr-1 text-[#0f5238]">location_on</span>
                            {formatLocation(p)}
                          </p>
                          {Boolean(p.looking?.trim()) && (
                            <div className="mb-4 bg-[#f4faf6] p-3 rounded-xl border border-[#0f5238]/10">
                              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Looking For:</p>
                              <p className="text-xs font-medium text-[#002112] italic">&ldquo;{p.looking?.trim()}&rdquo;</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!user) { router.push("/auth/signup"); return; }
                              setNoteTarget(p);
                              setNoteInput("");
                            }}
                            disabled={connected.has(key) || connecting.has(key) || sentRequestToUids.has(p.uid)}
                            className="flex-grow py-2.5 bg-[#0f5238] text-white rounded-xl font-bold text-xs hover:bg-[#072a1d] transition-all disabled:opacity-60 cursor-pointer"
                          >
                            {(connected.has(key) || sentRequestToUids.has(p.uid)) ? "Request Sent ✓" : "Connect"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); void handleBookmark(key); }}
                            className="p-2.5 bg-[#d5fde2] text-[#0f5238] border border-[#0f5238]/20 rounded-xl hover:bg-[#b4ef9d] transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">bookmark</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : activeTab === "My Connections" ? (
              myRequestsList.length === 0 ? (
                <div className="w-full text-center py-24 bg-white rounded-3xl border border-[#0f5238]/15">
                  <span className="material-symbols-outlined text-6xl text-[#0f5238]/40 mb-4">handshake</span>
                  <h3 className="text-2xl font-bold font-display text-[#002112]">No Connections Yet</h3>
                  <p className="text-[#404943] text-sm mt-2 mb-6">You haven&apos;t established any co-founder connections yet.</p>
                  <button onClick={() => setActiveTab("Browse Matches")} className="px-6 py-3 bg-[#0f5238] text-white rounded-xl font-bold text-xs hover:bg-[#072a1d] transition-all">
                    Find Co-Founders
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myRequestsList.map(({ request, profile: prof }) => {
                    const partnerUid = request.fromUid === user?.uid ? request.toUid : request.fromUid;
                    const partnerName = request.fromUid === user?.uid ? request.toName : request.fromName;
                    const commentText = request.note?.trim() || prof?.looking?.trim();
                    return (
                      <div key={request.id} className="bg-white p-6 rounded-3xl border border-[#0f5238]/15 shadow-xs flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <AvatarDisplay photoURL={prof?.photoURL} name={partnerName} className="w-12 h-12" />
                            <div>
                              <h4 className="font-bold text-[#002112] text-lg">{partnerName}</h4>
                              <p className="text-xs text-[#606d64] font-medium">{prof?.role || "Member"} {prof?.city ? `· ${prof.city}` : ""}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            request.status === "accepted" ? "bg-emerald-100 text-[#0f5238] border border-emerald-300" :
                            request.status === "declined" ? "bg-red-100 text-red-700 border border-red-200" :
                            "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {request.status === "accepted" ? "Connected ✓" : request.status === "pending" ? "Pending Approval" : request.status}
                          </span>
                        </div>

                        {Boolean(commentText) && (
                          <div className="mb-4 bg-[#f4faf6] p-3 rounded-xl border border-[#0f5238]/10 text-xs italic text-[#002112]">
                            &ldquo;{commentText}&rdquo;
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <button onClick={() => openProfile(partnerUid)} className="text-xs font-bold text-[#0f5238] hover:underline cursor-pointer">
                            View Profile →
                          </button>
                          {request.status === "pending" && request.id && (
                            <button
                              onClick={() => handleCancelRequest(request.id!, partnerUid)}
                              disabled={processingAction === request.id}
                              className="px-4 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {processingAction === request.id ? "Cancelling..." : "Cancel Request"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : activeTab === "Received Requests" ? (
              receivedRequestsList.length === 0 ? (
                <div className="w-full text-center py-24 bg-white rounded-3xl border border-[#0f5238]/15">
                  <span className="material-symbols-outlined text-6xl text-[#0f5238]/40 mb-4">inbox</span>
                  <h3 className="text-2xl font-bold font-display text-[#002112]">No Pending Requests</h3>
                  <p className="text-[#404943] text-sm mt-2">You don&apos;t have any pending incoming connection requests right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {receivedRequestsList.map(({ request, profile: prof }) => {
                    const commentText = request.note?.trim() || prof?.looking?.trim();
                    return (
                      <div key={request.id} className="bg-white p-6 rounded-3xl border border-[#0f5238]/15 shadow-xs flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <AvatarDisplay photoURL={prof?.photoURL} name={request.fromName} className="w-12 h-12" />
                            <div>
                              <h4 className="font-bold text-[#002112] text-lg">{request.fromName}</h4>
                              <p className="text-xs text-[#606d64] font-medium">{prof?.role || "Member"} {prof?.city ? `· ${prof.city}` : ""}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Incoming Request
                          </span>
                        </div>

                        {Boolean(commentText) && (
                          <div className="mb-4 bg-[#f4faf6] p-3 rounded-xl border border-[#0f5238]/10 text-xs italic text-[#002112]">
                            &ldquo;{commentText}&rdquo;
                          </div>
                        )}

                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => request.id && handleAcceptRequest(request.id, request.fromUid)}
                            disabled={processingAction === request.id}
                            className="flex-1 py-2 bg-[#0f5238] text-white rounded-xl font-bold text-xs hover:bg-[#072a1d] transition-all cursor-pointer disabled:opacity-50"
                          >
                            {processingAction === request.id ? "Processing..." : "Accept"}
                          </button>
                          <button
                            onClick={() => request.id && handleDeclineRequest(request.id)}
                            disabled={processingAction === request.id}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button onClick={() => openProfile(request.fromUid)} className="px-3 py-2 border border-[#0f5238]/20 text-[#0f5238] rounded-xl font-bold text-xs hover:bg-[#d5fde2] transition-all cursor-pointer">
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : null}
          </div>
        )}
      </div>

      {/* Connection Request Note Modal */}
      {noteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#0f5238]/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <AvatarDisplay photoURL={noteTarget.photoURL} name={noteTarget.name} className="w-12 h-12" />
              <div>
                <h3 className="font-bold text-[#002112] text-lg">Connect with {noteTarget.name}</h3>
                <p className="text-xs text-[#606d64]">{noteTarget.role} {noteTarget.city ? `· ${noteTarget.city}` : ""}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#002112] mb-1.5">
                Add an optional note (recommended):
              </label>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Introduce yourself or share why you'd like to collaborate..."
                rows={3}
                className="w-full p-3 bg-[#f4faf6] border border-[#0f5238]/20 rounded-xl text-xs font-medium text-[#002112] focus:border-[#0f5238] outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setNoteTarget(null); setNoteInput(""); }}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = noteTarget;
                  const note = noteInput;
                  setNoteTarget(null);
                  setNoteInput("");
                  if (target) void handleConnect(target, note);
                }}
                className="flex-1 py-2.5 bg-[#0f5238] text-white rounded-xl font-bold text-xs hover:bg-[#072a1d] transition-all cursor-pointer shadow-md"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#072a1d] text-white">
          <span className="inline-block w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      }
    >
      <MatchContent />
    </Suspense>
  );
}
