"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

export default function ProposeEventPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ title: "", desc: "", location: "", dateLabel: "", isOnline: true });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/auth/signup"); return; }
    await addDoc(collection(db, "events"), {
      title: form.title,
      desc: form.desc,
      type: "MEETUP",
      location: form.location,
      isOnline: form.isOnline,
      organizerId: user.uid,
      organizerName: profile?.fullName || user.displayName || user.email || "Organizer",
      dateTs: Timestamp.fromDate(new Date()),
      dateLabel: form.dateLabel,
      rsvpCount: 0,
      status: "pending",
      isFeatured: false,
      createdAt: serverTimestamp(),
    });
    router.push("/events");
  };

  return <main className="max-w-3xl mx-auto px-8 py-16"><Link href="/events" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to Events</Link><h1 className="text-4xl font-black text-[#002112] mb-6">Propose an Event</h1><form onSubmit={submit} className="space-y-4 bg-white rounded-2xl p-8 border border-[#dbeee2]"><input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Event title" /><textarea value={form.desc} onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-40" placeholder="Event description" /><input value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Location or link" /><input value={form.dateLabel} onChange={(e) => setForm((prev) => ({ ...prev, dateLabel: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Date label" /><button className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold">Submit Event</button></form></main>;
}