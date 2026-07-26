import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildEventStructuredData,
  formatDateTimeLocal,
  getEventActionState,
  getSafeHttpsUrl,
  zonedDateTimeToDate,
} from "../lib/events/presentation";
import type { EventItem } from "../lib/services/events";

function timestamp(iso: string) {
  const date = new Date(iso);
  return {
    toDate: () => date,
    toMillis: () => date.getTime(),
  } as EventItem["dateTs"];
}

const future = "2030-08-01T13:00:00.000Z";
const baseEvent: EventItem = {
  id: "event-1",
  title: "Pakistan Startup Workshop",
  desc: "A practical workshop for founders building in Pakistan.",
  type: "WORKSHOP",
  location: "Innovation Hub",
  city: "Lahore",
  regionId: "punjab",
  region: "Punjab",
  country: "Pakistan",
  countryCode: "PK",
  isOnline: false,
  organizerId: "organizer-1",
  organizerName: "Community Organizer",
  dateTs: timestamp(future),
  dateLabel: "1 Aug 2030",
  timezone: "Asia/Karachi",
  capacity: 100,
  priceType: "free",
  bookingMode: "internal-rsvp",
  updateState: "scheduled",
  rsvpCount: 12,
  status: "approved",
  isFeatured: false,
};

assert.deepEqual(getEventActionState(baseEvent, Date.parse("2030-07-01T00:00:00Z")), {
  mode: "internal-rsvp",
  disabled: false,
  label: "RSVP on PakStartups",
  reason: "Your RSVP is stored by PakStartups and can be cancelled later.",
});

assert.equal(getEventActionState({ ...baseEvent, rsvpCount: 100 }, Date.parse("2030-07-01T00:00:00Z")).label, "Event full");
assert.equal(getEventActionState({ ...baseEvent, updateState: "cancelled" }, Date.parse("2030-07-01T00:00:00Z")).label, "Event cancelled");
assert.equal(getEventActionState({ ...baseEvent, bookingMode: "external-booking", bookingUrl: "https://example.com/book" }, Date.parse("2030-07-01T00:00:00Z")).label, "Book on organizer site");
assert.equal(getEventActionState({ ...baseEvent, bookingMode: "external-booking", bookingUrl: undefined }, Date.parse("2030-07-01T00:00:00Z")).label, "Booking unavailable");
assert.equal(getEventActionState({ ...baseEvent, bookingMode: "external-booking", bookingUrl: "javascript:alert(1)" }, Date.parse("2030-07-01T00:00:00Z")).label, "Booking unavailable");
assert.equal(getSafeHttpsUrl("javascript:alert(1)"), undefined);
assert.equal(getSafeHttpsUrl("http://example.com"), undefined);
assert.equal(getSafeHttpsUrl("https://example.com/book"), "https://example.com/book");

const zoned = zonedDateTimeToDate("2030-08-01T18:00", "Asia/Karachi");
assert.ok(zoned);
assert.equal(zoned?.toISOString(), future);
assert.equal(formatDateTimeLocal(new Date(future), "Asia/Karachi"), "2030-08-01T18:00");
assert.equal(zonedDateTimeToDate("2030-08-01T18:00", "Invalid/Timezone"), null);

const schema = buildEventStructuredData({
  ...baseEvent,
  isOnline: true,
  regionId: "remote-online",
  region: "Remote / Online",
  bookingMode: "external-booking",
  bookingUrl: "https://example.com/book",
  speakers: [{ name: "Ayesha Khan", role: "Founder" }],
}, "https://pakstartups.io/events/event-1") as Record<string, unknown>;
assert.equal(schema["@type"], "Event");
assert.equal(schema.eventAttendanceMode, "https://schema.org/OnlineEventAttendanceMode");
assert.equal((schema.offers as { url: string }).url, "https://example.com/book");
assert.ok(Array.isArray(schema.performer));

const root = process.cwd();
const actionsSource = readFileSync(join(root, "app/events/[id]/EventActions.tsx"), "utf8");
const pageSource = readFileSync(join(root, "app/events/[id]/page.tsx"), "utf8");
const adminSource = readFileSync(join(root, "app/admin/events/page.tsx"), "utf8");
const sitemapSource = readFileSync(join(root, "app/sitemap.ts"), "utf8");

for (const marker of ["focus-visible:ring-4", "motion-reduce:transition-none", "aria-live=\"polite\"", "<button", "<a href={safeBookingUrl}"]) {
  assert.ok(actionsSource.includes(marker), `Event actions must include ${marker}`);
}
for (const marker of ["generateMetadata", "application/ld+json", "Related upcoming events", "sm:", "lg:", "motion-reduce:transition-none"]) {
  assert.ok(pageSource.includes(marker), `Event detail page must include ${marker}`);
}
for (const marker of ["Create event", "Expanded event details", "updateState", "bookingMode", "accessibilityDetails", "registrationDeadline"]) {
  assert.ok(adminSource.includes(marker), `Admin event editor must include ${marker}`);
}
assert.ok(sitemapSource.includes("getPublicEventsForSitemap"));
assert.ok(sitemapSource.includes("/events/${encodeURIComponent(event.id)}"));

console.log("Event detail acceptance checks passed.");
