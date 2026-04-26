"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getEcosystemOrgs, type EcosystemOrg } from "@/lib/services/ecosystem";

const CATEGORY_TABS = [
  { label: "ALL", type: null },
  { label: "INCUBATORS", type: "Incubator" },
  { label: "ACCELERATORS", type: "Accelerator" },
  { label: "CO-WORKING SPACES", type: "Co-Working" },
  { label: "VENTURE CAPITAL", type: "Venture Capital" },
  { label: "INNOVATION HUBS", type: "Innovation Hub" },
  { label: "GOVERNMENT", type: "Government" },
];

const CITIES = ["All", "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar"];

const typeColors: Record<string, string> = {
  "Incubator": "bg-[#0f5238] text-white",
  "Accelerator": "bg-[#2d6a4f] text-white",
  "Co-Working": "bg-[#376a28] text-white",
  "Venture Capital": "bg-[#1e5111] text-white",
  "Government": "bg-[#2d6a4f] text-white",
  "Innovation Hub": "bg-[#0f5238] text-white",
};

export default function EcosystemDirectoryClient() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [orgs, setOrgs] = useState<EcosystemOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState("All");
  const savedOrgIds = profile?.savedOrganizationIds ?? [];

  useEffect(() => {
    getEcosystemOrgs()
      .then(setOrgs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleBookmark = async (orgId: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    const ref = doc(db, "users", user.uid);
    const alreadySaved = savedOrgIds.includes(orgId);
    setSaving((prev) => new Set([...prev, orgId]));
    await updateDoc(ref, {
      savedOrganizationIds: alreadySaved ? arrayRemove(orgId) : arrayUnion(orgId),
    });
    setSaving((prev) => {
      const next = new Set(prev);
      next.delete(orgId);
      return next;
    });
  };

  const filteredOrgs = orgs.filter((org) => {
    const typeMatch = !activeType || org.type === activeType;
    const cityMatch = activeCity === "All" || org.city === activeCity;
    return typeMatch && cityMatch;
  });

  return (
    <>
      {/* Category tabs */}
      <div className="bg-[#d5fde2] border-b border-[#bfc9c1]/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-6 overflow-x-auto py-2 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeType === tab.type;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveType(tab.type)}
                  className={`py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-[#0f5238] border-b-2 border-[#0f5238]"
                      : "text-[#404943] hover:text-[#0f5238]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Region filter + count */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-[#002112] uppercase tracking-wider">Region:</span>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                activeCity === city
                  ? "bg-[#0f5238] text-white"
                  : "border border-[#bfc9c1] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
        {!loading && (
          <span className="text-sm text-[#404943]">
            Showing <b>{filteredOrgs.length}</b> of <b>{orgs.length}</b> organizations
          </span>
        )}
      </div>

      {/* Org grid */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-8 border border-[#e0e0e0]">
                <div className="w-12 h-12 bg-[#e0e0e0] rounded-xl mb-4" />
                <div className="h-5 bg-[#e0e0e0] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#e0e0e0] rounded w-1/2 mb-4" />
                <div className="h-4 bg-[#e0e0e0] rounded mb-2" />
                <div className="h-4 bg-[#e0e0e0] rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-20 bg-[#f5faf6] rounded-2xl border border-[#e0e0e0]">
            <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">domain_disabled</span>
            <p className="font-bold text-[#002112]">No organizations found</p>
            <p className="text-sm text-[#404943] mt-1">Try a different category or region.</p>
            <button
              onClick={() => { setActiveType(null); setActiveCity("All"); }}
              className="mt-4 px-6 py-2 border border-[#0f5238] text-[#0f5238] rounded-lg font-bold text-sm hover:bg-[#0f5238] hover:text-white transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div key={org.id ?? org.name} className="bg-white rounded-xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.1)] transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#d5fde2] rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0f5238] text-2xl">{org.icon}</span>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${typeColors[org.type] ?? "bg-gray-200 text-gray-700"}`}>
                    {org.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#002112] mb-1">{org.name}</h3>
                <p className="text-[#404943] text-sm flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-sm">location_on</span>{org.city}
                </p>
                <p className="text-[#404943] text-sm mb-4 line-clamp-2">{org.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {org.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded uppercase">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#e0e0e0]">
                  {org.website ? (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-[#0f5238] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Visit Website <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  ) : (
                    <a href={`mailto:hello@pakstartups.org?subject=Inquiry%20about%20${encodeURIComponent(org.name)}`} className="text-[#0f5238] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Apply / Contact <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  )}
                  <button onClick={() => void toggleBookmark(org.id ?? org.name)} className="text-[#707973] hover:text-[#0f5238] transition-colors" aria-label={`Bookmark ${org.name}`}>
                    <span className="material-symbols-outlined">{saving.has(org.id ?? org.name) || savedOrgIds.includes(org.id ?? org.name) ? "bookmark" : "bookmark_border"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-[#133725] rounded-2xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <h2 className="text-3xl font-black mb-3">Missing an organization?</h2>
            <p className="text-[#a8e7c5] max-w-lg">
              Help us build the most comprehensive directory of Pakistani startups and support organizations.
            </p>
          </div>
          <button onClick={() => router.push(user ? "/ecosystem/add" : "/auth/signup")} className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#0f5238] transition-all whitespace-nowrap uppercase tracking-wider text-sm">
            Add Organization
          </button>
        </div>
      </div>
    </>
  );
}
