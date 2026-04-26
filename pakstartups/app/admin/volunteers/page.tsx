"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

type Applicant = {
  id: string;
  fullName: string;
  email: string;
  city: string;
  role: string;
  motivation: string;
  linkedin: string;
  status: "pending" | "Pending" | "Reviewing" | "Approved" | "Rejected";
  createdAt: unknown;
};

function timeAgo(ts: unknown): string {
  if (!ts || typeof ts !== "object") return "—";
  const t = (ts as { toDate?: () => Date }).toDate?.();
  if (!t) return "—";
  const diff = (Date.now() - t.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const statusColors: Record<string, string> = {
  Approved: "bg-[#c4ecd2]/50 text-[#2b4e3b]",
  Rejected: "bg-red-100 text-red-800",
  Reviewing: "bg-amber-100 text-amber-800",
  Pending: "bg-amber-100 text-amber-800",
  pending: "bg-amber-100 text-amber-800",
};

export default function VolunteerManagementPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "volunteerApplications"), orderBy("createdAt", "desc"));
    getDocs(q)
      .then((snap) => {
        setApplicants(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Applicant));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: "Approved" | "Rejected" | "Reviewing") => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "volunteerApplications", id), { status, updatedAt: serverTimestamp() });
      setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="p-8 space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Volunteer Applications</h2>
          <p className="text-[#404943] font-medium">Review and onboard student ambassadors and community volunteers.</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-[#bfc9c1]/20 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 px-6 py-4 border-b border-[#bfc9c1]/10 last:border-0">
                <div className="h-4 w-32 bg-[#e0e0e0] rounded" />
                <div className="h-4 w-24 bg-[#e0e0e0] rounded" />
                <div className="h-4 w-20 bg-[#e0e0e0] rounded" />
              </div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-20 bg-[#f5faf6] rounded-xl border border-[#bfc9c1]/20">
            <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">volunteer_activism</span>
            <p className="font-bold text-[#002112]">No applications yet</p>
            <p className="text-sm text-[#404943] mt-1">Volunteer applications will appear here once submitted.</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Applicant Name</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Applied Role</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">City</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Date Applied</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc9c1]/20">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-[#f5fbf7] transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#002112]">{app.fullName}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#404943]">{app.role}</td>
                      <td className="px-6 py-4"><span className="px-2.5 py-1 rounded bg-[#dee4e0] text-[#002112] text-xs font-bold">{app.city || "—"}</span></td>
                      <td className="px-6 py-4 text-sm text-[#404943]">{timeAgo(app.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${statusColors[app.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelected(app)}
                            className="text-[#0f5238] font-bold text-xs hover:bg-[#e3eae6] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Profile modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="bg-[#f5faf6] px-6 py-5 border-b border-[#e0e0e0] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#002112]">{selected.fullName}</h3>
                <p className="text-sm text-[#404943]">{selected.role}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#707973] hover:text-[#002112] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-medium text-[#002112]">{selected.email || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-1">City</p>
                  <p className="text-sm font-medium text-[#002112]">{selected.city || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-1">Current Status</p>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${statusColors[selected.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {selected.status}
                  </span>
                </div>
                {selected.linkedin && (
                  <div>
                    <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-1">LinkedIn</p>
                    <a href={selected.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0f5238] font-bold hover:underline truncate block">
                      View Profile
                    </a>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-2">Motivation</p>
                <div className="bg-[#f5faf6] rounded-xl p-4 text-sm text-[#404943] leading-relaxed border border-[#e0e0e0]">
                  {selected.motivation || "No motivation provided."}
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="px-6 py-4 bg-[#f5faf6] border-t border-[#e0e0e0] flex gap-3 justify-end">
              <button
                onClick={() => void updateStatus(selected.id, "Rejected")}
                disabled={updating || selected.status === "Rejected"}
                className="px-5 py-2 rounded-lg text-sm font-bold border border-red-300 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => void updateStatus(selected.id, "Reviewing")}
                disabled={updating || selected.status === "Reviewing"}
                className="px-5 py-2 rounded-lg text-sm font-bold border border-amber-300 text-amber-700 hover:bg-amber-50 transition-all disabled:opacity-50"
              >
                Mark Reviewing
              </button>
              <button
                onClick={() => void updateStatus(selected.id, "Approved")}
                disabled={updating || selected.status === "Approved"}
                className="px-5 py-2 rounded-lg text-sm font-bold bg-[#0f5238] text-white hover:bg-[#2d6a4f] transition-all disabled:opacity-50"
              >
                {updating ? "Saving…" : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
