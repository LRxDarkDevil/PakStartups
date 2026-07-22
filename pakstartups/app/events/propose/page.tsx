"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/context/AuthContext";
import { isRegionId, REGIONS, type RegionId } from "@/lib/location";
import { zonedDateTimeToDate } from "@/lib/events/presentation";
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
  location: "Online event",
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
    const startDate = zonedDateTimeToDate(form.startsAt, form.timezone);
    const registrationDeadline = form.registrationDeadline
      ? zonedDateTimeToDate(form.registrationDeadline, form.timezone)
      : null;
    const capacity = form.capacity ? Number(form.capacity) : undefined;
    const priceAmount = form.priceAmount ? Number(form.priceAmount) : undefined;

    if (!isRegionId(regionId)) {
      setError("Select a region for this event.");
      return;
    }
    if (!startDate) {
      setError("Choose a valid event date, time, and IANA timezone such as Asia/Karachi.");
      return;
    }
    if (form.registrationDeadline && !registrationDeadline) {
      setError("Choose a valid registration deadline in the selected timezone.");
      return;
    }
    if (registrationDeadline && registrationDeadline.getTime() > startDate.getTime()) {
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
        title: form.title,
        desc: form.desc,
        type: form.type,
        location: form.location,
        city: form.city || undefined,
        regionId,
        isOnline: form.isOnline,
        organizerId: user.uid,
        organizerName: profile?.fullName || user.displayName || user.email || "Organizer",
        dateTs: Timestamp.fromDate(startDate),
        dateLabel: new Intl.DateTimeFormat("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: form.timezone,
        }).format(startDate),
        timezone: form.timezone,
        agenda: form.agenda.split("\n").map((item) => item.trim()).filter(Boolean),
        speakers: form.speakers.split("\n").map((name) => ({ name: name.trim() })).filter((speaker) => speaker.name),
        capacity,
        priceType: form.priceType,
        priceAmount: form.priceType === "paid" ? priceAmount : undefined,
        currency: form.priceType === "paid" ? "PKR" : undefined,
        registrationDeadlineTs: registrationDeadline ? Timestamp.fromDate(registrationDeadline) : null,
        accessibilityDetails: form.accessibilityDetails || undefined,
        bookingMode: form.bookingMode,
        bookingUrl: form.bookingMode === "external-booking" ? form.bookingUrl : undefined,
        onlineAccessPolicy: form.isOnline ? form.onlineAccessPolicy || undefined : undefined,
        updateState: "scheduled",
      });
      router.push("/events");
    } catch (submitError) {
      console.error("Failed to propose event:", submitError);
      setError(submitError instanceof Error ? submitError.message : "We could not submit the event. Please try again.");
      setSubmitting(false);
    }
  };

  const fieldClass = "w-full rounded-lg border border-[#bfc9c1] px-4 py-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:bg-[#f3f6f4]";

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <Link href="/events" className="mb-6 inline-flex min-h-11 items-center rounded-md text-sm font-bold text-[#0f5238] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]">← Back to Events</Link>
      <h1 className="text-4xl font-black text-[#002112]">Propose an Event</h1>
      <p className="mb-8 mt-3 text-[#404943]">Share enough detail for attendees and reviewers to understand the schedule, access, cost, and registration path.</p>

      <form onSubmit={submit} aria-describedby={error ? "event-form-error" : undefined} className="space-y-6 rounded-2xl border border-[#dbeee2] bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-[#002112]">Event title<input required minLength={5} maxLength={200} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
          <label className="text-sm font-bold text-[#002112]">Event type<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as EventType }))} className={`${fieldClass} mt-2`}>{EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        </div>

        <label className="block text-sm font-bold text-[#002112]">Event description<textarea required minLength={20} maxLength={3000} value={form.desc} onChange={(event) => setForm((current) => ({ ...current, desc: event.target.value }))} className={`${fieldClass} mt-2 min-h-40`} /></label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-[#002112]">Start date and time<input type="datetime-local" required value={form.startsAt} onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
          <label className="text-sm font-bold text-[#002112]">IANA timezone<input required value={form.timezone} onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))} className={`${fieldClass} mt-2`} placeholder="Asia/Karachi" /></label>
        </div>

        <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-[#002112]"><input type="checkbox" checked={form.isOnline} onChange={(event) => setForm((current) => ({ ...current, isOnline: event.target.checked, regionId: event.target.checked ? "remote-online" : "", location: event.target.checked && !current.location ? "Online event" : current.location }))} />This is an online event</label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="text-sm font-bold text-[#002112]">Region<select required={!form.isOnline} disabled={form.isOnline} value={form.isOnline ? "remote-online" : form.regionId} onChange={(event) => setForm((current) => ({ ...current, regionId: event.target.value as EventForm["regionId"] }))} className={`${fieldClass} mt-2`}><option value="">Select a region</option>{REGIONS.map((region) => <option key={region.id} value={region.id}>{region.label}</option>)}</select></label>
          <label className="text-sm font-bold text-[#002112]">City (optional)<input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className={`${fieldClass} mt-2`} placeholder="Lahore" /></label>
          <label className="text-sm font-bold text-[#002112]">Venue or access destination<input required value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
        </div>

        {form.isOnline && <label className="block text-sm font-bold text-[#002112]">Online access policy<textarea value={form.onlineAccessPolicy} onChange={(event) => setForm((current) => ({ ...current, onlineAccessPolicy: event.target.value }))} className={`${fieldClass} mt-2 min-h-24`} /></label>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-[#002112]">Agenda, one item per line<textarea value={form.agenda} onChange={(event) => setForm((current) => ({ ...current, agenda: event.target.value }))} className={`${fieldClass} mt-2 min-h-32`} /></label>
          <label className="text-sm font-bold text-[#002112]">Speakers, one name per line<textarea value={form.speakers} onChange={(event) => setForm((current) => ({ ...current, speakers: event.target.value }))} className={`${fieldClass} mt-2 min-h-32`} /></label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <label className="text-sm font-bold text-[#002112]">Capacity<input type="number" min="1" step="1" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
          <label className="text-sm font-bold text-[#002112]">Price type<select value={form.priceType} onChange={(event) => setForm((current) => ({ ...current, priceType: event.target.value as EventPriceType, priceAmount: event.target.value === "free" ? "" : current.priceAmount }))} className={`${fieldClass} mt-2`}><option value="free">Free</option><option value="paid">Paid</option></select></label>
          <label className="text-sm font-bold text-[#002112]">Price in PKR<input type="number" min="1" disabled={form.priceType === "free"} required={form.priceType === "paid"} value={form.priceAmount} onChange={(event) => setForm((current) => ({ ...current, priceAmount: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
          <label className="text-sm font-bold text-[#002112]">Registration deadline<input type="datetime-local" value={form.registrationDeadline} onChange={(event) => setForm((current) => ({ ...current, registrationDeadline: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-[#002112]">Registration method<select value={form.bookingMode} onChange={(event) => setForm((current) => ({ ...current, bookingMode: event.target.value as EventBookingMode, bookingUrl: event.target.value === "internal-rsvp" ? "" : current.bookingUrl }))} className={`${fieldClass} mt-2`}><option value="internal-rsvp">RSVP on PakStartups</option><option value="external-booking">Book on organizer website</option></select></label>
          <label className="text-sm font-bold text-[#002112]">External HTTPS booking URL<input type="url" disabled={form.bookingMode === "internal-rsvp"} required={form.bookingMode === "external-booking"} value={form.bookingUrl} onChange={(event) => setForm((current) => ({ ...current, bookingUrl: event.target.value }))} className={`${fieldClass} mt-2`} placeholder="https://" /></label>
        </div>

        <label className="block text-sm font-bold text-[#002112]">Accessibility details<textarea value={form.accessibilityDetails} onChange={(event) => setForm((current) => ({ ...current, accessibilityDetails: event.target.value }))} className={`${fieldClass} mt-2 min-h-24`} placeholder="Wheelchair access, captioning, language, dietary or accommodation notes" /></label>

        {error && <p id="event-form-error" role="alert" className="text-sm font-bold text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="min-h-12 rounded-lg bg-[#0f5238] px-6 py-3 font-bold text-white transition hover:bg-[#0b422d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:opacity-60 motion-reduce:transition-none">{submitting ? "Submitting…" : "Submit Event"}</button>
      </form>
    </div>
  );
}
