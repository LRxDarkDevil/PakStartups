"use client";

import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy, onSnapshot, updateDoc, doc,
  serverTimestamp, limit, Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

type Notif = {
  id: string;
  type: string;
  text: string;
  fromName?: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp | null;
};

const TABS = ["All", "Connections", "Ecosystem", "Events", "System"] as const;
type Tab = typeof TABS[number];

const TYPE_TAB: Record<string, Tab> = {
  connection: "Connections",
  match: "Connections",
  startup: "Ecosystem",
  b2b: "Ecosystem",
  event: "Events",
  rsvp: "Events",
  system: "System",
  blog: "System",
};

function timeAgo(ts: Timestamp | null) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts as unknown as string);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function iconFor(type: string) {
  const map: Record<string, { icon: string; bg: string }> = {
    connection: { icon: "person", bg: "bg-[#b4ef9d]" },
    match: { icon: "handshake", bg: "bg-[#caf2d7]" },
    startup: { icon: "rocket_launch", bg: "bg-[#d5fde2]" },
    event: { icon: "calendar_today", bg: "bg-blue-100" },
    rsvp: { icon: "event_available", bg: "bg-blue-100" },
    blog: { icon: "article", bg: "bg-[#cff7dd]" },
    system: { icon: "auto_awesome", bg: "bg-amber-100" },
    b2b: { icon: "business_center", bg: "bg-purple-100" },
  };
  return map[type] ?? { icon: "notifications", bg: "bg-[#e0e0e0]" };
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("All");
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const q = query(
      collection(db, "notifications"),
      where("toUid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notif));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, [user]);

  const markRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { read: true, updatedAt: serverTimestamp() });
  };

  const markAllRead = async () => {
    const unread = notifs.filter((n) => !n.read);
    await Promise.all(unread.map((n) => markRead(n.id)));
  };

  const filtered = tab === "All" ? notifs : notifs.filter((n) => TYPE_TAB[n.type] === tab);
  const unreadCount = notifs.filter((n) => !n.read).length;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
          <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">lock</span>
          <h2 className="text-2xl font-black text-[#002112]">Sign In Required</h2>
          <p className="text-[#404943] mt-2 mb-6">Sign in to see your notifications.</p>
          <Link href="/auth/login" className="bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#002112]">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-[#404943] mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[#0f5238] font-bold text-sm hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {TABS.map((t) => {
          const count = t === "All" ? unreadCount : notifs.filter((n) => TYPE_TAB[n.type] === t && !n.read).length;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === t ? "bg-[#0f5238] text-white" : "border border-[#bfc9c1] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"}`}>
              {t}
              {count > 0 && (
                <span className={`text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ${tab === t ? "bg-white text-[#0f5238]" : "bg-[#0f5238] text-white"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#f0f0f0] rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-[#e0e0e0]">
          <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">notifications_off</span>
          <h3 className="text-xl font-bold text-[#002112]">No notifications</h3>
          <p className="text-[#404943] mt-2">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const { icon, bg } = iconFor(n.type);
            return (
              <div key={n.id}
                className={`flex items-center gap-4 p-6 rounded-xl bg-white border transition-all hover:shadow-[0_4px_24px_rgba(15,82,56,0.06)] cursor-pointer ${!n.read ? "border-[#b4ef9d]" : "border-[#e0e0e0]"}`}
                onClick={() => !n.read && markRead(n.id)}>
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[#0f5238]">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#002112] text-sm">{n.text}</p>
                  <p className="text-[#707973] text-xs mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#0f5238] shrink-0" />}
                {n.link && (
                  <Link href={n.link} onClick={(e) => e.stopPropagation()}
                    className="text-[#0f5238] font-bold text-sm hover:underline whitespace-nowrap shrink-0">
                    View →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-[#707973] font-bold uppercase tracking-widest mt-12">
          Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
