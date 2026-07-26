import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EVENT_ANNOUNCEMENT_DISMISSAL_MS,
  getAnnouncementDismissedUntil,
  isAnnouncementDismissed,
  isEventAnnouncementEligible,
  selectEventAnnouncement,
  type EventAnnouncementCandidate,
} from "../lib/events/announcement";

const timestamp = (value: string) => ({
  toMillis: () => Date.parse(value),
});

const now = Date.parse("2030-07-01T10:00:00Z");
const baseEvent: EventAnnouncementCandidate = {
  id: "next-event",
  status: "approved",
  updateState: "scheduled",
  isFeatured: false,
  announcementPriority: 0,
  dateTs: timestamp("2030-07-03T10:00:00Z"),
};

assert.equal(isEventAnnouncementEligible(baseEvent, now), true);
assert.equal(
  isEventAnnouncementEligible(
    { ...baseEvent, status: "pending" },
    now,
  ),
  false,
);
assert.equal(
  isEventAnnouncementEligible(
    { ...baseEvent, updateState: "cancelled" },
    now,
  ),
  false,
);
assert.equal(
  isEventAnnouncementEligible(
    { ...baseEvent, dateTs: timestamp("2030-06-30T10:00:00Z") },
    now,
  ),
  false,
);
assert.equal(
  isEventAnnouncementEligible(
    {
      ...baseEvent,
      announcementStartTs: timestamp("2030-07-02T10:00:00Z"),
    },
    now,
  ),
  false,
);
assert.equal(
  isEventAnnouncementEligible(
    {
      ...baseEvent,
      announcementEndTs: timestamp("2030-07-01T09:59:59Z"),
    },
    now,
  ),
  false,
);

const featured = {
  ...baseEvent,
  id: "featured",
  isFeatured: true,
  announcementPriority: 1,
  dateTs: timestamp("2030-07-05T10:00:00Z"),
};
const highPriority = {
  ...baseEvent,
  id: "priority",
  announcementPriority: 100,
  dateTs: timestamp("2030-07-02T10:00:00Z"),
};
assert.equal(
  selectEventAnnouncement([highPriority, featured], now)?.id,
  "featured",
);

const lowPriority = {
  ...baseEvent,
  id: "low-priority",
  announcementPriority: 5,
};
assert.equal(
  selectEventAnnouncement([lowPriority, highPriority], now)?.id,
  "priority",
);

const later = {
  ...baseEvent,
  id: "later",
  dateTs: timestamp("2030-07-04T10:00:00Z"),
};
const sooner = {
  ...baseEvent,
  id: "sooner",
  dateTs: timestamp("2030-07-02T10:00:00Z"),
};
assert.equal(selectEventAnnouncement([later, sooner], now)?.id, "sooner");

const exactTieB = { ...baseEvent, id: "b-event" };
const exactTieA = { ...baseEvent, id: "a-event" };
assert.equal(
  selectEventAnnouncement([exactTieB, exactTieA], now)?.id,
  "a-event",
);

const dismissedUntil = getAnnouncementDismissedUntil(now);
assert.equal(dismissedUntil - now, EVENT_ANNOUNCEMENT_DISMISSAL_MS);
assert.equal(isAnnouncementDismissed(String(dismissedUntil), now), true);
assert.equal(
  isAnnouncementDismissed(String(dismissedUntil), dismissedUntil),
  false,
);
assert.equal(isAnnouncementDismissed("not-a-number", now), false);

const root = process.cwd();
const headerSource = readFileSync(
  join(root, "components/layout/Header.tsx"),
  "utf8",
);
const barSource = readFileSync(
  join(root, "components/layout/EventAnnouncementBar.tsx"),
  "utf8",
);
const serviceSource = readFileSync(
  join(root, "lib/services/events.ts"),
  "utf8",
);
const adminSource = readFileSync(
  join(root, "app/admin/events/announcement/page.tsx"),
  "utf8",
);
const rulesSource = readFileSync(join(root, "firestore.rules"), "utf8");
const cssSource = readFileSync(join(root, "app/globals.css"), "utf8");

for (const marker of [
  "EventAnnouncementBar",
  "<EventAnnouncementBar />",
  "sticky top-0",
]) {
  assert.ok(headerSource.includes(marker), `Header must include ${marker}`);
}

for (const marker of [
  'aria-label="Upcoming event announcement"',
  "event_announcement_clicked",
  "event_announcement_dismissed",
  "localStorage",
  "/events/",
  "motion-reduce:transition-none",
  "Dismiss this event announcement for 24 hours",
]) {
  assert.ok(
    barSource.includes(marker),
    `Announcement bar must include ${marker}`,
  );
}

for (const marker of [
  "getAnnouncementEvent",
  "selectEventAnnouncement",
  "updateEventAnnouncementByAdmin",
  'where("status", "==", "approved")',
  'where("dateTs", ">=", now)',
]) {
  assert.ok(
    serviceSource.includes(marker),
    `Event service must include ${marker}`,
  );
}

for (const marker of [
  "Announcement starts",
  "Announcement ends",
  "Priority",
  "Feature this event",
  "0–100",
  "aria-live",
]) {
  assert.ok(
    adminSource.includes(marker),
    `Announcement admin must include ${marker}`,
  );
}

for (const marker of [
  "safeAnnouncementDefaults",
  "announcementStartTs",
  "announcementEndTs",
  "announcementPriority",
]) {
  assert.ok(
    rulesSource.includes(marker),
    `Firestore rules must protect ${marker}`,
  );
}

assert.ok(
  cssSource.includes("scroll-padding-top"),
  "Global CSS must reserve anchor space for the sticky announcement header",
);

console.log("Event announcement acceptance checks passed.");
