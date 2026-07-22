"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
  getUpcomingEvents,
  updateEventAnnouncementByAdmin,
  type EventItem,
} from "@/lib/services/events";
import {
  formatDateTimeLocal,
  zonedDateTimeToDate,
} from "@/lib/events/presentation";

type AnnouncementForm = {
  isFeatured: boolean;
  startsAt: string;
  endsAt: string;
  priority: string;
};

function eventToForm(event: EventItem): AnnouncementForm {
  const timezone = event.timezone || "Asia/Karachi";
  return {
    isFeatured: event.isFeatured,
    startsAt: event.announcementStartTs
      ? formatDateTimeLocal(event.announcementStartTs.toDate(), timezone)
      : "",
    endsAt: event.announcementEndTs
      ? formatDateTimeLocal(event.announcementEndTs.toDate(), timezone)
      : "",
    priority: String(event.announcementPriority ?? 0),
  };
}

function eventLocation(event: EventItem) {
  if (event.isOnline) return "Online";
  return [event.city, event.region].filter(Boolean).join(", ") || event.location;
}

export default function EventAnnouncementAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [forms, setForms] = useState<Record<string, AnnouncementForm>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const upcoming = await getUpcomingEvents();
      setEvents(upcoming);
      setForms(
        Object.fromEntries(
          upcoming
            .filter((event): event is EventItem & { id: string } =>
              Boolean(event.id),
            )
            .map((event) => [event.id, eventToForm(event)]),
        ),
      );
    } catch {
      setMessage("Upcoming events could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const setEventForm = (
    eventId: string,
    update: Partial<AnnouncementForm>,
  ) => {
    setForms((current) => ({
      ...current,
      [eventId]: {
        ...(current[eventId] ?? {
          isFeatured: false,
          startsAt: "",
          endsAt: "",
          priority: "0",
        }),
        ...update,
      },
    }));
  };

  const save = async (event: EventItem) => {
    if (!event.id) return;
    const form = forms[event.id];
    if (!form) return;

    const timezone = event.timezone || "Asia/Karachi";
    const startsAt = form.startsAt
      ? zonedDateTimeToDate(form.startsAt, timezone)
      : null;
    const endsAt = form.endsAt
      ? zonedDateTimeToDate(form.endsAt, timezone)
      : null;
    const priority = Number(form.priority || "0");

    if (form.startsAt && !startsAt) {
      setMessage(`Enter a valid announcement start for ${event.title}.`);
      return;
    }
    if (form.endsAt && !endsAt) {
      setMessage(`Enter a valid announcement end for ${event.title}.`);
      return;
    }
    if (startsAt && endsAt && endsAt.getTime() < startsAt.getTime()) {
      setMessage(`Announcement end must be after its start for ${event.title}.`);
      return;
    }
    if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
      setMessage(`Priority for ${event.title} must be a whole number from 0 to 100.`);
      return;
    }

    setSavingId(event.id);
    setMessage("");
    try {
      await updateEventAnnouncementByAdmin(event.id, {
        isFeatured: form.isFeatured,
        announcementStartTs: startsAt ? Timestamp.fromDate(startsAt) : null,
        announcementEndTs: endsAt ? Timestamp.fromDate(endsAt) : null,
        announcementPriority: priority,
      });
      setMessage(`Announcement settings saved for ${event.title}.`);
      await loadEvents();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : `Announcement settings could not be saved for ${event.title}.`,
      );
    } finally {
      setSavingId(null);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-lg border border-[#bfc9c1] bg-white px-4 py-3 text-[#002112] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]";

  return (
    <div className="space-y-8 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#0f5238]">
            Global header
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#002112]">
            Event announcement
          </h1>
          <p className="mt-2 max-w-3xl font-medium text-[#404943]">
            Approved upcoming events are ranked by featured status, then
            priority, then start date. Optional windows control when an event is
            eligible; cancelled, expired, and past events are hidden
            automatically.
          </p>
        </div>
        <Link
          href="/admin/events"
          className="min-h-11 rounded-lg border border-[#0f5238]/25 px-4 py-3 font-bold text-[#0f5238] transition hover:bg-[#e8f3ec] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] motion-reduce:transition-none"
        >
          Back to events
        </Link>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl border border-[#dbeee2] bg-[#f9fcfa] p-4 font-semibold text-[#0f5238]"
        >
          {message}
        </p>
      )}

      {loading ? (
        <div
          className="rounded-2xl border border-[#dbeee2] bg-white p-12 text-center"
          aria-busy="true"
        >
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f5238]/20 border-t-[#0f5238] motion-reduce:animate-none" />
          <span className="sr-only">Loading upcoming events</span>
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#b7cbbd] bg-[#f9fcfa] p-12 text-center">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-5xl text-[#70917d]"
          >
            event_busy
          </span>
          <h2 className="mt-3 text-xl font-black text-[#002112]">
            No approved upcoming events
          </h2>
          <p className="mt-2 text-[#404943]">
            Approve an upcoming event before configuring the global
            announcement.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {events.map((event) => {
            if (!event.id) return null;
            const form = forms[event.id] ?? eventToForm(event);
            const timezone = event.timezone || "Asia/Karachi";
            return (
              <section
                key={event.id}
                aria-labelledby={`announcement-${event.id}`}
                className="rounded-2xl border border-[#dbeee2] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2
                      id={`announcement-${event.id}`}
                      className="text-xl font-black text-[#002112]"
                    >
                      {event.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#404943]">
                      {event.dateLabel} · {eventLocation(event)} · {timezone}
                    </p>
                  </div>
                  <Link
                    href={`/events/${encodeURIComponent(event.id)}`}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-[#0f5238] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]"
                  >
                    View public page
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <label className="text-sm font-bold text-[#002112]">
                    Announcement starts
                    <input
                      type="datetime-local"
                      value={form.startsAt}
                      onChange={(changeEvent) =>
                        setEventForm(event.id!, {
                          startsAt: changeEvent.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                    <span className="mt-1 block text-xs font-medium text-[#65746a]">
                      Optional · {timezone}
                    </span>
                  </label>
                  <label className="text-sm font-bold text-[#002112]">
                    Announcement ends
                    <input
                      type="datetime-local"
                      value={form.endsAt}
                      onChange={(changeEvent) =>
                        setEventForm(event.id!, {
                          endsAt: changeEvent.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                    <span className="mt-1 block text-xs font-medium text-[#65746a]">
                      Optional · event start remains the final expiry
                    </span>
                  </label>
                  <label className="text-sm font-bold text-[#002112]">
                    Priority
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={form.priority}
                      onChange={(changeEvent) =>
                        setEventForm(event.id!, {
                          priority: changeEvent.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                    <span className="mt-1 block text-xs font-medium text-[#65746a]">
                      0–100; featured status ranks first
                    </span>
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <label className="flex min-h-11 items-center gap-3 font-bold text-[#002112]">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(changeEvent) =>
                        setEventForm(event.id!, {
                          isFeatured: changeEvent.target.checked,
                        })
                      }
                      className="h-5 w-5 accent-[#0f5238]"
                    />
                    Feature this event
                  </label>
                  <button
                    type="button"
                    onClick={() => void save(event)}
                    disabled={savingId === event.id}
                    className="min-h-11 rounded-lg bg-[#0f5238] px-5 py-3 font-bold text-white transition hover:bg-[#0b422d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
                  >
                    {savingId === event.id
                      ? "Saving…"
                      : "Save announcement settings"}
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
