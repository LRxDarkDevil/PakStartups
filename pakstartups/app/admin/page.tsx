"use client";

import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy, getDocs,
  updateDoc, doc, serverTimestamp, onSnapshot, limit
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

type PendingStartup = {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  stage: string;
  createdAt: { toDate?: () => Date } | string | null;
  status: string;
};

type Stat = { label: string; value: string | number; icon: string; color: string };

function formatDate(ts: PendingStartup["createdAt"]) {
  if (!ts) return "–";
  const d = (ts as { toDate?: () => Date }).toDate ? (ts as { toDate: () => Date }).toDate() : new Date(ts as string);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminDashboardPage() {
  const [queue, setQueue] = useState<PendingStartup[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    // Real-time listener for pending startups
    const q = query(
      collection(db, "startups"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsub = onSnapshot(q, async (snap) => {
      setQueue(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PendingStartup));

      // Also pull aggregate stats
      const [allStartups, pendingSnap, eventsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, "startups")),
        getDocs(query(collection(db, "startups"), where("status", "==", "pending"))),
        getDocs(query(collection(db, "events"), where("status", "==", "pending"))),
        getDocs(collection(db, "users")),
      ]);

      setStats([
        { label: "Total Startups", value: allStartups.size, icon: "rocket_launch", color: "bg-[#d5fde2]" },
        { label: "Pending Approval", value: pendingSnap.size, icon: "pending", color: "bg-amber-50" },
        { label: "Pending Events", value: eventsSnap.size, icon: "event", color: "bg-blue-50" },
        { label: "Total Users", value: usersSnap.size, icon: "group", color: "bg-[#e8ffee]" },
      ]);
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });

    return () => unsub();
  }, []);

  const handleApprove = async (id: string) => {
    setUpdating((prev) => new Set([...prev, id]));
    await updateDoc(doc(db, "startups", id), { status: "approved", updatedAt: serverTimestamp() });
    setUpdating((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  const handleReject = async (id: string) => {
    setUpdating((prev) => new Set([...prev, id]));
    await updateDoc(doc(db, "startups", id), { status: "rejected", updatedAt: serverTimestamp() });
    setUpdating((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#e0e0e0] rounded-xl animate-pulse" />)
          : stats.map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-5 flex items-center gap-4`}>
              <span className="material-symbols-outlined text-[#0f5238] text-3xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-black text-[#002112]">{s.value}</p>
                <p className="text-xs font-bold text-[#404943]">{s.label}</p>
              </div>
            </div>
          ))
        }
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Startup Approval Queue</h2>
        <p className="text-[#404943] font-medium">Review pending startup submissions before they go live.</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        {loading ? (
          <div className="p-12 text-center">
            <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
          </div>
        ) : queue.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">check_circle</span>
            <h3 className="text-xl font-bold text-[#002112]">Queue is empty</h3>
            <p className="text-[#404943] mt-1">All startup submissions have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Startup</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted By</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Stage</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bfc9c1]/20">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f5fbf7] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#002112]">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#b4ef9d] flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-[#0f5238]">person</span>
                        </div>
                        <span className="text-sm font-medium text-[#002112]">{item.ownerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-[#b4ef9d]/30 text-[#0e5138] text-xs font-bold">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-[#c4ecd2]/30 text-[#2b4e3b] text-xs font-bold">{item.stage}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#404943]">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={updating.has(item.id)}
                          className="bg-[#0f5238] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2d6a4f] transition-colors disabled:opacity-60"
                        >
                          {updating.has(item.id) ? "…" : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={updating.has(item.id)}
                          className="text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
