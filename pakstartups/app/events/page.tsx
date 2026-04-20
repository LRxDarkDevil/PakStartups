"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUpcomingEvents, getPastEvents, getWeeklyMeetups, getFeaturedEvent, rsvpEvent, type EventItem } from "@/lib/services/events";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useAuth } from "@/lib/context/AuthContext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const weekDays = ["S","M","T","W","T","F","S"];

type TabType = "Upcoming" | "Past Events" | "Weekly Meetups";

function SkeletonEvent() {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center gap-6 animate-pulse">
      <div className="w-[60px] h-16 bg-[#e0e0e0] rounded-xl shrink-0" />
      <div className="flex-1">
        <div className="h-5 w-3/4 bg-[#e0e0e0] rounded mb-2" />
        <div className="h-4 w-1/2 bg-[#e0e0e0] rounded mb-1" />
        <div className="h-4 w-1/3 bg-[#e0e0e0] rounded" />
      </div>
      <div className="h-10 w-20 bg-[#e0e0e0] rounded-lg" />
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Upcoming");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featured, setFeatured] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [rsvped, setRsvped] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        if (activeTab === "Upcoming") {
          const [feat, data] = await Promise.all([getFeaturedEvent(), getUpcomingEvents()]);
          setFeatured(feat);
          setEvents(data.filter((e) => !feat || e.id !== feat.id));
        } else if (activeTab === "Past Events") {
          setFeatured(null);
          setEvents(await getPastEvents());
        } else {
          setFeatured(null);
          setEvents(await getWeeklyMeetups());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab]);

  const handleRsvp = async (event: EventItem) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    if (!event.id) return;
    const didRsvp = await rsvpEvent(event.id, user.uid);
    setRsvped((prev) => {
      const s = new Set(prev);
      if (didRsvp) s.add(event.id!); else s.delete(event.id!);
      return s;
    });
  };

  const handleSave = async (eventId: string) => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    const ref = doc(db, "users", user.uid);
    const isSaved = (profile?.savedEventIds ?? []).includes(eventId);
    await updateDoc(ref, {
      savedEventIds: isSaved ? arrayRemove(eventId) : arrayUnion(eventId),
    });
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(eventId); else next.add(eventId);
      return next;
    });
  };

  const handleShare = async (event: EventItem) => {
    const url = `${window.location.origin}/events/view?id=${event.id}`;
    if (navigator.share) {
      await navigator.share({ title: event.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  const filteredEvents = events.filter((event) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [event.title, event.location, event.organizerName, event.type, event.desc].join(" ").toLowerCase().includes(q);
  });

  const calendarDate = new Date();
  calendarDate.setMonth(calendarDate.getMonth() + calendarOffset);
  const calendarDays = buildCalendarDays(calendarDate);

  const formatDate = (event: EventItem) => {
    if (!event.dateTs) return { month: "TBD", day: "?" };
    // dateTs is a Firestore Timestamp – call toDate() if available
    const d = (event.dateTs as any).toDate ? (event.dateTs as any).toDate() : new Date(event.dateTs as any);
    return {
      month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
      day: String(d.getDate()),
    };
  };

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Events &amp; Meetups</h1>
            <p className="text-[#404943] text-lg max-w-xl">
              Weekly sessions, pitching nights, and founder meetups across Pakistan.
            </p>
          </div>
          <Link href="/events/propose" className="flex items-center gap-2 bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            <span className="material-symbols-outlined">add</span>
            Propose an Event
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap items-center gap-4 overflow-x-auto no-scrollbar">
            {(["Upcoming", "Past Events", "Weekly Meetups"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
              >
                {tab}
              </button>
            ))}
            <div className="relative ml-auto min-w-[260px] flex-1 md:flex-none md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-sm">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30" />
            </div>
            <Link href="/events/propose" className="py-4 text-[#404943] hover:text-[#0f5238] transition-colors whitespace-nowrap ml-auto">
              Propose an Event
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1">
          {/* Featured Event (Upcoming only) */}
          {activeTab === "Upcoming" && featured && (
            <div className="bg-[#0f5238] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
                🔥 FEATURED
              </span>
              <h2 className="text-3xl font-black mb-4">{featured.title}</h2>
              <div className="flex items-center gap-4 text-[#a8e7c5] text-sm mb-4">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>{featured.dateLabel}
                </span>
              </div>
              <div className="flex gap-2 mb-6">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{featured.isOnline ? "Online" : "In-Person"}</span>
                <span className="bg-[#b4ef9d] text-[#0f5238] text-xs font-bold px-3 py-1 rounded-full">{featured.type}</span>
              </div>
              <p className="text-[#a8e7c5] mb-8 max-w-lg line-clamp-3">{featured.desc}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleRsvp(featured)}
                  className={`px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all ${rsvped.has(featured.id!) ? "bg-[#d5fde2] text-[#0f5238]" : "bg-white text-[#0f5238]"}`}
                >
                  {!user ? "Sign in to RSVP" : rsvped.has(featured.id!) ? "✓ RSVP'd" : "RSVP Now"}
                </button>
                <span className="text-[#a8e7c5] text-sm">{featured.rsvpCount} attending</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <SkeletonEvent key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">
                {activeTab === "Past Events" ? "history" : "event"}
              </span>
              <h3 className="text-xl font-bold text-[#002112]">
                {activeTab === "Past Events" ? "No Past Events" : activeTab === "Weekly Meetups" ? "No Weekly Meetups" : "No Upcoming Events"}
              </h3>
              <p className="text-[#404943] mt-2">
                {activeTab === "Upcoming" ? "Check back soon or propose your own event." : "Past events will appear here."}
              </p>
              {activeTab === "Upcoming" && (
                <Link href="/events/propose" className="mt-6 inline-block bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                  Propose an Event
                </Link>
              )}
            </div>
          ) : (
            <>
              {activeTab === "Upcoming" && filteredEvents.length > 0 && (
                <h3 className="text-xl font-black text-[#002112] mb-6">More Upcoming Events</h3>
              )}
              <div className="space-y-4">
                {filteredEvents.map((e) => {
                  const dateInfo = formatDate(e);
                  return (
                    <div key={e.id} className="bg-white rounded-xl p-6 flex items-center gap-6 shadow-[0_4px_24px_rgba(15,82,56,0.06)] hover:shadow-[0_8px_32px_rgba(15,82,56,0.1)] transition-all">
                      <div className="bg-[#0f5238] text-white rounded-xl px-4 py-3 text-center min-w-[60px] shrink-0">
                        <div className="text-xs font-bold uppercase">{dateInfo.month}</div>
                        <div className="text-2xl font-black">{dateInfo.day}</div>
                      </div>
                      <div onClick={() => router.push(`/events/view?id=${e.id ?? ""}`)} role="button" tabIndex={0} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-[#002112]">{e.title}</span>
                          <span className="px-2 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded uppercase">{e.type}</span>
                        </div>
                        <p className="text-[#404943] text-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>{e.location}
                        </p>
                        <button type="button" onClick={(event) => { event.stopPropagation(); router.push(`/profile/${e.organizerId}/events`); }} className="text-[#404943] text-xs mt-1 flex items-center gap-1 hover:text-[#0f5238] transition-colors">
                          <span className="w-4 h-4 rounded-full bg-[#b4ef9d] shrink-0 inline-block" />
                          Organized by {e.organizerName}
                        </button>
                      </div>
                      <div className="text-right shrink-0">
                        <button
                          onClick={() => handleRsvp(e)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all mb-1 block ${rsvped.has(e.id!) ? "bg-[#d5fde2] text-[#0f5238]" : "bg-[#0f5238] text-white hover:bg-[#2d6a4f]"}`}
                        >
                          {!user ? "RSVP" : rsvped.has(e.id!) ? "✓ RSVP'd" : "RSVP"}
                        </button>
                        <p className="text-xs text-[#707973]">{e.rsvpCount} attending</p>
                        <div className="mt-2 flex items-center gap-2 justify-end">
                          <button onClick={() => void handleSave(e.id ?? "")} className="text-xs font-bold text-[#0f5238] hover:underline">{saved.has(e.id ?? "") || (profile?.savedEventIds ?? []).includes(e.id ?? "") ? "Saved" : "Save"}</button>
                          <button onClick={() => void handleShare(e)} className="text-xs font-bold text-[#0f5238] hover:underline">Share</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Sidebar Calendar */}
        <div className="w-full md:w-72 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#002112]">{calendarDate.toLocaleString("en", { month: "long", year: "numeric" })}</h3>
              <div className="flex gap-1">
                <button onClick={() => setCalendarOffset((offset) => offset - 1)} className="w-7 h-7 rounded-full hover:bg-[#d5fde2] flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button onClick={() => setCalendarOffset((offset) => offset + 1)} className="w-7 h-7 rounded-full hover:bg-[#d5fde2] flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-[#707973]">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((d, i) => (
                <button key={i} onClick={() => d && setSelectedDay(d)} className={`text-center text-xs py-1 rounded-full cursor-pointer transition-colors ${d === selectedDay ? "bg-[#0f5238] text-white font-black" : d === new Date().getDate() && calendarOffset === 0 ? "bg-[#b4ef9d] text-[#0f5238] font-black" : d ? "hover:bg-[#d5fde2] text-[#002112]" : ""}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#d5fde2] rounded-xl p-6">
            <h3 className="font-bold text-[#002112] mb-2">Host Your Own</h3>
            <p className="text-[#404943] text-sm mb-4">Have an idea for a meetup or workshop? We provide the platform, audience, and logistical support.</p>
            <Link href="/events/propose" className="text-[#0f5238] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Learn about guidelines <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function buildCalendarDays(date: Date): (number | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= totalDays; day += 1) cells.push(day);
  return cells;
}
