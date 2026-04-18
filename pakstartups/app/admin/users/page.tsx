"use client";

import { useState, useEffect } from "react";
import {
  collection, query, orderBy, getDocs, updateDoc, doc,
  serverTimestamp, onSnapshot, limit, startAfter,
  type DocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

type PlatformUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: { toDate?: () => Date } | string | null;
  status?: string;
};

const roleColors: Record<string, string> = {
  admin: "bg-[#0f5238] text-white",
  founder: "bg-[#b4ef9d] text-[#0f5238]",
  investor: "bg-blue-100 text-blue-800",
  freelancer: "bg-purple-100 text-purple-800",
  student: "bg-amber-100 text-amber-800",
  mentor: "bg-[#caf2d7] text-[#0f5238]",
};

function formatDate(ts: PlatformUser["createdAt"]) {
  if (!ts) return "–";
  const d = (ts as { toDate?: () => Date }).toDate ? (ts as { toDate: () => Date }).toDate() : new Date(ts as string);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

const ROLES = ["founder", "freelancer", "student", "investor", "mentor", "admin"];

export default function UserManagementPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PlatformUser));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating((prev) => new Set([...prev, userId]));
    setOpenDropdown(null);
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole, updatedAt: serverTimestamp() });
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating((prev) => { const s = new Set(prev); s.delete(userId); return s; });
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">User Management</h2>
        <p className="text-[#404943] font-medium">Manage all platform members, their roles, and statuses.</p>
      </div>

      {/* Search */}
      <div className="flex items-center relative w-72">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943] text-sm">search</span>
        <input
          className="w-full bg-white border border-[#bfc9c1]/20 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#0f5238] outline-none placeholder:text-[#404943]/60 shadow-sm"
          placeholder="Search by name or email"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        {loading ? (
          <div className="p-12 text-center">
            <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#bfc9c1]">person_off</span>
            <p className="text-[#404943] mt-2">{search ? "No users match your search." : "No users registered yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bfc9c1]/20">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f5fbf7] transition-colors group relative">
                    <td className="px-6 py-4 font-bold text-[#002112]">{user.fullName || "—"}</td>
                    <td className="px-6 py-4 text-sm text-[#404943]">{user.email || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold capitalize ${roleColors[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#404943]">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                          disabled={updating.has(user.id)}
                          className="text-[#404943] hover:text-[#0f5238] p-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {updating.has(user.id) ? "progress_activity" : "manage_accounts"}
                          </span>
                        </button>
                        {openDropdown === user.id && (
                          <div className="absolute right-0 top-9 z-50 w-44 bg-white rounded-xl shadow-2xl border border-[#e0e0e0] overflow-hidden">
                            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#707973] border-b border-[#f0f0f0]">
                              Change role to
                            </p>
                            {ROLES.map((role) => (
                              <button
                                key={role}
                                onClick={() => handleRoleChange(user.id, role)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f5faf6] capitalize transition-colors ${user.role === role ? "font-bold text-[#0f5238]" : "text-[#404943]"}`}
                              >
                                {role}
                                {user.role === role && " ✓"}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#bfc9c1]/20 bg-[#f5fbf7]">
          <span className="text-sm text-[#404943] font-medium">
            {loading ? "Loading…" : `${filtered.length} of ${users.length} users`}
          </span>
        </div>
      </div>
    </div>
  );
}
