"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

type Org = {
  name: string;
  type: string;
  city: string;
  desc: string;
  tags: string[];
  icon: string;
};

export default function EcosystemDirectoryClient({ orgs, typeColors }: { orgs: Org[]; typeColors: Record<string, string> }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const savedOrgIds = profile?.savedOrganizationIds ?? [];

  const toggleBookmark = async (orgName: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    const ref = doc(db, "users", user.uid);
    const alreadySaved = savedOrgIds.includes(orgName);
    setSaving((prev) => new Set([...prev, orgName]));
    await updateDoc(ref, {
      savedOrganizationIds: alreadySaved ? arrayRemove(orgName) : arrayUnion(orgName),
    });
    setSaving((prev) => {
      const next = new Set(prev);
      next.delete(orgName);
      return next;
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgs.map((org) => (
          <div key={org.name} className="bg-white rounded-xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.1)] transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#d5fde2] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0f5238] text-2xl">{org.icon}</span>
              </div>
              <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${typeColors[org.type]}`}>
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
              <a href={`mailto:hello@pakstartups.org?subject=Inquiry%20about%20${encodeURIComponent(org.name)}`} className="text-[#0f5238] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Apply / Contact <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <button onClick={() => void toggleBookmark(org.name)} className="text-[#707973] hover:text-[#0f5238] transition-colors" aria-label={`Bookmark ${org.name}`}>
                <span className="material-symbols-outlined">{saving.has(org.name) || savedOrgIds.includes(org.name) ? "bookmark" : "bookmark_border"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
}