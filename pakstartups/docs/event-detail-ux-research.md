# Event detail UX research

_Last reviewed: 22 July 2026_

## Purpose

This document translates current event-discovery and conversion patterns into implementation requirements for PakStartups event pages. It intentionally copies interaction principles and information architecture, not another product's visual branding.

The scope is ORB-TOQ5T: canonical event pages, complete event information, explicit RSVP/booking behavior, organizer trust, related discovery, cancellation handling, structured metadata, and accessible responsive behavior.

## Sources reviewed

### Meetup

Meetup's current event experience treats attendance as a stateful flow rather than a single button. Confirmed attendees, waitlists, guest counts, attendance mode, check-in state, and post-event attendance are distinct concepts. Hybrid events explicitly ask whether a person is attending online or in person, and users can later edit or cancel that choice.

Meetup also gives event pages a social-proof layer through attendee summaries and a “Who will be there” section, while reserving fuller attendee details for authorized users. Confirmed attendance can expose a ticket entry point, but waitlisted users do not receive a valid ticket until confirmed.

References:

- https://help.meetup.com/hc/en-us/articles/9389668230541-Manage-attendees-and-track-attendance-for-your-Meetup-event
- https://help.meetup.com/hc/en-us/articles/39234367565709-Reviewing-an-attendees-list
- https://help.meetup.com/hc/en-us/articles/19318209614349-How-to-attend-a-hybrid-event
- https://help.meetup.com/hc/en-us/articles/45352867716621-Your-event-ticket-and-QR-code

### Eventbrite

Eventbrite separates the public event listing from protected attendee access. Online joining details can be available through an attendee-only event page after registration and authentication. Event pages also expose a clear organizer contact path because the platform cannot answer event-specific questions on an organizer's behalf.

References:

- https://www.eventbrite.com/help/en-us/articles/647151/how-to-contact-the-event-organizer/
- https://www.eventbrite.com/help/en-us/articles/308105/how-can-i-prevent-attendees-from-sharing-the-same-ticket/

### Google Search Central and Schema.org

Google recommends a unique leaf URL for each event, focused on one event, with accurate visible content matching the structured data. Required and recommended event fields include name, start date, location, description, image, end date, organizer, performer, offers, and event status. Rescheduled events should retain the previous start date; cancelled, postponed, rescheduled, online, offline, and mixed-attendance states should be represented explicitly.

Google recommends validating Event JSON-LD with the Rich Results Test and keeping event URLs discoverable through a sitemap. Structured data must describe content that is actually visible on the page and must not invent unavailable fields.

References:

- https://developers.google.com/search/docs/appearance/structured-data/event
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://schema.org/Event

## Applicable PakStartups patterns

### 1. Information hierarchy

The first viewport should answer the conversion-critical questions without requiring users to read the full description:

1. Event title and status.
2. Date, local time, and timezone.
3. Venue or online/hybrid mode.
4. Organizer identity and trust context.
5. Price/free status and remaining capacity when known.
6. Primary RSVP or booking action.
7. Registration deadline or closed state.

The longer description, agenda, speakers, accessibility information, organizer details, and related events should follow below.

PakStartups should not display placeholder values such as “TBD”, zero price, unlimited capacity, or default speakers as though they were verified facts. Missing optional fields should be omitted or described honestly.

### 2. Explicit attendance and booking modes

The event model and UI should distinguish these modes:

- `internal-rsvp`: PakStartups owns the RSVP record and can show Going/Cancel states.
- `external-booking`: the CTA sends users to an organizer-controlled registration URL; PakStartups must not imply registration is complete.
- `information-only`: no registration action is available.

The event page should never show both an internal RSVP confirmation and an external “Book now” action as equivalent completion paths. The primary CTA label and helper text must explain what happens next.

Recommended states:

- Sign in to RSVP.
- RSVP / Going.
- Cancel RSVP.
- Join waitlist / Waitlisted, only when capacity and waitlist behavior are implemented.
- Register on organizer site, with an external-link indicator.
- Registration closed.
- Event ended.
- Event cancelled.

For hybrid events, the RSVP flow should record `online` or `in-person` attendance rather than silently treating both as the same capacity pool.

### 3. Online-access privacy

Public pages may state that an event is online and identify the platform when safe, but private meeting URLs, passwords, dial-in codes, and attendee-only instructions must not be rendered to anonymous users.

A future protected attendee view should reveal access details only after authorization and confirmed registration. Until that exists, the event model should store a public access policy separately from private joining instructions.

### 4. Organizer trust

The event page should show, when available:

- Organizer name and profile or organization link.
- Verification state derived from existing PakStartups moderation data.
- Number of upcoming or previous published events.
- Contact path or organizer-provided public contact channel.
- Clear disclosure when registration and support are handled externally.

Trust claims must come from stored, reviewable data. The UI must not infer “verified”, “official”, “partner”, or attendance success from an organizer name alone.

### 5. Attendance context and privacy

Useful social proof includes an aggregate attendee count, capacity, remaining availability, and a small preview of public attendee profiles when privacy rules allow it.

The public page should default to aggregate counts. Full attendee identity should not be exposed merely because an RSVP collection exists. Any attendee preview must respect profile visibility and authorization rules.

### 6. Cancellation, postponement, and updates

Event status should be a first-class field, not inferred only from dates. Supported states should include:

- scheduled
- postponed
- rescheduled
- cancelled
- completed

Cancelled events must replace the conversion CTA with a prominent status message. Rescheduled events should show the new schedule and, where available, the previous start date. Material update text and its timestamp should be visible near the schedule rather than buried in the description.

### 7. Related discovery

Related events should prioritize:

1. Same organizer and upcoming.
2. Same event type and region.
3. Same tags or audience.
4. Other upcoming events as a fallback.

The current event must be excluded. Cancelled, unpublished, demo, and past events should not appear unless the section is intentionally historical.

A small deterministic result set is preferable to a broad query that requires fragile Firestore composite indexes. Query requirements should be documented before deployment.

### 8. Sharing

Canonical `/events/[id]` URLs are the only share target. Web Share may be used when available, with copy-link fallback and an accessible live status message.

Share content should include the real event title and canonical URL. It should not include unverified price, organizer, or attendance claims.

### 9. SEO and structured data

Each canonical event page should provide server-rendered metadata derived from the hydrated event record:

- Unique title and description.
- Canonical URL.
- Open Graph title, description, URL, type, and image when valid.
- Event JSON-LD matching visible content.

Recommended Event JSON-LD mapping:

| PakStartups field | Schema.org field |
| --- | --- |
| `title` | `name` |
| `startDate` | `startDate` |
| `endDate` | `endDate` |
| `timezone` | included in ISO-8601 date offsets |
| `status` | `eventStatus` |
| physical venue/address | `location: Place` |
| online URL policy | `location: VirtualLocation` and `eventAttendanceMode` |
| hybrid mode | `MixedEventAttendanceMode` plus both locations |
| `description` | `description` |
| `imageUrl` | `image` |
| organizer | `organizer` |
| speakers | `performer` |
| price/currency/booking URL | `offers` |
| previous schedule | `previousStartDate` |

Structured data must omit fields that are missing or not publicly visible. Private online access URLs must not be included. Every published canonical event URL should be included in the sitemap and removed or updated when the event becomes unpublished.

### 10. Accessibility and responsive behavior

Implementation should verify:

- A single semantic `h1` for the event title.
- Native links and buttons rather than clickable generic containers.
- Visible keyboard focus.
- Status and RSVP errors announced through appropriate live regions.
- Date/time information available as text, not only icons.
- External booking links identified in accessible text.
- Cancelled and closed states communicated with text as well as color.
- Logical focus order when the CTA becomes sticky on small screens.
- No essential animation; transitions respect `prefers-reduced-motion`.
- Long titles, organizer names, addresses, and translated text wrap without hiding the CTA.
- Touch targets remain usable on narrow screens.

Testing should cover keyboard-only navigation, 320–375 px mobile widths, tablet and desktop layouts, reduced motion, missing optional data, long content, RSVP authorization failures, external-booking mode, cancellation, past events, and invalid IDs.

## Concrete model requirements

The expanded event model should support optional, backward-compatible fields for:

- `slug` only when uniqueness and migration behavior are defined; otherwise canonical IDs remain valid.
- `timezone`.
- `venueName`, structured address, `regionId`, `region`, and `city`.
- `attendanceMode`: `in-person`, `online`, or `hybrid`.
- Public online-access policy and separate protected joining instructions.
- `organizerId`, organizer name, and organizer URL.
- `agenda` entries.
- `speakers` with name, role, and optional profile/image URL.
- `capacity` and optional waitlist policy.
- `pricingMode`: `free`, `paid`, or `unknown`; amount and currency only when paid.
- `registrationMode`: `internal-rsvp`, `external-booking`, or `information-only`.
- External booking URL.
- Registration deadline.
- Accessibility details.
- `status`, status message, update timestamp, and previous start date.
- Search/social image.
- Tags used for related-event discovery.

Existing records must continue to hydrate without these fields. Admin and proposal forms should validate conditional requirements, such as requiring a safe external URL for external booking and forbidding a paid amount when the event is free.

## Implementation order

1. Expand the service type and hydration layer with optional backward-compatible fields.
2. Add conditional validation in admin and proposal flows.
3. Render complete information and explicit CTA states on the canonical page.
4. Separate public online policy from protected access instructions.
5. Add related-event service queries with documented index needs.
6. Move metadata generation to a server boundary and emit accurate JSON-LD.
7. Include published canonical events in the sitemap.
8. Add unit tests for mapping/validation and browser tests for CTA, keyboard, responsive, reduced-motion, cancellation, and error states.
9. Validate representative pages with the Rich Results Test before production deployment.

## Non-goals and safeguards

- Do not copy Meetup or Eventbrite styling, wording, brand assets, or proprietary layout.
- Do not expose private attendee or online-access data.
- Do not claim that an external booking completed inside PakStartups.
- Do not create fake organizer trust, attendee counts, prices, speakers, or accessibility information.
- Do not require a destructive migration for historical records.
- Do not add Firestore indexes until the final related-event query shape is known and documented.
