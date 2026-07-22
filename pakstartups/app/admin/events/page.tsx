"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { isRegionId, REGIONS, type RegionId } from "@/lib/location";
import {
  createEventByAdmin,
  getEventById,
  updateEventByAdmin,
  type EventBookingMode,
  type EventItem as FullEventItem,
  type EventPriceType,
  type EventType,
  type EventUpdateState,
} from "@/lib/services/events";
import { formatDateTimeLocal, zonedDateTimeToDate } from "@/lib/events/presentation";

type EventListItem = {
  id: string;
  title: string;
  organizerName: string;
  type: string;
  status: string;
  updateState?: EventUpdateState;
  isFeatured: boolean;
  dateLabel: string;
  createdAt: { toDate?: () => Date; toMillis?: () => number } | string | null;
};

type EditorForm = {
  title: string;
  desc: string;
  organizerName: string;
  type: EventType;
  startsAt: string;
  timezone: string;
  isOnline: boolean;
  regionId: "" | RegionId;
  city: string;
  location: string;
  onlineAccessPolicy: string;
  agenda: string;
  speakers: string;
  capacity: string;
  priceType: EventPriceType;
  priceAmount: string;
  registrationDeadline: string;
  bookingMode: EventBookingMode;
  bookingUrl: string;
  accessibilityDetails: string;
  updateState: EventUpdateState;
  updateMessage: string;
};

const EVENT_TYPES: EventType[] = ["MEETUP", "WORKSHOP", "TALK", "CONFERENCE", "PITCHING", "DEMO"];
const UPDATE_STATES: EventUpdateState[] = ["scheduled", "updated", "postponed", "cancelled"];

function emptyEditor(organizerName = ""): EditorForm {
  return {
    title: "",
    desc: "",
    organizerName,
    type: "MEETUP",
    startsAt: "",
    timezone: "Asia/Karachi",
    isOnline: true,
    regionId: "remote-online",
    city: "",
    location: "Online event",
    onlineAccessPolicy: "Access details will be shared with confirmed attendees.",
    agenda: "",
    speakers: "",
    capacity: "",
    priceType: "free",
    priceAmount: "",
    registrationDeadline: "",
    bookingMode: "internal-rsvp",
    bookingUrl: "",
    accessibilityDetails: "",
    updateState: "scheduled",
    updateMessage: "",
  };
}

function eventToEditor(event: FullEventItem): EditorForm {
  const timezone = event.timezone || "Asia/Karachi";
  return {
    title: event.title,
    desc: event.desc,
    organizerName: event.organizerName,
    type: event.type,
    startsAt: event.dateTs ? formatDateTimeLocal(event.dateTs.toDate(), timezone) : "",
    timezone,
    isOnline: event.isOnline,
    regionId: event.regionId ?? (event.isOnline ? "remote-online" : ""),
    city: event.city || "",
    location: event.location || "",
    onlineAccessPolicy: event.onlineAccessPolicy || "",
    agenda: event.agenda?.join("\n") || "",
    speakers: event.speakers?.map((speaker) => [speaker.name, speaker.role, speaker.organization].filter(Boolean).join(" | ")).join("\n") || "",
    capacity: event.capacity ? String(event.capacity) : "",
    priceType: event.priceType ?? "free",
    priceAmount: event.priceAmount ? String(event.priceAmount) : "",
    registrationDeadline: event.registrationDeadlineTs ? formatDateTimeLocal(event.registrationDeadlineTs.toDate(), timezone) : "",
    bookingMode: event.bookingMode ?? "internal-rsvp",
    bookingUrl: event.bookingUrl || "",
    accessibilityDetails: event.accessibilityDetails || "",
    updateState: event.updateState ?? "scheduled",
    updateMessage: event.updateMessage || "",
  };
}

function formatCreatedAt(ts: EventListItem["createdAt"]) {
  if (!ts) return "–";
  const date = typeof ts === "string" ? new Date(ts) : ts.toDate?.();
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
    : "–";
}

function parseSpeakers(value: string) {
  return value.split("\n").map((line) => {
    const [name = "", role = "", organization = ""] = line.split("|").map((part) => part.trim());
    return { name, role: role || undefined, organization: organization || undefined };
  }).filter((speaker) => speaker.name);
}

export default function AdminEventsPage() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditorForm>(() => emptyEditor());
  const [editorBusy, setEditorBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    const eventsQuery = tab === "all"
      ? query(collection(db, "events"), limit(50))
      : query(collection(db, "events"), where("status", "==", tab), limit(50));
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const all = snapshot.docs.map((eventDoc) => ({ id: eventDoc.id, ...eventDoc.data() }) as EventListItem);
      all.sort((left, right) => {
        const leftMs = typeof left.createdAt === "object" ? left.createdAt?.toMillis?.() ?? 0 : 0;
        const rightMs = typeof right.createdAt === "object" ? right.createdAt?.toMillis?.() ?? 0 : 0;
        return rightMs - leftMs;
      });
      setEvents(all);
      setLoading(false);
    }, () => {
      setMessage("Events could not be loaded. Check your admin access and try again.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tab]);

  const markUpdating = (id: string, active: boolean) => {
    setUpdating((current) => {
      const next = new Set(current);
      if (active) next.add(id); else next.delete(id);
      return next;
    });
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    markUpdating(id, true);
    setMessage("");
    try {
      await updateDoc(doc(db, "events", id), { status, updatedAt: serverTimestamp() });
      setMessage(`Event ${status}.`);
    } catch {
      setMessage(`The event could not be ${status}.`);
    } finally {
      markUpdating(id, false);
    }
  };

  const handlePin = async (id: string, currentlyFeatured: boolean) => {
    markUpdating(id, true);
    setMessage("");
    try {
      if (!currentlyFeatured) {
        const featuredSnapshot = await getDocs(query(collection(db, "events"), where("isFeatured", "==", true), limit(10)));
        await Promise.all(featuredSnapshot.docs.map((eventDoc) => updateDoc(eventDoc.ref, { isFeatured: false })));
      }
      await updateDoc(doc(db, "events", id), { isFeatured: !currentlyFeatured, updatedAt: serverTimestamp() });
      setMessage(currentlyFeatured ? "Event removed from featured." : "Event featured.");
    } catch {
      setMessage("The featured state could not be updated.");
    } finally {
      markUpdating(id, false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyEditor(profile?.fullName || user?.displayName || user?.email || "PakStartups organizer"));
    setMessage("");
    setEditorOpen(true);
  };

  const openEdit = async (id: string) => {
    markUpdating(id, true);
    setMessage("");
    try {
      const event = await getEventById(id);
      if (!event) throw new Error("Event not found");
      setEditingId(id);
      setForm(eventToEditor(event));
      setEditorOpen(true);
    } catch {
      setMessage("The event could not be opened for editing.");
    } finally {
      markUpdating(id, false);
    }
  };

  const saveEditor = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setMessage("");

    const regionId = form.isOnline ? "remote-online" : form.regionId;
    if (!isRegionId(regionId)) {
      setMessage("Select a canonical region.");
      return;
    }
    const startDate = zonedDateTimeToDate(form.startsAt, form.timezone);
    const deadlineDate = form.registrationDeadline
      ? zonedDateTimeToDate(form.registrationDeadline, form.timezone)
      : null;
    if (!startDate) {
      setMessage("Enter a valid date, time, and IANA timezone such as Asia/Karachi.");
      return;
    }
    if (form.registrationDeadline && !deadlineDate) {
      setMessage("Enter a valid registration deadline in the selected timezone.");
      return;
    }

    const dateTs = Timestamp.fromDate(startDate);
    const capacity = form.capacity ? Number(form.capacity) : undefined;
    const priceAmount = form.priceAmount ? Number(form.priceAmount) : undefined;
    const payload = {
      title: form.title,
      desc: form.desc,
      organizerName: form.organizerName,
      type: form.type,
      location: form.location,
      city: form.city || undefined,
      regionId,
      isOnline: form.isOnline,
      dateTs,
      dateLabel: new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: form.timezone }).format(startDate),
      timezone: form.timezone,
      agenda: form.agenda.split("\n").map((item) => item.trim()).filter(Boolean),
      speakers: parseSpeakers(form.speakers),
      capacity,
      priceType: form.priceType,
      priceAmount: form.priceType === "paid" ? priceAmount : undefined,
      currency: form.priceType === "paid" ? "PKR" : undefined,
      registrationDeadlineTs: deadlineDate ? Timestamp.fromDate(deadlineDate) : null,
      accessibilityDetails: form.accessibilityDetails || undefined,
      updateState: form.updateState,
      updateMessage: form.updateMessage || undefined,
      bookingMode: form.bookingMode,
      bookingUrl: form.bookingMode === "external-booking" ? form.bookingUrl : undefined,
      onlineAccessPolicy: form.isOnline ? form.onlineAccessPolicy || undefined : undefined,
    };

    setEditorBusy(true);
    try {
      if (editingId) {
        await updateEventByAdmin(editingId, payload);
        setMessage("Event details saved.");
      } else {
        if (!user) throw new Error("Sign in again to create an event.");
        await createEventByAdmin(payload, user.uid);
        setMessage("Event created in Pending Review.");
      }
      setEditorOpen(false);
      setEditingId(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The event could not be saved.");
    } finally {
      setEditorBusy(false);
    }
  };

  const fieldClass = "w-full rounded-lg border border-[#bfc9c1] bg-white px-4 py-3 text-[#002112] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:bg-[#f3f6f4]";

  return (
    <div className="space-y-8 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#002112]">Events Management</h2>
          <p className="mt-1 font-medium text-[#404943]">Create, review, edit, approve, and feature community event submissions.</p>
        </div>
        <button type="button" onClick={openCreate} className="min-h-11 rounded-lg bg-[#0f5238] px-5 py-3 font-bold text-white transition hover:bg-[#0b422d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] motion-reduce:transition-none">Create event</button>
      </div>

      {message && <p role="status" className="rounded-xl border border-[#dbeee2] bg-white p-4 font-semibold text-[#0f5238]">{message}</p>}

      {editorOpen && (
        <section aria-labelledby="event-editor-heading" className="rounded-2xl border border-[#b7cbbd] bg-[#f9fcfa] p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#0f5238]">{editingId ? "Edit event" : "New event"}</p>
              <h3 id="event-editor-heading" className="mt-1 text-2xl font-black text-[#002112]">Expanded event details</h3>
            </div>
            <button type="button" onClick={() => setEditorOpen(false)} className="min-h-11 rounded-lg px-3 font-bold text-[#0f5238] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]">Close</button>
          </div>

          <form onSubmit={saveEditor} className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-[#002112]">Title<input required minLength={5} maxLength={200} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
              <label className="text-sm font-bold text-[#002112]">Organizer name<input required value={form.organizerName} onChange={(event) => setForm((current) => ({ ...current, organizerName: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
            </div>
            <label className="block text-sm font-bold text-[#002112]">Description<textarea required minLength={20} maxLength={3000} value={form.desc} onChange={(event) => setForm((current) => ({ ...current, desc: event.target.value }))} className={`${fieldClass} mt-2 min-h-32`} /></label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm font-bold text-[#002112]">Type<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as EventType }))} className={`${fieldClass} mt-2`}>{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label className="text-sm font-bold text-[#002112]">Start date and time<input type="datetime-local" required value={form.startsAt} onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
              <label className="text-sm font-bold text-[#002112]">IANA timezone<input required value={form.timezone} onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))} className={`${fieldClass} mt-2`} placeholder="Asia/Karachi" /></label>
            </div>

            <label className="flex min-h-11 items-center gap-3 font-bold text-[#002112]"><input type="checkbox" checked={form.isOnline} onChange={(event) => setForm((current) => ({ ...current, isOnline: event.target.checked, regionId: event.target.checked ? "remote-online" : "", location: event.target.checked && !current.location ? "Online event" : current.location }))} /> Online event</label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm font-bold text-[#002112]">Region<select required={!form.isOnline} disabled={form.isOnline} value={form.isOnline ? "remote-online" : form.regionId} onChange={(event) => setForm((current) => ({ ...current, regionId: event.target.value as EditorForm["regionId"] }))} className={`${fieldClass} mt-2`}><option value="">Select region</option>{REGIONS.map((region) => <option key={region.id} value={region.id}>{region.label}</option>)}</select></label>
              <label className="text-sm font-bold text-[#002112]">City<input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
              <label className="text-sm font-bold text-[#002112]">Venue or access destination<input required value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
            </div>

            {form.isOnline && <label className="block text-sm font-bold text-[#002112]">Online access policy<textarea value={form.onlineAccessPolicy} onChange={(event) => setForm((current) => ({ ...current, onlineAccessPolicy: event.target.value }))} className={`${fieldClass} mt-2 min-h-24`} /></label>}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-[#002112]">Agenda, one item per line<textarea value={form.agenda} onChange={(event) => setForm((current) => ({ ...current, agenda: event.target.value }))} className={`${fieldClass} mt-2 min-h-32`} /></label>
              <label className="text-sm font-bold text-[#002112]">Speakers, one per line: Name | Role | Organization<textarea value={form.speakers} onChange={(event) => setForm((current) => ({ ...current, speakers: event.target.value }))} className={`${fieldClass} mt-2 min-h-32`} /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label className="text-sm font-bold text-[#002112]">Capacity<input type="number" min="1" step="1" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
              <label className="text-sm font-bold text-[#002112]">Price type<select value={form.priceType} onChange={(event) => setForm((current) => ({ ...current, priceType: event.target.value as EventPriceType, priceAmount: event.target.value === "free" ? "" : current.priceAmount }))} className={`${fieldClass} mt-2`}><option value="free">Free</option><option value="paid">Paid</option></select></label>
              <label className="text-sm font-bold text-[#002112]">Price in PKR<input type="number" min="1" disabled={form.priceType === "free"} required={form.priceType === "paid"} value={form.priceAmount} onChange={(event) => setForm((current) => ({ ...current, priceAmount: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
              <label className="text-sm font-bold text-[#002112]">Registration deadline<input type="datetime-local" value={form.registrationDeadline} onChange={(event) => setForm((current) => ({ ...current, registrationDeadline: event.target.value }))} className={`${fieldClass} mt-2`} /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-[#002112]">Registration method<select value={form.bookingMode} onChange={(event) => setForm((current) => ({ ...current, bookingMode: event.target.value as EventBookingMode, bookingUrl: event.target.value === "internal-rsvp" ? "" : current.bookingUrl }))} className={`${fieldClass} mt-2`}><option value="internal-rsvp">PakStartups RSVP</option><option value="external-booking">External organizer booking</option></select></label>
              <label className="text-sm font-bold text-[#002112]">External HTTPS booking URL<input type="url" disabled={form.bookingMode === "internal-rsvp"} required={form.bookingMode === "external-booking"} value={form.bookingUrl} onChange={(event) => setForm((current) => ({ ...current, bookingUrl: event.target.value }))} className={`${fieldClass} mt-2`} placeholder="https://" /></label>
            </div>

            <label className="block text-sm font-bold text-[#002112]">Accessibility details<textarea value={form.accessibilityDetails} onChange={(event) => setForm((current) => ({ ...current, accessibilityDetails: event.target.value }))} className={`${fieldClass} mt-2 min-h-24`} /></label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-[#002112]">Lifecycle state<select value={form.updateState} onChange={(event) => setForm((current) => ({ ...current, updateState: event.target.value as EventUpdateState }))} className={`${fieldClass} mt-2`}>{UPDATE_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
              <label className="text-sm font-bold text-[#002112]">Public update or cancellation message<textarea value={form.updateMessage} onChange={(event) => setForm((current) => ({ ...current, updateMessage: event.target.value }))} className={`${fieldClass} mt-2 min-h-24`} /></label>
            </div>

            <button type="submit" disabled={editorBusy} className="min-h-12 rounded-lg bg-[#0f5238] px-6 py-3 font-bold text-white transition hover:bg-[#0b422d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:opacity-60 motion-reduce:transition-none">{editorBusy ? "Saving…" : editingId ? "Save event" : "Create pending event"}</button>
          </form>
        </section>
      )}

      <div className="flex gap-4 overflow-x-auto border-b border-[#e0e0e0]" role="tablist" aria-label="Event status filters">
        {(["pending", "approved", "all"] as const).map((statusTab) => (
          <button key={statusTab} type="button" role="tab" aria-selected={tab === statusTab} onClick={() => setTab(statusTab)} className={`min-h-11 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-bold capitalize transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] motion-reduce:transition-none ${tab === statusTab ? "border-[#0f5238] text-[#0f5238]" : "border-transparent text-[#404943] hover:text-[#0f5238]"}`}>{statusTab === "all" ? "All events" : statusTab === "pending" ? "Pending review" : "Approved"}</button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#bfc9c1]/20 bg-white">
        {loading ? (
          <div className="p-12 text-center" aria-busy="true"><span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f5238]/20 border-t-[#0f5238] motion-reduce:animate-none" /><span className="sr-only">Loading events</span></div>
        ) : events.length === 0 ? (
          <div className="p-16 text-center"><span className="material-symbols-outlined text-5xl text-[#bfc9c1]" aria-hidden="true">event</span><p className="mt-2 text-[#404943]">No {tab} events found.</p></div>
        ) : (
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="border-b border-[#bfc9c1]/20 bg-[#f5fbf7]"><tr>{["Title", "Organizer", "Type", "When", "State", "Status", "Actions"].map((heading) => <th key={heading} scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#bfc9c1]/20">
              {events.map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-[#f5fbf7] motion-reduce:transition-none">
                  <td className="max-w-[260px] px-6 py-4"><div className="flex items-center gap-2">{event.isFeatured && <span title="Featured" className="material-symbols-outlined text-sm text-[#f59e0b]" aria-label="Featured">push_pin</span>}<span className="truncate font-bold text-[#002112]">{event.title}</span></div></td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{event.organizerName}</td>
                  <td className="px-6 py-4"><span className="rounded bg-[#b4ef9d]/30 px-2 py-0.5 text-xs font-bold text-[#0e5138]">{event.type}</span></td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{event.dateLabel || formatCreatedAt(event.createdAt)}</td>
                  <td className="px-6 py-4 text-sm capitalize text-[#404943]">{event.updateState || "scheduled"}</td>
                  <td className="px-6 py-4"><span className={`rounded px-2 py-0.5 text-xs font-bold capitalize ${event.status === "approved" ? "bg-[#c4ecd2] text-[#0f5238]" : event.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-700"}`}>{event.status}</span></td>
                  <td className="px-6 py-4"><div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void openEdit(event.id)} disabled={updating.has(event.id)} className="rounded-lg bg-[#e8f3ec] px-3 py-1.5 text-xs font-bold text-[#0f5238] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:opacity-60">Edit</button>
                    {event.status !== "approved" && <button type="button" onClick={() => void handleAction(event.id, "approved")} disabled={updating.has(event.id)} className="rounded-lg bg-[#0f5238] px-3 py-1.5 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:opacity-60">Approve</button>}
                    {event.status === "approved" && <button type="button" onClick={() => void handlePin(event.id, event.isFeatured)} disabled={updating.has(event.id)} className={`rounded-lg px-3 py-1.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a] disabled:opacity-60 ${event.isFeatured ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#e0f2fe] text-[#075985]"}`}>{event.isFeatured ? "Unpin" : "Feature"}</button>}
                    {event.status !== "rejected" && <button type="button" onClick={() => void handleAction(event.id, "rejected")} disabled={updating.has(event.id)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:opacity-60">Reject</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
