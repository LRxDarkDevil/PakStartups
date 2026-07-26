"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type PlatformUserDetail = {
  id: string;
  uid?: string;
  fullName?: string;
  email?: string;
  photoURL?: string | null;
  role?: string;
  status?: string;
  bio?: string;
  city?: string;
  region?: string;
  country?: string;
  skills?: string[];
  interests?: string[];
  socialLinks?: Record<string, string>;
  createdAt?: { toDate?: () => Date } | string | null;
};

type UserStartup = {
  id: string;
  name: string;
  stage: string;
  status: string;
  category: string;
};

type Props = {
  user: PlatformUserDetail | null;
  onClose: () => void;
  onRoleChange?: (userId: string, newRole: string) => Promise<void> | void;
  isUpdating?: boolean;
};

const ROLES = ["founder", "freelancer", "student", "investor", "mentor", "admin"];

const roleColors: Record<string, string> = {
  admin: "bg-[#0f5238] text-white",
  founder: "bg-[#b4ef9d] text-[#0f5238]",
  investor: "bg-blue-100 text-blue-800",
  freelancer: "bg-purple-100 text-purple-800",
  student: "bg-amber-100 text-amber-800",
  mentor: "bg-[#caf2d7] text-[#0f5238]",
};

function formatDate(ts: PlatformUserDetail["createdAt"]) {
  if (!ts) return "–";
  const d = (ts as { toDate?: () => Date }).toDate
    ? (ts as { toDate: () => Date }).toDate()
    : new Date(ts as string);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function UserDetailsModal({
  user,
  onClose,
  onRoleChange,
  isUpdating = false,
}: Props) {
  const [startups, setStartups] = useState<UserStartup[]>([]);
  const [loadingStartups, setLoadingStartups] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUserStartups = async () => {
      setLoadingStartups(true);
      try {
        const q = query(
          collection(db, "startups"),
          where("ownerId", "==", user.id)
        );
        const snap = await getDocs(q);
        const list: UserStartup[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<UserStartup, "id">),
        }));
        setStartups(list);
      } catch (err) {
        console.error("Failed to load user startups:", err);
      } finally {
        setLoadingStartups(false);
      }
    };

    fetchUserStartups();
  }, [user?.id]);

  if (!user) return null;

  const displayName = user.fullName || "Unnamed User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const currentRole = user.role || "member";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#bfc9c1]/30 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#d5fde2] p-6 border-b border-[#bfc9c1]/20 flex items-start justify-between">
          <div className="flex items-center gap-4 pr-8">
            <div className="w-16 h-16 rounded-full bg-[#0f5238] flex items-center justify-center text-white text-xl font-black ring-4 ring-white shadow-md overflow-hidden shrink-0">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-black text-[#002112] tracking-tight">
                  {displayName}
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold capitalize ${
                    roleColors[currentRole] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {currentRole}
                </span>
              </div>
              <p className="text-sm font-medium text-[#404943] mt-0.5">
                {user.email || "No email address"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#002112] flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick User Stats / Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#f5fbf7] p-3 rounded-xl border border-[#bfc9c1]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707973] block">
                User ID
              </span>
              <span className="font-mono text-xs font-bold text-[#002112] truncate block mt-1">
                {user.id}
              </span>
            </div>
            <div className="bg-[#f5fbf7] p-3 rounded-xl border border-[#bfc9c1]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707973] block">
                Joined Date
              </span>
              <span className="text-xs font-bold text-[#002112] block mt-1">
                {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="bg-[#f5fbf7] p-3 rounded-xl border border-[#bfc9c1]/20 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707973] block">
                Location
              </span>
              <span className="text-xs font-bold text-[#002112] block mt-1 truncate">
                {user.city
                  ? `${user.city}${user.region ? `, ${user.region}` : ""}`
                  : "Not specified"}
              </span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
                Bio
              </h4>
              <p className="text-sm text-[#002112] bg-[#f8fcf9] p-4 rounded-xl border border-[#bfc9c1]/20 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Role Management */}
          {onRoleChange && (
            <div className="bg-[#e8ffee]/60 p-4 rounded-xl border border-[#bfc9c1]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#0f5238]">
                  Manage User Role
                </h5>
                <p className="text-xs text-[#404943]">
                  Current role is <strong>{currentRole}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={currentRole}
                  disabled={isUpdating}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  className="bg-white border border-[#0f5238]/30 text-[#002112] text-xs font-bold rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f5238] outline-none disabled:opacity-50"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Associated Startups */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
              Associated Startups ({startups.length})
            </h4>
            {loadingStartups ? (
              <div className="p-4 text-center">
                <span className="inline-block w-5 h-5 border-2 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
              </div>
            ) : startups.length === 0 ? (
              <p className="text-xs text-[#707973] italic bg-[#f5fbf7] p-3 rounded-xl border border-[#bfc9c1]/20">
                No startups submitted by this user yet.
              </p>
            ) : (
              <div className="space-y-2">
                {startups.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 bg-[#f5fbf7] rounded-xl border border-[#bfc9c1]/20 text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#002112]">{s.name}</span>
                      <div className="flex gap-2 mt-0.5 text-[10px] text-[#707973]">
                        <span>Stage: {s.stage}</span>
                        <span>•</span>
                        <span>Category: {s.category}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : s.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills & Interests */}
          {((user.skills && user.skills.length > 0) ||
            (user.interests && user.interests.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skills && user.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#d5fde2] text-[#0f5238] text-xs font-bold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.interests && user.interests.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {user.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
                Social Links
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(user.socialLinks).map(([platform, link]) => {
                  if (!link) return null;
                  const href = link.startsWith("http")
                    ? link
                    : `https://${link}`;
                  return (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e3eae6] text-[#002112] text-xs font-bold hover:bg-[#b4ef9d] transition-colors"
                    >
                      <span className="capitalize">{platform}</span>
                      <span className="material-symbols-outlined text-xs">
                        open_in_new
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#f5fbf7] p-4 border-t border-[#bfc9c1]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#0f5238] text-white text-xs font-bold hover:bg-[#2d6a4f] transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
