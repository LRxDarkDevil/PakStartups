"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/context/AuthContext";
import { isRegionId, REGIONS, type RegionId } from "@/lib/location";
import { proposeEvent } from "@/lib/services/events";

type EventForm = {
  title: string;
  desc: string;
  location: string;
  city: string;
  regionId: "" | RegionId;
  dateLabel: string;
  isOnline: boolean;
};

const INITIAL_FORM: EventForm = {
  title: "",
  desc: "",
  location: "",
  city: "",
  regionId: "remote-online",
  dateLabel: "",
  isOnline: true,
};

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
    if (!isRegionId(regionId)) {
      setError("Select a region for this event.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await proposeEvent({
        title: form.title.trim(),
        desc: form.desc.trim(),
        type: "MEETUP",
        location: form.location.trim(),
        city: form.city.trim() || undefined,
        regionId,
        isOnline: form.isOnline,
        organizerId: user.uid,
        organizerName: profile?.fullName || user.displayName || user.email || "Organizer",
        dateTs: Timestamp.fromDate(new Date()),
        dateLabel: form.dateLabel.trim(),
      });
      router.push("/events");
    } catch (submitError) {
      console.error("Failed to propose event:", submitError);
      setError("We could not submit the event. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/events" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">
        ← Back to Events
      </Link>
      <h1 className="text-4xl font-black text-[#002112] mb-6">Propose an Event</h1>
      <form onSubmit={submit} className="space-y-5 bg-white rounded-2xl p-8 border border-[#dbeee2]">
        <div>
          <label htmlFor="event-title" className="block text-sm font-bold text-[#002112] mb-2">Event title</label>
          <input
            id="event-title"
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="event-description" className="block text-sm font-bold text-[#002112] mb-2">Event description</label>
          <textarea
            id="event-description"
            required
            minLength={10}
            value={form.desc}
            onChange={(event) => setForm((prev) => ({ ...prev, desc: event.target.value }))}
            className="w-full px-4 py-3 border rounded-lg min-h-40"
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-bold text-[#002112]">
          <input
            type="checkbox"
            checked={form.isOnline}
            onChange={(event) => setForm((prev) => ({
              ...prev,
              isOnline: event.target.checked,
              regionId: event.target.checked ? "remote-online" : "",
            }))}
          />
          This is an online event
        </label>

        <div>
          <label htmlFor="event-region" className="block text-sm font-bold text-[#002112] mb-2">Region</label>
          <select
            id="event-region"
            required={!form.isOnline}
            disabled={form.isOnline}
            value={form.isOnline ? "remote-online" : form.regionId}
            onChange={(event) => setForm((prev) => ({ ...prev, regionId: event.target.value as EventForm["regionId"] }))}
            className="w-full px-4 py-3 border rounded-lg disabled:bg-[#f3f6f4]"
          >
            {!form.isOnline && <option value="">Select a region</option>}
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id}>{region.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-city" className="block text-sm font-bold text-[#002112] mb-2">City (optional)</label>
            <input
              id="event-city"
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="e.g. Lahore"
            />
          </div>
          <div>
            <label htmlFor="event-location" className="block text-sm font-bold text-[#002112] mb-2">Venue or meeting link</label>
            <input
              id="event-location"
              required
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label htmlFor="event-date-label" className="block text-sm font-bold text-[#002112] mb-2">Date and time label</label>
          <input
            id="event-date-label"
            required
            value={form.dateLabel}
            onChange={(event) => setForm((prev) => ({ ...prev, dateLabel: event.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Friday · 8:00 PM PKT"
          />
        </div>

        {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Event"}
        </button>
      </form>
    </main>
  );
}
