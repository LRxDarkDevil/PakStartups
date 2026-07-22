"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/context/AuthContext";
import { isRegionId, REGIONS, type RegionId } from "@/lib/location";
import {
  proposeEvent,
  type EventBookingMode,
  type EventPriceType,
  type EventType,
} from "@/lib/services/events";

type EventForm = {
  title: string;
  desc: string;
  type: EventType;
  location: string;
  city: string;
  regionId: "" | RegionId;
  startsAt: string;
  timezone: string;
  isOnline: boolean;
  agenda: string;
  speakers: string;
  capacity: string;
  priceType: EventPriceType;
  priceAmount: string;
  registrationDeadline: string;
  accessibilityDetails: string;
  bookingMode: EventBookingMode;
  bookingUrl: string;
  onlineAccessPolicy: string;
};

const EVENT_TYPES: EventType[] = ["MEETUP", "WORKSHOP", "TALK", "CONFERENCE", "PITCHING", "DEMO"];

const INITIAL_FORM: EventForm = {
  title: "",
  desc: "",
  type: "MEETUP",
  location: "",
  city: "",
  regionId: "remote-online",
  startsAt: "",
  timezone: "Asia/Karachi",
  isOnline: true,
  agenda: "",
  speakers: "",
  capacity: "",
  priceType: "free",
  priceAmount: "",
  registrationDeadline: "",
  accessibilityDetails: "",
  bookingMode: "internal-rsvp",
  bookingUrl: "",
  onlineAccessPolicy: "Access details will be shared with confirmed attendees.",
};

function toTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProposeEventPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [form, setForm] = useState<EventForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    const regionId = form.isOnline ? "remote-online" : form.regionId;
    const dateTs = toTimestamp(form.startsAt);
    const registrationDeadlineTs = form.registrationDeadline ? toTimestamp(form.registrationDeadline) : null;
    const capacity = form.capacity ? Number(form.capacity) : undefined;
    const priceAmount = form.priceAmount ? Number(form.priceAmount) : undefined;

    if (!isRegionId(regionId)) {
      setError("Select a region for this event.");
      return;
    }
    if (!dateTs) {
      setError("Choose a valid event date and time.");
      return;
    }
    if (registrationDeadlineTs && registrationDeadlineTs.toMillis() > dateTs.toMillis()) {
      setError("Registration must close before the event starts.");
      return;
    }
    if (capacity !== undefined && (!Number.isInteger(capacity) || capacity < 1)) {
      setError("Capacity must be a whole number greater than zero.");
      return;
    }
    if (form.priceType === "paid" && (!priceAmount || priceAmount <= 0)) {
      setError("Enter a valid ticket price for a paid event.");
      return;
    }
    if (form.bookingMode === "external-booking" && !isHttpsUrl(form.bookingUrl.trim())) {
      setError("External booking requires a valid HTTPS URL.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await proposeEvent({
        title: form.title.trim(),
        desc: form.desc.trim(),
        type: form.type,
        location: form.location.trim(),
        city: form.city.trim() || undefined,
        regionId,
        isOnline: form.isOnline,
        organizerId: user.uid,
        organizerName: profile?.fullName || user.displayName || user.email || "Organizer",
        dateTs,
        dateLabel: new Date(form.startsAt).toLocaleString("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: form.timezone,
        }),
        timezone: form.timezone,
        agenda: form.agenda.split("\n").map((item) => item.trim()).filter(Boolean),
        speakers: form.speakers.split("\n").map((name) => ({ name: name.trim() })).filter((speaker) => speaker.name),
        capacity,
        priceType: form.priceType,
        priceAmount: form.priceType === "paid" ? priceAmount : undefined,
        currency: form.priceType === "paid" ? "PKR" : undefined,
        registrationDeadlineTs,
        accessibilityDetails: form.accessibilityDetails.trim() || undefined,
        bookingMode: form.bookingMode,
        bookingUrl: form.bookingMode === "external-booking" ? form.bookingUrl.trim() : undefined,
        onlineAccessPolicy: form.isOnline ? form.onlineAccessPolicy.trim() || undefined : undefined,
        updateState: "scheduled",
      });
      router.push("/events");
    } catch (submitError) {
      console.error("Failed to propose event:", submitError);
      setError("We could not submit the event. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <Link href="/events" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">
        ← Back to Events
      </Link>
      <h1 className="text-4xl font-black text-[#002112] mb-3">Propose an Event</h1>
      <p className="text-[#404943] mb-8">Share enough detail for attendees and reviewers to understand the schedule, access, cost, and registration path.</p>

      <form onSubmit={submit} className="space-y-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#dbeee2]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-bold text-[#002112] mb-2">Event title</label>
            <input id="event-title" required maxLength={120} value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="event-type" className="block text-sm font-bold text-[#002112] mb-2">Event type</label>
            <select id="event-type" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as EventType }))} className="w-full px-4 py-3 border rounded-lg">
              {EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="event-description" className="block text-sm font-bold text-[#002112] mb-2">Event description</label>
          <textarea id="event-description" required minLength={20} maxLength={3000} value={form.desc} onChange={(event) => setForm((prev) => ({ ...prev, desc: event.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-start" className="block text-sm font-bold text-[#002112] mb-2">Start date and time</label>
            <input id="event-start" type="datetime-local" required value={form.startsAt} onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="event-timezone" className="block text-sm font-bold text-[#002112] mb-2">Timezone</label>
            <input id="event-timezone" required value={form.timezone} onChange={(event) => setForm((prev) => ({ ...prev, timezone: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="Asia/Karachi" />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm font-bold text-[#002112]">
          <input type="checkbox" checked={form.isOnline} onChange={(event) => setForm((prev) => ({ ...prev, isOnline: event.target.checked, regionId: event.target.checked ? "remote-online" : "" }))} />
          This is an online event
        </label>

        <div>
          <label htmlFor="event-region" className="block text-sm font-bold text-[#002112] mb-2">Region</label>
          <select id="event-region" required={!form.isOnline} disabled={form.isOnline} value={form.isOnline ? "remote-online" : form.regionId} onChange={(event) => setForm((prev) => ({ ...prev, regionId: event.target.value as EventForm["regionId"] }))} className="w-full px-4 py-3 border rounded-lg disabled:bg-[#f3f6f4]">
            {!form.isOnline && <option value="">Select a region</option>}
            {REGIONS.map((region) => <option key={region.id} value={region.id}>{region.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-city" className="block text-sm font-bold text-[#002112] mb-2">City (optional)</label>
            <input id="event-city" value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder="e.g. Lahore" />
          </div>
          <div>
            <label htmlFor="event-location" className="block text-sm font-bold text-[#002112] mb-2">Venue or access destination</label>
            <input id="event-location" required value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" placeholder={form.isOnline ? "Online event" : "Venue name and area"} />
          </div>
        </div>

        {form.isOnline && (
          <div>
            <label htmlFor="event-access-policy" className="block text-sm font-bold text-[#002112] mb-2">Online access policy</label>
            <textarea id="event-access-policy" value={form.onlineAccessPolicy} onChange={(event) => setForm((prev) => ({ ...prev, onlineAccessPolicy: event.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-24" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-agenda" className="block text-sm font-bold text-[#002112] mb-2">Agenda (one item per line)</label>
            <textarea id="event-agenda" value={form.agenda} onChange={(event) => setForm((prev) => ({ ...prev, agenda: event.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-32" />
          </div>
          <div>
            <label htmlFor="event-speakers" className="block text-sm font-bold text-[#002112] mb-2">Speakers (one name per line)</label>
            <textarea id="event-speakers" value={form.speakers} onChange={(event) => setForm((prev) => ({ ...prev, speakers: event.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="event-capacity" className="block text-sm font-bold text-[#002112] mb-2">Capacity (optional)</label>
            <input id="event-capacity" type="number" min="1" step="1" value={form.capacity} onChange={(event) => setForm((prev) => ({ ...prev, capacity: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="event-price-type" className="block text-sm font-bold text-[#002112] mb-2">Price</label>
            <select id="event-price-type" value={form.priceType} onChange={(event) => setForm((prev) => ({ ...prev, priceType: event.target.value as EventPriceType, priceAmount: event.target.value === "free" ? "" : prev.priceAmount }))} className="w-full px-4 py-3 border rounded-lg">
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label htmlFor="event-price" className="block text-sm font-bold text-[#002112] mb-2">Price in PKR</label>
            <input id="event-price" type="number" min="1" disabled={form.priceType === "free"} required={form.priceType === "paid"} value={form.priceAmount} onChange={(event) => setForm((prev) => ({ ...prev, priceAmount: event.target.value }))} className="w-full px-4 py-3 border rounded-lg disabled:bg-[#f3f6f4]" />
          </div>
        </div>

        <div>
          <label htmlFor="event-registration-deadline" className="block text-sm font-bold text-[#002112] mb-2">Registration deadline (optional)</label>
          <input id="event-registration-deadline" type="datetime-local" value={form.registrationDeadline} onChange={(event) => setForm((prev) => ({ ...prev, registrationDeadline: event.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-booking-mode" className="block text-sm font-bold text-[#002112] mb-2">Registration method</label>
            <select id="event-booking-mode" value={form.bookingMode} onChange={(event) => setForm((prev) => ({ ...prev, bookingMode: event.target.value as EventBookingMode, bookingUrl: event.target.value === "internal-rsvp" ? "" : prev.bookingUrl }))} className="w-full px-4 py-3 border rounded-lg">
              <option value="internal-rsvp">RSVP on PakStartups</option>
              <option value="external-booking">Book on organizer website</option>
            </select>
          </div>
          <div>
            <label htmlFor="event-booking-url" className="block text-sm font-bold text-[#002112] mb-2">External booking URL</label>
            <input id="event-booking-url" type="url" disabled={form.bookingMode === "internal-rsvp"} required={form.bookingMode === "external-booking"} value={form.bookingUrl} onChange={(event) => setForm((prev) => ({ ...prev, bookingUrl: event.target.value }))} className="w-full px-4 py-3 border rounded-lg disabled:bg-[#f3f6f4]" placeholder="https://" />
          </div>
        </div>

        <div>
          <label htmlFor="event-accessibility" className="block text-sm font-bold text-[#002112] mb-2">Accessibility details (optional)</label>
          <textarea id="event-accessibility" value={form.accessibilityDetails} onChange={(event) => setForm((prev) => ({ ...prev, accessibilityDetails: event.target.value }))} className="w-full px-4 py-3 border rounded-lg min-h-24" placeholder="Wheelchair access, captioning, language, dietary or accommodation notes" />
        </div>

        {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit Event"}
        </button>
      </form>
    </main>
  );
}
