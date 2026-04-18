"use client";

import { use, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

type Profile = {
  uid: string;
  fullName: string;
  bio?: string;
  city?: string;
  role?: string;
  photoURL?: string;
  skills?: string[];
  socialLinks?: Record<string, string>;
  createdAt?: { toDate?: () => Date } | string | null;
  looking?: string;
};

function formatJoin(ts: Profile["createdAt"]) {
  if (!ts) return "—";
  const d = (ts as { toDate?: () => Date }).toDate ? (ts as { toDate: () => Date }).toDate() : new Date(ts as string);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const fetchProfile = async () => {
      // username is actually the uid in our routing
      const snap = await getDoc(doc(db, "users", username));
      if (snap.exists()) {
        setProfile({ uid: snap.id, ...snap.data() } as Profile);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#e8ffee]">
        <div className="animate-pulse">
          <div className="h-64 bg-[#b4ef9d]" />
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="h-32 bg-white rounded-xl" />
            <div className="h-48 bg-white rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className="min-h-screen bg-[#e8ffee] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-[#bfc9c1]">person_off</span>
          <h1 className="text-3xl font-black text-[#002112] mt-4 mb-2">Profile Not Found</h1>
          <p className="text-[#404943] mb-8">This user doesn&apos;t exist or their profile is private.</p>
          <Link href="/match" className="bg-[#0f5238] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">Find Other Founders</Link>
        </div>
      </main>
    );
  }

  const isOwnProfile = currentUser?.uid === profile.uid;
  const initials = profile.fullName?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <main className="min-h-screen bg-[#e8ffee]">
      {/* Banner */}
      <section className="relative">
        <div className="h-64 w-full bg-gradient-to-r from-[#b4ef9d] to-[#caf2d7] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#0f5238 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#bfc9c1]/10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-[#b4ef9d] overflow-hidden shadow-xl flex items-center justify-center">
                  {profile.photoURL
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
                    : <span className="text-4xl font-black text-[#0f5238]">{initials}</span>
                  }
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black text-[#002112] tracking-tighter">{profile.fullName || "Anonymous"}</h1>
                  {profile.role && (
                    <span className="bg-[#2d6a4f] text-[#a8e7c5] px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase capitalize">{profile.role}</span>
                  )}
                </div>
                {profile.bio && <p className="text-lg text-[#404943] font-medium">{profile.bio}</p>}
                <div className="flex items-center gap-4 text-[#404943] text-sm font-medium">
                  {profile.city && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> {profile.city}, Pakistan
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-2">
              {isOwnProfile ? (
                <Link href="/settings" className="bg-[#0f5238] text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-xl transition-all active:scale-95 hover:opacity-90">
                  Edit Profile
                </Link>
              ) : (
                <>
                  <button className="bg-[#bfc9c1]/20 hover:bg-[#bfc9c1]/40 text-[#002112] font-bold px-6 py-2.5 rounded-lg text-sm transition-all">
                    Message
                  </button>
                  <Link href="/match" className="bg-gradient-to-br from-[#0f5238] to-[#2d6a4f] text-white font-bold px-8 py-2.5 rounded-lg text-sm shadow-xl transition-all active:scale-95 hover:opacity-90">
                    Connect
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Bar */}
      <nav className="sticky top-20 z-40 bg-[#e8ffee]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 border-b border-[#bfc9c1]/10">
          <div className="flex gap-8 overflow-x-auto">
            {["Overview", "Skills", "Social"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm whitespace-nowrap transition-colors ${activeTab === tab ? "font-bold text-[#0f5238] border-b-2 border-[#0f5238]" : "font-medium text-[#404943] hover:text-[#0f5238]"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "Overview" && (
              <>
                {profile.bio && (
                  <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(15,82,56,0.02)]">
                    <h2 className="text-xl font-bold text-[#002112] mb-4">About</h2>
                    <p className="text-[#404943] leading-relaxed">{profile.bio}</p>
                  </div>
                )}
                {profile.looking && (
                  <div className="bg-[#2d6a4f] p-8 rounded-xl text-[#a8e7c5]">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined">search</span>
                      <h2 className="text-sm font-black tracking-widest uppercase">Looking for</h2>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">&ldquo;{profile.looking}&rdquo;</p>
                  </div>
                )}
                {!profile.bio && !profile.looking && (
                  <div className="bg-white p-8 rounded-xl text-center border border-[#e0e0e0]">
                    <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">person</span>
                    <p className="text-[#404943]">This user hasn&apos;t filled out their profile yet.</p>
                    {isOwnProfile && <Link href="/settings" className="text-[#0f5238] font-bold text-sm hover:underline mt-2 inline-block">Complete your profile →</Link>}
                  </div>
                )}
              </>
            )}
            {activeTab === "Skills" && (
              <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(15,82,56,0.02)]">
                <h2 className="text-xl font-bold text-[#002112] mb-6">Skills & Interests</h2>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span key={s} className="bg-[#b7f2a0] text-[#1e5111] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#404943]">No skills listed yet.{isOwnProfile && <><Link href="/settings/skills" className="text-[#0f5238] font-bold hover:underline ml-1">Add skills →</Link></>}</p>
                )}
              </div>
            )}
            {activeTab === "Social" && (
              <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(15,82,56,0.02)]">
                <h2 className="text-xl font-bold text-[#002112] mb-6">Social Presence</h2>
                {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(profile.socialLinks).map(([key, url]) => url ? (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between group hover:bg-[#f5faf6] p-3 rounded-lg transition-colors">
                        <span className="flex items-center gap-3 text-[#404943] group-hover:text-[#0f5238] font-medium transition-colors capitalize">
                          <span className="material-symbols-outlined">link</span> {key}
                        </span>
                        <span className="material-symbols-outlined text-[#404943] opacity-0 group-hover:opacity-100 transition-opacity">north_east</span>
                      </a>
                    ) : null)}
                  </div>
                ) : (
                  <p className="text-[#404943]">No social links added yet.{isOwnProfile && <><Link href="/settings/social" className="text-[#0f5238] font-bold hover:underline ml-1">Add links →</Link></>}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(15,82,56,0.02)] border-l-4 border-[#0f5238]">
              <h2 className="text-sm font-black text-[#002112] tracking-widest uppercase mb-2 opacity-50">Member Since</h2>
              <p className="text-2xl font-black text-[#002112]">{formatJoin(profile.createdAt ?? null)}</p>
              <p className="text-xs text-[#404943] mt-1 capitalize">{profile.role || "Community"} Member</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
