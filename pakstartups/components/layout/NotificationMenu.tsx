"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection, query, where, orderBy, onSnapshot, limit, doc, updateDoc, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { updateConnectionStatus } from "@/lib/services/match";

type Notif = {
  id: string;
  type: string;
  text: string;
  fromName?: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp | null;
};

type ConnRequest = {
  id: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Timestamp | null;
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

export default function NotificationMenu() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"requests" | "updates">("requests");
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [requests, setRequests] = useState<ConnRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    const qNotifs = query(
      collection(db, "notifications"),
      where("toUid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(15)
    );
    const unsubNotifs = onSnapshot(qNotifs, (snap) => {
      setNotifs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notif));
    }, (err) => console.error("Notif listener error:", err));

    const qReqs = query(
      collection(db, "connections"),
      where("toUid", "==", user.uid),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubReqs = onSnapshot(qReqs, (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnRequest));
    }, (err) => console.error("Requests listener error:", err));

    return () => {
      unsubNotifs();
      unsubReqs();
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const unreadNotifsCount = notifs.filter((n) => !n.read).length;
  const pendingRequestsCount = requests.length;
  const totalUnread = unreadNotifsCount + pendingRequestsCount;

  const handleMarkRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notifId), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifs.filter((n) => !n.read);
    await Promise.all(unread.map((n) => handleMarkRead(n.id)));
  };

  const handleAccept = async (reqId: string) => {
    if (!user || !reqId) return;
    setProcessing(reqId);
    try {
      const actorName = profile?.fullName || user.displayName || user.email || "User";
      await updateConnectionStatus(reqId, "accepted", { uid: user.uid, name: actorName });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (reqId: string) => {
    if (!user || !reqId) return;
    setProcessing(reqId);
    try {
      const actorName = profile?.fullName || user.displayName || user.email || "User";
      await updateConnectionStatus(reqId, "declined", { uid: user.uid, name: actorName });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  if (!user) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-[#d5fde2] text-[#0f5238] transition-all flex items-center justify-center cursor-pointer"
        aria-label="Notifications & Connection Requests"
      >
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#0f5238]/15 overflow-hidden z-50">
          {/* Header */}
          <div className="p-3.5 bg-[#e4f9eb] border-b border-[#0f5238]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-[#002112] text-sm">Notifications & Requests</h3>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 bg-[#0f5238] text-white text-[10px] font-bold rounded-full">
                  {totalUnread} new
                </span>
              )}
            </div>
            {unreadNotifsCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#0f5238] font-bold hover:underline cursor-pointer"
              >
                Mark read
              </button>
            )}
          </div>

          {/* Sub-Tabs */}
          <div className="flex border-b border-gray-100 bg-[#f4faf6]">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "requests"
                  ? "bg-white text-[#0f5238] border-b-2 border-[#0f5238]"
                  : "text-[#606d64] hover:text-[#0f5238]"
              }`}
            >
              <span>Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("updates")}
              className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "updates"
                  ? "bg-white text-[#0f5238] border-b-2 border-[#0f5238]"
                  : "text-[#606d64] hover:text-[#0f5238]"
              }`}
            >
              <span>Updates</span>
              {unreadNotifsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {activeTab === "requests" ? (
              requests.length === 0 ? (
                <div className="p-8 text-center text-[#606d64]">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                  <p className="text-xs font-medium">No pending connection requests</p>
                </div>
              ) : (
                requests.map((r) => (
                  <div key={r.id} className="p-3.5 hover:bg-[#f4faf6] transition-colors flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#d5fde2] text-[#0f5238] font-bold flex items-center justify-center text-xs shrink-0 border border-[#0f5238]/20">
                          {r.fromName[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#002112]">{r.fromName}</p>
                          <p className="text-[10px] text-[#606d64]">Sent a connection request · {timeAgo(r.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center pt-1">
                      <button
                        onClick={() => handleAccept(r.id)}
                        disabled={processing === r.id}
                        className="px-3 py-1 bg-[#0f5238] text-white rounded-lg text-xs font-bold hover:bg-[#072a1d] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {processing === r.id ? "..." : "Accept"}
                      </button>
                      <button
                        onClick={() => handleDecline(r.id)}
                        disabled={processing === r.id}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <Link
                        href={`/profile/${r.fromUid}`}
                        onClick={() => setIsOpen(false)}
                        className="px-2.5 py-1 text-xs text-[#0f5238] font-bold hover:underline ml-auto"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                ))
              )
            ) : notifs.length === 0 ? (
              <div className="p-8 text-center text-[#606d64]">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">notifications_off</span>
                <p className="text-xs font-medium">No recent updates</p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.read) void handleMarkRead(n.id);
                    if (n.link) {
                      setIsOpen(false);
                      router.push(n.link);
                    }
                  }}
                  className={`p-3.5 hover:bg-[#f4faf6] transition-colors cursor-pointer flex items-start gap-3 ${
                    !n.read ? "bg-[#e8ffee]/60" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#0f5238] mt-1.5 shrink-0" style={{ opacity: n.read ? 0 : 1 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#002112] font-medium leading-snug">{n.text}</p>
                    <p className="text-[10px] text-[#606d64] mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#f4faf6] border-t border-gray-100 flex justify-between items-center px-4">
            <Link
              href="/match?tab=My+Connections"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#0f5238] hover:underline"
            >
              My Connections →
            </Link>
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#0f5238] hover:underline"
            >
              All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
