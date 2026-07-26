import type { EventItem } from "@/lib/services/events";

export type EventActionState = {
  mode: "internal-rsvp" | "external-booking";
  disabled: boolean;
  label: string;
  reason: string;
};

const DEFAULT_TIMEZONE = "Asia/Karachi";

export function getSafeHttpsUrl(value?: string | null) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function timestampMillis(value: EventItem["dateTs"] | EventItem["registrationDeadlineTs"]) {
  return value?.toMillis?.() ?? null;
}

export function getEventActionState(event: EventItem, nowMs = Date.now()): EventActionState {
  const mode = event.bookingMode ?? "internal-rsvp";
  const eventTime = timestampMillis(event.dateTs);
  const deadline = timestampMillis(event.registrationDeadlineTs);
  const isCancelled = event.updateState === "cancelled";
  const isPast = event.status === "past" || (eventTime !== null && eventTime < nowMs);
  const registrationClosed = deadline !== null && deadline < nowMs;
  const isFull = mode === "internal-rsvp" && Boolean(event.capacity && event.rsvpCount >= event.capacity);

  if (isCancelled) {
    return { mode, disabled: true, label: "Event cancelled", reason: event.updateMessage || "Registration is unavailable because this event was cancelled." };
  }
  if (isPast) {
    return { mode, disabled: true, label: "Event ended", reason: "Registration is closed because this event has ended." };
  }
  if (registrationClosed) {
    return { mode, disabled: true, label: "Registration closed", reason: "The registration deadline has passed." };
  }
  if (isFull) {
    return { mode, disabled: true, label: "Event full", reason: "This event has reached its listed capacity." };
  }
  if (mode === "external-booking" && !getSafeHttpsUrl(event.bookingUrl)) {
    return { mode, disabled: true, label: "Booking unavailable", reason: "The organizer has not supplied a valid HTTPS booking link." };
  }

  return {
    mode,
    disabled: false,
    label: mode === "external-booking" ? "Book on organizer site" : "RSVP on PakStartups",
    reason: mode === "external-booking"
      ? "Registration is completed on the organizer's website."
      : "Your RSVP is stored by PakStartups and can be cancelled later.",
  };
}

export function formatEventDate(event: EventItem, locale = "en-PK") {
  if (!event.dateTs) return event.dateLabel || "To be announced";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: event.timezone || DEFAULT_TIMEZONE,
    }).format(event.dateTs.toDate());
  } catch {
    return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: DEFAULT_TIMEZONE }).format(event.dateTs.toDate());
  }
}

export function formatEventPrice(event: EventItem) {
  if ((event.priceType ?? "free") === "free") return "Free";
  if (!event.priceAmount) return "Paid — price not listed";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: event.currency || "PKR",
    maximumFractionDigits: 0,
  }).format(event.priceAmount);
}

export function formatDateTimeLocal(date: Date, timeZone = DEFAULT_TIMEZONE) {
  const format = (zone: string) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
  };

  try {
    return format(timeZone);
  } catch {
    return format(DEFAULT_TIMEZONE);
  }
}

export function zonedDateTimeToDate(value: string, timeZone = DEFAULT_TIMEZONE) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const target = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
  };
  if (
    target.month < 1 || target.month > 12 ||
    target.day < 1 || target.day > 31 ||
    target.hour < 0 || target.hour > 23 ||
    target.minute < 0 || target.minute > 59
  ) return null;

  let utcMs = Date.UTC(target.year, target.month - 1, target.day, target.hour, target.minute);

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(utcMs)).map((part) => [part.type, part.value]));
      const representedMs = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
      );
      const requestedMs = Date.UTC(target.year, target.month - 1, target.day, target.hour, target.minute);
      const correction = requestedMs - representedMs;
      if (correction === 0) break;
      utcMs += correction;
    }

    const candidate = new Date(utcMs);
    return formatDateTimeLocal(candidate, timeZone) === value ? candidate : null;
  } catch {
    return null;
  }
}

export function buildEventStructuredData(event: EventItem, canonicalUrl: string) {
  const action = getEventActionState(event);
  const startDate = event.dateTs?.toDate().toISOString();
  const externalBookingUrl = getSafeHttpsUrl(event.bookingUrl);
  const registrationUrl = event.bookingMode === "external-booking" && externalBookingUrl
    ? externalBookingUrl
    : canonicalUrl;
  const eventStatus = event.updateState === "cancelled"
    ? "https://schema.org/EventCancelled"
    : event.updateState === "postponed"
      ? "https://schema.org/EventPostponed"
      : event.updateState === "updated"
        ? "https://schema.org/EventRescheduled"
        : "https://schema.org/EventScheduled";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.desc,
    url: canonicalUrl,
    image: ["https://pakstartups.io/images/image-038.jpg"],
    ...(startDate ? { startDate } : {}),
    eventStatus,
    eventAttendanceMode: event.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: event.isOnline
      ? {
          "@type": "VirtualLocation",
          url: canonicalUrl,
          name: event.onlineAccessPolicy || "Online access details are provided to registered attendees.",
        }
      : {
          "@type": "Place",
          name: event.location || event.city || event.region || "Venue to be announced",
          address: {
            "@type": "PostalAddress",
            ...(event.city ? { addressLocality: event.city } : {}),
            ...(event.region ? { addressRegion: event.region } : {}),
            addressCountry: "PK",
          },
        },
    organizer: {
      "@type": "Organization",
      name: event.organizerName || "PakStartups community organizer",
      ...(event.organizerId ? { url: `https://pakstartups.io/profile/${encodeURIComponent(event.organizerId)}` } : {}),
    },
    ...(event.speakers?.length
      ? {
          performer: event.speakers.map((speaker) => ({
            "@type": "Person",
            name: speaker.name,
            ...(speaker.role ? { jobTitle: speaker.role } : {}),
            ...(speaker.organization ? { worksFor: { "@type": "Organization", name: speaker.organization } } : {}),
          })),
        }
      : {}),
    ...(event.capacity ? { maximumAttendeeCapacity: event.capacity } : {}),
    ...(event.capacity && event.bookingMode !== "external-booking"
      ? { remainingAttendeeCapacity: Math.max(0, event.capacity - event.rsvpCount) }
      : {}),
    offers: {
      "@type": "Offer",
      url: registrationUrl,
      price: event.priceType === "paid" ? event.priceAmount ?? undefined : 0,
      priceCurrency: event.currency || "PKR",
      availability: action.disabled
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      validFrom: event.createdAt && typeof event.createdAt === "object" && "toDate" in event.createdAt
        ? (event.createdAt as { toDate: () => Date }).toDate().toISOString()
        : undefined,
    },
  };
}
