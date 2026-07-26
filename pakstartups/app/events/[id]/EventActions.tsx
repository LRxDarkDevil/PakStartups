"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getSafeHttpsUrl } from "@/lib/events/presentation";
import {
  hasUserRsvped,
  rsvpEvent,
  type EventBookingMode,
  type EventUpdateState,
} from "@/lib/services/events";

type EventActionsProps = {
  eventId: string;
  title: string;
  bookingMode: EventBookingMode;
  bookingUrl?: string;
  initialRsvpCount: number;
  capacity?: number;
  eventStartsAt?: string;
  registrationDeadline?: string;
  updateState: EventUpdateState;
  updateMessage?: string;
};

export default function EventActions({
  eventId,
  title,
  bookingMode,
  bookingUrl,
  initialRsvpCount,
  capacity,
  eventStartsAt,
  registrationDeadline,
  updateState,
  updateMessage,
}: EventActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [rsvped, setRsvped] = useState(false);
  const [checkingRsvp, setCheckingRsvp] = useState(false);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(initialRsvpCount);
  const [status, setStatus] = useState("");

  const safeBookingUrl = useMemo(() => getSafeHttpsUrl(bookingUrl), [bookingUrl]);

  const availability = useMemo(() => {
    const now = Date.now();
    const eventEnded = eventStartsAt ? new Date(eventStartsAt).getTime() < now : false;
    const deadlinePassed = registrationDeadline ? new Date(registrationDeadline).getTime() < now : false;
    const cancelled = updateState === "cancelled";
    const full = Boolean(capacity && rsvpCount >= capacity);

    if (cancelled) return { closed: true, label: "Event cancelled", reason: updateMessage || "Registration is unavailable because this event was cancelled." };
    if (eventEnded) return { closed: true, label: "Event ended", reason: "Registration is closed because this event has ended." };
    if (deadlinePassed) return { closed: true, label: "Registration closed", reason: "The registration deadline has passed." };
    if (bookingMode === "internal-rsvp" && full && !rsvped) return { closed: true, label: "Event full", reason: "This event has reached its listed capacity." };
    if (bookingMode === "external-booking" && !safeBookingUrl) return { closed: true, label: "Booking unavailable", reason: "The organizer has not supplied a valid HTTPS booking link." };
    return { closed: false, label: "", reason: "" };
  }, [bookingMode, capacity, eventStartsAt, registrationDeadline, rsvpCount, rsvped, safeBookingUrl, updateMessage, updateState]);

  useEffect(() => {
    let active = true;
    if (bookingMode !== "internal-rsvp" || !user) {
      setRsvped(false);
      setCheckingRsvp(false);
      return () => { active = false; };
    }

    setCheckingRsvp(true);
    hasUserRsvped(eventId, user.uid)
      .then((value) => {
        if (active) setRsvped(value);
      })
      .catch(() => {
        if (active) setStatus("We could not confirm your current RSVP state. You can try again.");
      })
      .finally(() => {
        if (active) setCheckingRsvp(false);
      });

    return () => { active = false; };
  }, [bookingMode, eventId, user]);

  const handleRsvp = async () => {
    if (!user) {
      router.push(`/auth/signup?next=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setRsvpBusy(true);
    setStatus("");
    try {
      const nextState = await rsvpEvent(eventId, user.uid);
      setRsvped(nextState);
      setRsvpCount((current) => Math.max(0, current + (nextState ? 1 : -1)));
      setStatus(nextState ? "Your RSVP is confirmed." : "Your RSVP was cancelled.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your RSVP could not be updated. Please try again.");
    } finally {
      setRsvpBusy(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setStatus("Share sheet opened.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setStatus("Event link copied.");
      } else {
        setStatus("Copy the event address from your browser to share it.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Unable to share automatically. Copy the page address from your browser.");
    }
  };

  const primaryClass = "inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#0f5238] px-5 py-3 text-center font-bold text-white transition hover:bg-[#0b422d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

  return (
    <div aria-label="Event registration and sharing">
      {bookingMode === "external-booking" ? (
        availability.closed ? (
          <button type="button" disabled className={primaryClass}>{availability.label}</button>
        ) : (
          <a href={safeBookingUrl} target="_blank" rel="noopener noreferrer" className={primaryClass}>
            Book on organizer site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )
      ) : (
        <button
          type="button"
          onClick={() => void handleRsvp()}
          disabled={availability.closed || rsvpBusy || checkingRsvp}
          className={primaryClass}
        >
          {availability.closed
            ? availability.label
            : checkingRsvp
              ? "Checking RSVP…"
              : rsvpBusy
                ? "Updating…"
                : rsvped
                  ? "Cancel RSVP"
                  : "RSVP on PakStartups"}
        </button>
      )}

      <p className="mt-3 text-sm text-[#587065]">
        {availability.reason || (bookingMode === "external-booking"
          ? "Registration is completed on the organizer's website."
          : "Your RSVP is stored by PakStartups and can be cancelled later.")}
      </p>

      <p className="mt-3 text-sm font-semibold text-[#002112]">
        {rsvpCount} {rsvpCount === 1 ? "person has" : "people have"} RSVP’d
        {capacity ? ` · ${Math.max(0, capacity - rsvpCount)} places remaining` : ""}
      </p>

      <button
        type="button"
        onClick={() => void handleShare()}
        className="mt-4 min-h-12 w-full rounded-lg bg-[#d5fde2] px-5 py-3 font-bold text-[#0f5238] transition hover:bg-[#c5f4d4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] motion-reduce:transition-none"
      >
        Share or copy link
      </button>
      <p className="mt-3 min-h-5 text-sm text-[#587065]" aria-live="polite">{status}</p>
    </div>
  );
}
