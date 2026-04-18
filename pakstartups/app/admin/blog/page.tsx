"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

type BlogPost = {
  id: string;
  title: string;
  authorName: string;
  category: string;
  status: string;
  createdAt: { toDate?: () => Date } | string | null;
};

function formatDate(ts: BlogPost["createdAt"]) {
  if (!ts) return "–";
  const d = (ts as { toDate?: () => Date }).toDate ? (ts as { toDate: () => Date }).toDate() : new Date(ts as string);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    const q = tab === "all"
      ? query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), limit(30))
      : query(collection(db, "blogPosts"), where("status", "==", tab), orderBy("createdAt", "desc"), limit(30));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, [tab]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setUpdating((prev) => new Set([...prev, id]));
    await updateDoc(doc(db, "blogPosts", id), { status, isFeatured: false, updatedAt: serverTimestamp() });
    setUpdating((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Blog & Stories</h2>
        <p className="text-[#404943] font-medium mt-1">Review, approve, and feature blog submissions.</p>
      </div>

      <div className="flex gap-4 border-b border-[#e0e0e0]">
        {(["pending", "approved", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-bold capitalize transition-colors ${tab === t ? "text-[#0f5238] border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
          >
            {t === "all" ? "All Posts" : t === "pending" ? "Pending Review" : "Approved"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        {loading ? (
          <div className="p-12 text-center"><span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[#bfc9c1]">article</span>
            <p className="text-[#404943] mt-2">No {tab} posts found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Title</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Author</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c1]/20">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-[#f5fbf7] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#002112] max-w-[300px] truncate">{p.title}</td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{p.authorName}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-[#b4ef9d]/30 text-[#0e5138] text-xs font-bold rounded">{p.category}</span></td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded capitalize ${p.status === "approved" ? "bg-[#c4ecd2] text-[#0f5238]" : p.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {p.status !== "approved" && (
                        <button onClick={() => handleAction(p.id, "approved")} disabled={updating.has(p.id)} className="bg-[#0f5238] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2d6a4f] transition-colors disabled:opacity-60">
                          Approve
                        </button>
                      )}
                      {p.status !== "rejected" && (
                        <button onClick={() => handleAction(p.id, "rejected")} disabled={updating.has(p.id)} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60">
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
