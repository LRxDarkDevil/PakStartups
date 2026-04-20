"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { rsvpEvent } from "@/lib/services/events";

export default function EventViewPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.get("id") ?? "";
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!id) return;
  const handleRsvp = async () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    if (!id) return;
    await rsvpEvent(id, user.uid);
    setRsvped(true);
  };
    (async () => {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
    })();
  }, [id]);

  return <main className="max-w-4xl mx-auto px-8 py-16"><Link href="/events" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to Events</Link><div className="bg-white rounded-2xl p-8 border border-[#dbeee2]"><h1 className="text-3xl font-black text-[#002112]">{String(event?.title ?? "Event details")}</h1><p className="mt-3 text-[#404943]">{String(event?.desc ?? "Open the event listing to view more.")}</p><div className="mt-6 flex gap-3"><Link href="/events" className="px-5 py-3 rounded-lg bg-[#0f5238] text-white font-bold">RSVP</Link><Link href={`mailto:hello@pakstartups.org?subject=${encodeURIComponent(`Event: ${String(event?.title ?? "Event")}`)}`} className="px-5 py-3 rounded-lg bg-[#d5fde2] text-[#0f5238] font-bold">Share</Link></div></div></main>;
        <div className="mt-6 flex gap-3"><button onClick={() => void handleRsvp()} className="px-5 py-3 rounded-lg bg-[#0f5238] text-white font-bold">{rsvped ? "✓ RSVP'd" : "RSVP"}</button><Link href={`mailto:hello@pakstartups.org?subject=${encodeURIComponent(`Event: ${String(event?.title ?? "Event")}`)}`} className="px-5 py-3 rounded-lg bg-[#d5fde2] text-[#0f5238] font-bold">Share</Link></div>