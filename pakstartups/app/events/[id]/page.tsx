"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { formatLocation } from "@/lib/location";
import { getEventById, rsvpEvent, type EventItem } from "@/lib/services/events";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = decodeURIComponent(params.id ?? "");
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvped, setRsvped] = useState(false);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getEventById(eventId)
      .then((result) => {
        if (active) setEvent(result);
      })
      .catch(() => {
        if (active) setError("We could not load this event. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  const eventDate = useMemo(() => {
    if (!event?.dateTs) return null;
    return event.dateTs.toDate();
  }, [event]);

  const handleRsvp = async () => {
    if (!user) {
      router.push(`/auth/signup?next=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setRsvpBusy(true);
    setError("");
    try {
      const nextState = await rsvpEvent(eventId, user.uid);
      setRsvped(nextState);
      setEvent((current) => current ? {
        ...current,
        rsvpCount: Math.max(0, current.rsvpCount + (nextState ? 1 : -1)),
      } : current);
    } catch {
      setError("Your RSVP could not be updated. Please try again.");
    } finally {
      setRsvpBusy(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event?.title ?? "PakStartups event", url });
        setShareStatus("Share sheet opened.");
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus("Event link copied.");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      setShareStatus("Unable to share automatically. Copy the page address from your browser.");
    }
  };

  if (loading) {
    return <main className="mx-auto max-w-5xl px-6 py-16" aria-busy="true">Loading event details…</main>;
  }

  if (error && !event) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
        <Link href="/events" className="mt-6 inline-block font-bold text-[#0f5238]">← Back to Events</Link>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-black text-[#002112]">Event not found</h1>
        <p className="mt-3 text-[#404943]">This event may have been removed, cancelled, or the link may be incorrect.</p>
        <Link href="/events" className="mt-6 inline-block font-bold text-[#0f5238]">← Browse upcoming events</Link>
      </main>
    );
  }

  const location = event.isOnline
    ? "Online"
    : formatLocation({ city: event.city, region: event.region });
  const isPast = event.status === "past" || Boolean(eventDate && eventDate.getTime() < Date.now());

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Link href="/events" className="mb-6 inline-block text-sm font-bold text-[#0f5238]">← Back to Events</Link>

      <article className="overflow-hidden rounded-2xl border border-[#dbeee2] bg-white shadow-sm">
        <header className="border-b border-[#dbeee2] bg-[#f4fbf6] p-6 sm:p-10">
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-[#0f5238]">
            <span className="rounded-full bg-[#d5fde2] px-3 py-1">{event.type}</span>
            {event.isFeatured && <span className="rounded-full bg-white px-3 py-1">Featured</span>}
            {isPast && <span className="rounded-full bg-white px-3 py-1">Past event</span>}
          </div>
          <h1 className="mt-4 text-3xl font-black text-[#002112] sm:text-5xl">{event.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#404943]">{event.desc}</p>
        </header>

        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_280px]">
          <section aria-labelledby="event-information-heading">
            <h2 id="event-information-heading" className="text-xl font-black text-[#002112]">Event information</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><dt className="text-sm font-bold text-[#587065]">Date and time</dt><dd className="mt-1 text-[#002112]">{eventDate ? eventDate.toLocaleString([], { dateStyle: "full", timeStyle: "short" }) : event.dateLabel || "To be announced"}</dd></div>
              <div><dt className="text-sm font-bold text-[#587065]">Location</dt><dd className="mt-1 text-[#002112]">{location || event.location || "To be announced"}</dd></div>
              <div><dt className="text-sm font-bold text-[#587065]">Organizer</dt><dd className="mt-1 text-[#002112]">{event.organizerName || "PakStartups community"}</dd></div>
              <div><dt className="text-sm font-bold text-[#587065]">Attendance</dt><dd className="mt-1 text-[#002112]">{event.rsvpCount} {event.rsvpCount === 1 ? "person" : "people"} RSVP’d</dd></div>
            </dl>
          </section>

          <aside className="rounded-xl border border-[#dbeee2] bg-[#f9fcfa] p-5" aria-label="Event actions">
            <button
              type="button"
              onClick={() => void handleRsvp()}
              disabled={rsvpBusy || isPast}
              className="w-full rounded-lg bg-[#0f5238] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPast ? "Event ended" : rsvpBusy ? "Updating…" : rsvped ? "Cancel RSVP" : "RSVP"}
            </button>
            <button type="button" onClick={() => void handleShare()} className="mt-3 w-full rounded-lg bg-[#d5fde2] px-5 py-3 font-bold text-[#0f5238]">Share event</button>
            <p className="mt-3 text-sm text-[#587065]" aria-live="polite">{shareStatus}</p>
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          </aside>
        </div>
      </article>
    </main>
  );
}
