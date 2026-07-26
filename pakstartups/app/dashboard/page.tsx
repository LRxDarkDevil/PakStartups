"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { query, collection, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const quickLinks = [
  { label: "Edit Profile", icon: "edit", href: "/settings" },
  { label: "Submit Startup", icon: "add_business", href: "/startups/submit" },
  { label: "Browse Matches", icon: "handshake", href: "/match" },
  { label: "Post B2B Demand", icon: "storefront", href: "/b2b" },
  { label: "Submit Idea", icon: "lightbulb", href: "/ideas" },
  { label: "Volunteer", icon: "volunteer_activism", href: "/volunteer" },
];

type MyStartup = { id: string; name: string; stage: string; city: string; category: string; slug: string };

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [myStartups, setMyStartups] = useState<MyStartup[]>([]);
  const [myIdeas, setMyIdeas] = useState<number>(0);
  const [connections, setConnections] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  // Load user-specific stats from Firestore
  useEffect(() => {
    if (!user) return;
    setLoadingStats(true);
    Promise.all([
      // My startups
      getDocs(query(collection(db, "startups"), where("ownerId", "==", user.uid), limit(5))),
      // My ideas
      getDocs(query(collection(db, "ideas"), where("ownerId", "==", user.uid))),
      // My outgoing connections
      getDocs(query(collection(db, "connections"), where("fromUid", "==", user.uid), where("status", "==", "accepted"))),
    ]).then(([startupsSnap, ideasSnap, conSnap]) => {
      setMyStartups(startupsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as MyStartup));
      setMyIdeas(ideasSnap.size);
      setConnections(conSnap.size);
    }).catch(console.error).finally(() => setLoadingStats(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || !profile) return null;

  const displayName = profile.fullName || user.displayName || user.email || "Founder";
  const firstName = displayName.split(" ")[0];

  // Calculate profile completeness
  const checks = [
    { ok: !!(profile.photoURL), label: "Profile photo" },
    { ok: !!(profile.bio), label: "Bio added" },
    { ok: profile.skills?.length > 0, label: "Skills & interests" },
    { ok: Object.keys(profile.socialLinks ?? {}).length > 0, label: "Social accounts" },
    { ok: myStartups.length > 0, label: "Startup linked" },
  ];
  const completeness = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  const dashboardStats = [
    { label: "Profile Views", value: String(profile.views ?? 42), icon: "visibility", change: "" },
    { label: "Connections", value: String(connections), icon: "group", change: "" },
    { label: "Ideas Submitted", value: String(myIdeas), icon: "lightbulb", change: "" },
    { label: "Startups Listed", value: String(myStartups.length), icon: "rocket_launch", change: "" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0f5238] to-[#2d6a4f] rounded-2xl p-8 mb-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
            <span className="material-symbols-outlined text-[200px]">waving_hand</span>
          </div>
          <div>
            <p className="text-[#95d4b3] text-sm font-bold uppercase tracking-widest mb-2">Welcome back</p>
            <h1 className="text-3xl font-black tracking-tight mb-1">{firstName} 👋</h1>
            <p className="text-[#a8e7c5]">
              {completeness < 100
                ? `Your profile is ${completeness}% complete. ${completeness < 60 ? "Add more info to attract better matches." : "Almost there!"}`
                : "Your profile is complete!"}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/settings" className="bg-white text-[#0f5238] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#d5fde2] transition-all">
              {completeness < 100 ? "Complete Profile" : "Edit Profile"}
            </Link>
            <Link href="/match" className="border-2 border-white text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">
              Find Co-Founder
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {dashboardStats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-6 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl">{s.icon}</span>
                <span className="text-3xl font-black text-[#002112]">
                  {loadingStats ? <span className="inline-block w-6 h-6 rounded bg-[#e0e0e0] animate-pulse" /> : s.value}
                </span>
              </div>
              <p className="text-[#404943] text-sm font-medium">{s.label}</p>
              {s.change && <p className="text-[#0f5238] text-xs font-bold mt-1">{s.change}</p>}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1">
            {/* My Startups */}
            <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(15,82,56,0.06)] overflow-hidden mb-8">
              <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-center">
                <h2 className="font-black text-[#002112] text-lg">My Startups</h2>
                <Link href="/startups/submit" className="flex items-center gap-1 text-[#0f5238] font-bold text-sm hover:underline">
                  <span className="material-symbols-outlined text-sm">add</span> Add New
                </Link>
              </div>
              <div className="p-6 space-y-3">
                {loadingStats ? (
                  <div className="h-16 bg-[#e0e0e0] rounded-xl animate-pulse" />
                ) : myStartups.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-[#bfc9c1]">rocket_launch</span>
                    <p className="text-[#707973] mt-2 text-sm">No startups submitted yet.</p>
                    <Link href="/startups/submit" className="mt-3 inline-block text-[#0f5238] font-bold text-sm hover:underline">
                      Submit your startup →
                    </Link>
                  </div>
                ) : (
                  myStartups.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 p-4 bg-[#d5fde2] rounded-xl">
                      <div className="w-12 h-12 bg-[#b4ef9d] rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#0f5238]">rocket_launch</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#002112]">{s.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs bg-[#b7f2a0] text-[#1e5111] px-2 py-0.5 rounded-full font-bold uppercase">{s.stage}</span>
                          <span className="text-xs text-[#404943]">{s.city} · {s.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/startups/${s.slug}`} className="text-[#0f5238] hover:underline font-bold text-sm">View</Link>
                        <Link href={`/startups/${s.slug}/edit`} className="bg-[#0f5238] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#2d6a4f]">Edit</Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick actions for new users */}
            {!loadingStats && myStartups.length === 0 && myIdeas === 0 && (
              <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(15,82,56,0.06)] overflow-hidden">
                <div className="p-6 border-b border-[#e0e0e0]">
                  <h2 className="font-black text-[#002112] text-lg">Get Started</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Submit Your Startup", icon: "add_business", href: "/startups/submit", desc: "List your venture in the directory." },
                    { title: "Share an Idea", icon: "lightbulb", href: "/ideas/submit", desc: "Get community feedback on your idea." },
                    { title: "Find a Co-Founder", icon: "group_add", href: "/match", desc: "Connect with builders across Pakistan." },
                    { title: "Browse Events", icon: "event", href: "/events", desc: "Attend pitching nights and workshops." },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-start gap-3 p-4 rounded-xl bg-[#f5faf6] hover:bg-[#d5fde2] transition-all group">
                      <span className="material-symbols-outlined text-[#0f5238] text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <div>
                        <p className="font-bold text-[#002112] text-sm">{item.title}</p>
                        <p className="text-xs text-[#707973] mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(15,82,56,0.06)] p-6">
              <h2 className="font-black text-[#002112] text-sm uppercase tracking-wider mb-5">Quick Actions</h2>
              <div className="space-y-2">
                {quickLinks.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#d5fde2] text-[#404943] hover:text-[#0f5238] transition-all group"
                  >
                    <span className="material-symbols-outlined text-xl text-[#707973] group-hover:text-[#0f5238] transition-colors">{q.icon}</span>
                    <span className="font-medium text-sm">{q.label}</span>
                    <span className="material-symbols-outlined text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Completeness */}
            <div className="bg-[#d5fde2] rounded-xl p-6">
              <h3 className="font-bold text-[#002112] mb-4">Profile Strength</h3>
              <div className="relative h-2 bg-[#bfc9c1]/30 rounded-full mb-3">
                <div className="absolute left-0 top-0 h-2 rounded-full bg-[#0f5238] transition-all" style={{ width: `${completeness}%` }} />
              </div>
              <p className="text-sm text-[#404943] mb-4">{completeness}% complete</p>
              <div className="space-y-2">
                {checks.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className={`material-symbols-outlined text-sm ${item.ok ? "text-[#0f5238]" : "text-[#bfc9c1]"}`}>
                      {item.ok ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <span className={item.ok ? "text-[#002112]" : "text-[#707973]"}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
