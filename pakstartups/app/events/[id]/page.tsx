import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { formatLocation } from "@/lib/location";
import {
  getPublicEventById,
  getRelatedEvents,
  type EventItem,
} from "@/lib/services/events";
import {
  buildEventStructuredData,
  formatEventDate,
  formatEventPrice,
} from "@/lib/events/presentation";
import EventActions from "./EventActions";

export const dynamic = "force-dynamic";

const siteUrl = "https://pakstartups.io";
const defaultImage = `${siteUrl}/images/image-038.jpg`;

type EventPageProps = {
  params: Promise<{ id: string }>;
};

function normalizeEventId(value: string) {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

const loadEvent = cache(async (eventId: string) => getPublicEventById(eventId));

function eventUrl(eventId: string) {
  return `${siteUrl}/events/${encodeURIComponent(eventId)}`;
}

function formatDeadline(event: EventItem) {
  if (!event.registrationDeadlineTs) return null;
  try {
    return new Intl.DateTimeFormat("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: event.timezone || "Asia/Karachi",
    }).format(event.registrationDeadlineTs.toDate());
  } catch {
    return new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" }).format(event.registrationDeadlineTs.toDate());
  }
}

function formatLifecycleLabel(event: EventItem) {
  switch (event.updateState) {
    case "cancelled": return "Cancelled";
    case "postponed": return "Postponed";
    case "updated": return "Schedule updated";
    default: return "Scheduled";
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const eventId = normalizeEventId(id);

  try {
    const event = await loadEvent(eventId);
    if (!event) {
      return {
        title: "Event not found",
        description: "The requested PakStartups event is unavailable.",
        robots: { index: false, follow: false },
      };
    }

    const canonical = eventUrl(eventId);
    const description = event.desc.replace(/\s+/g, " ").trim().slice(0, 160);
    return {
      title: event.title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        siteName: "PakStartups",
        title: event.title,
        description,
        images: [{ url: defaultImage, width: 1200, height: 630, alt: event.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description,
        images: [defaultImage],
      },
    };
  } catch {
    return {
      title: "PakStartups event",
      description: "View event details on PakStartups.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;
  const eventId = normalizeEventId(id);
  if (!eventId) notFound();

  const event = await loadEvent(eventId);
  if (!event) notFound();

  const relatedEvents = await getRelatedEvents(event, 3).catch(() => []);
  const canonical = eventUrl(eventId);
  const structuredData = buildEventStructuredData(event, canonical);
  const dateText = formatEventDate(event);
  const deadlineText = formatDeadline(event);
  const locationText = event.isOnline
    ? "Online event"
    : formatLocation({ city: event.city, region: event.region }) || event.location || "Venue to be announced";
  const lifecycleLabel = formatLifecycleLabel(event);
  const isPast = event.status === "past" || Boolean(event.dateTs && event.dateTs.toMillis() < Date.now());
  const registrationDeadline = event.registrationDeadlineTs?.toDate().toISOString();
  const eventStartsAt = event.dateTs?.toDate().toISOString();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <Link
        href="/events"
        className="mb-6 inline-flex min-h-11 items-center rounded-md font-bold text-[#0f5238] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]"
      >
        ← Back to Events
      </Link>

      {(event.updateState === "cancelled" || event.updateState === "postponed" || event.updateState === "updated") && (
        <section
          aria-labelledby="event-update-heading"
          className={`mb-6 rounded-2xl border p-5 ${event.updateState === "cancelled" ? "border-red-300 bg-red-50 text-red-900" : "border-amber-300 bg-amber-50 text-amber-950"}`}
        >
          <h2 id="event-update-heading" className="text-lg font-black">{lifecycleLabel}</h2>
          <p className="mt-1 leading-7">{event.updateMessage || "The organizer changed this event. Review the current schedule and registration details before making plans."}</p>
        </section>
      )}

      <article className="overflow-hidden rounded-3xl border border-[#dbeee2] bg-white shadow-sm">
        <header className="border-b border-[#dbeee2] bg-[#f4fbf6] p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-[#0f5238]">
            <span className="rounded-full bg-[#d5fde2] px-3 py-1">{event.type}</span>
            <span className="rounded-full bg-white px-3 py-1">{lifecycleLabel}</span>
            {event.isFeatured && <span className="rounded-full bg-white px-3 py-1">Featured</span>}
            {isPast && <span className="rounded-full bg-white px-3 py-1">Past event</span>}
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-[#002112] sm:text-5xl lg:text-6xl">{event.title}</h1>
          <p className="mt-5 max-w-4xl whitespace-pre-line text-lg leading-8 text-[#404943]">{event.desc}</p>
        </header>

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-12">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="event-information-heading">
              <h2 id="event-information-heading" className="text-2xl font-black text-[#002112]">Event information</h2>
              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-bold text-[#587065]">Date, time and timezone</dt>
                  <dd className="mt-1 text-[#002112]">{dateText}{event.timezone ? ` · ${event.timezone}` : ""}</dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-[#587065]">Location</dt>
                  <dd className="mt-1 text-[#002112]">{locationText}</dd>
                  {!event.isOnline && event.location && event.location !== locationText && (
                    <dd className="mt-1 text-sm text-[#587065]">{event.location}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-sm font-bold text-[#587065]">Price</dt>
                  <dd className="mt-1 text-[#002112]">{formatEventPrice(event)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-[#587065]">Registration deadline</dt>
                  <dd className="mt-1 text-[#002112]">{deadlineText || "No separate deadline listed"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-[#587065]">Capacity</dt>
                  <dd className="mt-1 text-[#002112]">{event.capacity ? `${event.capacity} places` : "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-[#587065]">Registration method</dt>
                  <dd className="mt-1 text-[#002112]">{event.bookingMode === "external-booking" ? "Organizer website" : "PakStartups RSVP"}</dd>
                </div>
              </dl>
            </section>

            {event.isOnline && (
              <section aria-labelledby="online-access-heading" className="rounded-2xl border border-[#dbeee2] bg-[#f9fcfa] p-5 sm:p-6">
                <h2 id="online-access-heading" className="text-xl font-black text-[#002112]">Online access</h2>
                <p className="mt-2 leading-7 text-[#404943]">{event.onlineAccessPolicy || "Access instructions will be shared by the organizer with registered attendees."}</p>
                <p className="mt-2 text-sm text-[#587065]">Private meeting links are not published on this public page.</p>
              </section>
            )}

            {event.agenda?.length ? (
              <section aria-labelledby="agenda-heading">
                <h2 id="agenda-heading" className="text-2xl font-black text-[#002112]">Agenda</h2>
                <ol className="mt-5 space-y-3">
                  {event.agenda.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-4 rounded-xl border border-[#dbeee2] bg-[#f9fcfa] p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d5fde2] text-sm font-black text-[#0f5238]">{index + 1}</span>
                      <span className="pt-1 leading-7 text-[#002112]">{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {event.speakers?.length ? (
              <section aria-labelledby="speakers-heading">
                <h2 id="speakers-heading" className="text-2xl font-black text-[#002112]">Speakers</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {event.speakers.map((speaker, index) => (
                    <li key={`${speaker.name}-${index}`} className="rounded-xl border border-[#dbeee2] p-5">
                      <p className="font-black text-[#002112]">{speaker.name}</p>
                      {(speaker.role || speaker.organization) && (
                        <p className="mt-1 text-sm text-[#587065]">{[speaker.role, speaker.organization].filter(Boolean).join(" · ")}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="accessibility-heading">
              <h2 id="accessibility-heading" className="text-2xl font-black text-[#002112]">Accessibility</h2>
              <p className="mt-3 leading-7 text-[#404943]">
                {event.accessibilityDetails || "No specific accessibility arrangements have been listed. Contact the organizer before registering if you need an accommodation."}
              </p>
            </section>

            <section aria-labelledby="organizer-heading" className="rounded-2xl border border-[#dbeee2] bg-[#f4fbf6] p-5 sm:p-6">
              <h2 id="organizer-heading" className="text-2xl font-black text-[#002112]">Organizer</h2>
              <p className="mt-3 text-lg font-bold text-[#002112]">{event.organizerName || "PakStartups community organizer"}</p>
              <p className="mt-2 leading-7 text-[#404943]">This community-submitted event was reviewed before publication. PakStartups does not independently guarantee organizer claims, schedules, or external booking terms.</p>
              {event.organizerId && (
                <Link
                  href={`/profile/${encodeURIComponent(event.organizerId)}`}
                  className="mt-4 inline-flex min-h-11 items-center rounded-md font-bold text-[#0f5238] underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]"
                >
                  View submitting profile
                </Link>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#dbeee2] bg-[#f9fcfa] p-5 lg:sticky lg:top-24" aria-label="Event actions">
            <EventActions
              eventId={eventId}
              title={event.title}
              bookingMode={event.bookingMode ?? "internal-rsvp"}
              bookingUrl={event.bookingUrl}
              initialRsvpCount={event.rsvpCount}
              capacity={event.capacity}
              eventStartsAt={eventStartsAt}
              registrationDeadline={registrationDeadline}
              updateState={event.updateState ?? "scheduled"}
              updateMessage={event.updateMessage}
            />
          </aside>
        </div>
      </article>

      <section aria-labelledby="related-events-heading" className="mt-12 sm:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#0f5238]">Keep discovering</p>
            <h2 id="related-events-heading" className="mt-2 text-3xl font-black text-[#002112]">Related upcoming events</h2>
          </div>
          <Link href="/events" className="rounded-md font-bold text-[#0f5238] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]">Browse all events →</Link>
        </div>

        {relatedEvents.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {relatedEvents.map((related) => (
              <article key={related.id} className="rounded-2xl border border-[#dbeee2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
                <p className="text-xs font-bold uppercase tracking-wide text-[#0f5238]">{related.type}</p>
                <h3 className="mt-2 text-xl font-black text-[#002112]">
                  <Link href={`/events/${encodeURIComponent(related.id ?? "")}`} className="rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]">{related.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#587065]">{formatEventDate(related)}</p>
                <p className="mt-1 text-sm text-[#587065]">{related.isOnline ? "Online" : formatLocation({ city: related.city, region: related.region }) || related.location}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#b7cbbd] bg-white p-8 text-[#404943]">
            No related upcoming events are available yet. Browse the event directory for new listings.
          </div>
        )}
      </section>
    </div>
  );
}
