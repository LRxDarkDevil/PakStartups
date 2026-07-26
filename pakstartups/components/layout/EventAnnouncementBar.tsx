"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import posthog from "posthog-js";
import {
  getAnnouncementEvent,
  type EventItem,
} from "@/lib/services/events";
import {
  getAnnouncementDismissedUntil,
  isAnnouncementDismissed,
} from "@/lib/events/announcement";

const DISMISSAL_KEY_PREFIX = "pakstartups:event-announcement-dismissed:";

function formatAnnouncementDate(event: EventItem) {
  if (!event.dateTs) return event.dateLabel;
  try {
    return new Intl.DateTimeFormat("en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: event.timezone || "Asia/Karachi",
      timeZoneName: "short",
    }).format(event.dateTs.toDate());
  } catch {
    return event.dateLabel;
  }
}

function formatLocation(event: EventItem) {
  if (event.isOnline) return "Online";
  return [event.city, event.region].filter(Boolean).join(", ") || event.location;
}

function captureAnnouncementEvent(
  name: "event_announcement_clicked" | "event_announcement_dismissed",
  event: EventItem,
) {
  posthog.capture(name, {
    event_id: event.id,
    event_title: event.title,
    is_featured: event.isFeatured,
    announcement_priority: event.announcementPriority ?? 0,
    source: "global_header",
  });
}

export default function EventAnnouncementBar() {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    void getAnnouncementEvent()
      .then((nextEvent) => {
        if (!active || !nextEvent?.id) return;
        const dismissalKey = `${DISMISSAL_KEY_PREFIX}${nextEvent.id}`;
        let hidden = false;
        try {
          hidden = isAnnouncementDismissed(
            window.localStorage.getItem(dismissalKey),
          );
          if (!hidden) window.localStorage.removeItem(dismissalKey);
        } catch {
          hidden = false;
        }
        setDismissed(hidden);
        setEvent(nextEvent);
      })
      .catch(() => {
        if (active) setEvent(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const eventHref = useMemo(
    () => (event?.id ? `/events/${encodeURIComponent(event.id)}` : "/events"),
    [event?.id],
  );

  if (!event?.id || dismissed) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(
        `${DISMISSAL_KEY_PREFIX}${event.id}`,
        String(getAnnouncementDismissedUntil()),
      );
    } catch {
      // Dismiss for the current session even when storage is unavailable.
    }
    captureAnnouncementEvent("event_announcement_dismissed", event);
    setDismissed(true);
  };

  return (
    <aside
      aria-label="Upcoming event announcement"
      className="border-b border-white/15 bg-[#0f5238] text-white"
    >
      <div className="mx-auto flex min-h-11 w-full max-w-8xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-xs sm:px-8 sm:text-sm">
        <span
          aria-hidden="true"
          className="material-symbols-outlined shrink-0 text-[18px]"
        >
          campaign
        </span>
        <span className="shrink-0 font-extrabold uppercase tracking-[0.14em] text-[#b4ef9d]">
          Upcoming event
        </span>
        <span className="hidden text-white/50 sm:inline" aria-hidden="true">
          •
        </span>
        <strong className="max-w-full truncate font-bold">{event.title}</strong>
        <span className="hidden text-white/50 sm:inline" aria-hidden="true">
          •
        </span>
        <span className="text-white/85">
          {formatAnnouncementDate(event)} · {formatLocation(event)}
        </span>
        <Link
          href={eventHref}
          onClick={() =>
            captureAnnouncementEvent("event_announcement_clicked", event)
          }
          className="min-h-9 rounded-md px-2 py-2 font-extrabold underline decoration-[#b4ef9d] decoration-2 underline-offset-4 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
        >
          View event
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss this event announcement for 24 hours"
          className="ml-0 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:ml-1 motion-reduce:transition-none"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[20px]"
          >
            close
          </span>
        </button>
      </div>
    </aside>
  );
}
