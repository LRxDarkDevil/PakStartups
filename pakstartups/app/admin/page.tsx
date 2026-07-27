"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import StartupDetailsModal, { StartupDetail } from "@/components/admin/StartupDetailsModal";

type Stat = { label: string; value: string | number; icon: string; color: string };
type AdminTab = "queue" | "manage";
type StatusFilter = "all" | "pending" | "approved" | "rejected" | "inactive";

type AdminStartup = StartupDetail & {
  updatedAt?: StartupDetail["createdAt"];
};

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Inactive", value: "inactive" },
  { label: "Rejected", value: "rejected" },
];

function timestampToMillis(ts: StartupDetail["createdAt"]) {
  if (!ts) return 0;
  const value = (ts as { toDate?: () => Date }).toDate
    ? (ts as { toDate: () => Date }).toDate()
    : new Date(ts as string);
  return Number.isNaN(value.getTime()) ? 0 : value.getTime();
}

function formatDate(ts: StartupDetail["createdAt"]) {
  if (!ts) return "–";
  const d = (ts as { toDate?: () => Date }).toDate
    ? (ts as { toDate: () => Date }).toDate()
    : new Date(ts as string);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

function statusBadge(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "inactive":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-800 border-amber-200";
  }
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminDashboardPage() {
  const [startups, setStartups] = useState<AdminStartup[]>([]);
  const [pendingEvents, setPendingEvents] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [selectedStartup, setSelectedStartup] = useState<AdminStartup | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "startups"),
      (snap) => {
        const rows = snap.docs
          .map((startupDoc) => ({ id: startupDoc.id, ...startupDoc.data() }) as AdminStartup)
          .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
        setStartups(rows);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setActionError("Could not load startups. Please refresh and try again.");
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchSupportingStats = async () => {
      try {
        const [eventsSnap, usersSnap] = await Promise.all([
          getDocs(query(collection(db, "events"), where("status", "==", "pending"))),
          getDocs(collection(db, "users")),
        ]);
        setPendingEvents(eventsSnap.size);
        setTotalUsers(usersSnap.size);
      } catch (err) {
        console.error("Could not load admin supporting stats", err);
      }
    };

    fetchSupportingStats();
  }, []);

  const queue = useMemo(
    () => startups.filter((startup) => startup.status === "pending").slice(0, 20),
    [startups],
  );

  const stats = useMemo<Stat[]>(
    () => [
      { label: "Total Startups", value: startups.length, icon: "rocket_launch", color: "bg-[#d5fde2]" },
      { label: "Pending Approval", value: startups.filter((startup) => startup.status === "pending").length, icon: "pending", color: "bg-amber-50" },
      { label: "Pending Events", value: pendingEvents, icon: "event", color: "bg-blue-50" },
      { label: "Total Users", value: totalUsers, icon: "group", color: "bg-[#e8ffee]" },
    ],
    [pendingEvents, startups, totalUsers],
  );

  const managedStartups = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return startups.filter((startup) => {
      const matchesStatus = statusFilter === "all" || startup.status === statusFilter;
      const matchesSearch = !search || [startup.name, startup.ownerName, startup.category, startup.stage]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, startups, statusFilter]);

  const visibleIds = managedStartups.map((startup) => startup.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  const setBusy = (ids: string[], busy: boolean) => {
    setUpdating((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (busy ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const clearMessages = () => {
    setActionError("");
    setNotice("");
  };

  const handleSetStatus = async (ids: string[], status: Exclude<StatusFilter, "all">) => {
    if (ids.length === 0) return;
    clearMessages();
    setBusy(ids, true);

    try {
      await Promise.all(
        ids.map((id) => updateDoc(doc(db, "startups", id), {
          status,
          updatedAt: serverTimestamp(),
          ...(status === "inactive" ? { deactivatedAt: serverTimestamp() } : { deactivatedAt: null }),
        })),
      );
      setNotice(`${ids.length} startup${ids.length === 1 ? "" : "s"} marked ${status}.`);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } catch (err) {
      console.error(err);
      setActionError("The startup status could not be updated. Please try again.");
    } finally {
      setBusy(ids, false);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (ids.length === 0) return;
    const confirmed = window.confirm(
      `Permanently delete ${ids.length} startup${ids.length === 1 ? "" : "s"}? This cannot be undone.`,
    );
    if (!confirmed) return;

    clearMessages();
    setBusy(ids, true);
    try {
      await Promise.all(ids.map((id) => deleteDoc(doc(db, "startups", id))));
      setNotice(`${ids.length} startup${ids.length === 1 ? "" : "s"} permanently deleted.`);
      setSelectedIds(new Set());
      if (selectedStartup && ids.includes(selectedStartup.id)) setSelectedStartup(null);
    } catch (err) {
      console.error(err);
      setActionError("The selected startup records could not be deleted. Please try again.");
    } finally {
      setBusy(ids, false);
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => {
        if (allVisibleSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#e0e0e0] rounded-xl animate-pulse" />)
          : stats.map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-5 flex items-center gap-4`}>
              <span className="material-symbols-outlined text-[#0f5238] text-3xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-black text-[#002112]">{s.value}</p>
                <p className="text-xs font-bold text-[#404943]">{s.label}</p>
              </div>
            </div>
          ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#bfc9c1]/30">
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "queue"
              ? "border-[#0f5238] text-[#0f5238]"
              : "border-transparent text-[#707973] hover:text-[#0f5238]"
          }`}
        >
          Approval Queue ({queue.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "manage"
              ? "border-[#0f5238] text-[#0f5238]"
              : "border-transparent text-[#707973] hover:text-[#0f5238]"
          }`}
        >
          Manage Startups ({startups.length})
        </button>
      </div>

      {(actionError || notice) && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            actionError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {actionError || notice}
        </div>
      )}

      {activeTab === "queue" ? (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Startup Approval Queue</h2>
            <p className="text-[#404943] font-medium">Review pending startup submissions before they go live. Click any row to view full details.</p>
          </div>

          <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
            {loading ? (
              <div className="p-12 text-center">
                <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
              </div>
            ) : queue.length === 0 ? (
              <div className="p-16 text-center">
                <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">check_circle</span>
                <h3 className="text-xl font-bold text-[#002112]">Queue is empty</h3>
                <p className="text-[#404943] mt-1">All startup submissions have been reviewed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Startup</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted By</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Stage</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc9c1]/20">
                    {queue.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedStartup(item)}
                        className="hover:bg-[#e8ffee]/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#002112] group-hover:text-[#0f5238] group-hover:underline transition-colors">{item.name}</span>
                            <span className="material-symbols-outlined text-xs text-[#0f5238] opacity-0 group-hover:opacity-100 transition-opacity">info</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#b4ef9d] flex items-center justify-center">
                              <span className="material-symbols-outlined text-sm text-[#0f5238]">person</span>
                            </div>
                            <span className="text-sm font-medium text-[#002112]">{item.ownerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded bg-[#b4ef9d]/30 text-[#0e5138] text-xs font-bold">{item.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded bg-[#c4ecd2]/30 text-[#2b4e3b] text-xs font-bold">{item.stage}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#404943]">{formatDate(item.createdAt)}</td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedStartup(item)}
                              className="text-[#0f5238] hover:bg-[#d5fde2] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleSetStatus([item.id], "approved")}
                              disabled={updating.has(item.id)}
                              className="bg-[#0f5238] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2d6a4f] transition-colors disabled:opacity-60"
                            >
                              {updating.has(item.id) ? "…" : "Approve"}
                            </button>
                            <button
                              onClick={() => handleSetStatus([item.id], "rejected")}
                              disabled={updating.has(item.id)}
                              className="text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Manage Startups</h2>
            <p className="text-[#404943] font-medium">Search all startup records, make listings inactive so founders can reapply, or permanently delete obsolete entries.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["approved", "pending", "inactive", "rejected"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  statusFilter === status
                    ? "border-[#0f5238] bg-[#e8ffee]"
                    : "border-[#bfc9c1]/30 bg-white hover:border-[#0f5238]/50"
                }`}
              >
                <p className="text-2xl font-black text-[#002112]">{startups.filter((startup) => startup.status === status).length}</p>
                <p className="text-xs font-bold text-[#404943]">{titleCase(status)}</p>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[#bfc9c1]/30 bg-[#f8fcf9] p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973]">search</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search startup, founder, category, or stage..."
                  className="w-full rounded-lg border border-[#bfc9c1]/40 bg-white py-2.5 pl-10 pr-4 text-sm text-[#002112] outline-none focus:border-[#0f5238] focus:ring-2 focus:ring-[#0f5238]/10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="rounded-lg border border-[#bfc9c1]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#002112] outline-none focus:border-[#0f5238]"
              >
                {statusFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
              </select>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#404943] hover:bg-[#e3eae6]"
              >
                Reset
              </button>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#0f5238]/20 bg-[#d5fde2] px-4 py-3">
                <p className="text-sm font-bold text-[#0f5238]">{selectedIds.size} selected</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetStatus(Array.from(selectedIds), "approved")}
                    className="rounded-lg bg-[#0f5238] px-3 py-2 text-xs font-bold text-white hover:bg-[#2d6a4f]"
                  >
                    Mark approved
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetStatus(Array.from(selectedIds), "inactive")}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Make inactive
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(Array.from(selectedIds))}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Delete permanently
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
            {loading ? (
              <div className="p-12 text-center">
                <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
              </div>
            ) : managedStartups.length === 0 ? (
              <div className="p-16 text-center">
                <span className="material-symbols-outlined text-5xl text-[#bfc9c1] mb-3">search_off</span>
                <h3 className="text-xl font-bold text-[#002112]">No startups found</h3>
                <p className="text-[#404943] mt-1">Try changing the search term or status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left border-collapse">
                  <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
                    <tr>
                      <th className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={toggleAllVisible}
                          aria-label="Select all visible startups"
                          className="h-4 w-4 accent-[#0f5238]"
                        />
                      </th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Startup</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Founder</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Category / Stage</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc9c1]/20">
                    {managedStartups.map((startup) => {
                      const isBusy = updating.has(startup.id);
                      return (
                        <tr key={startup.id} className="hover:bg-[#f8fcf9] transition-colors">
                          <td className="px-4 py-4 align-top">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(startup.id)}
                              onChange={() => toggleSelected(startup.id)}
                              aria-label={`Select ${startup.name}`}
                              className="h-4 w-4 accent-[#0f5238]"
                            />
                          </td>
                          <td className="px-4 py-4 align-top">
                            <button
                              type="button"
                              onClick={() => setSelectedStartup(startup)}
                              className="text-left font-bold text-[#002112] hover:text-[#0f5238] hover:underline"
                            >
                              {startup.name}
                            </button>
                            {startup.website && <p className="mt-1 max-w-48 truncate text-xs text-[#707973]">{startup.website}</p>}
                          </td>
                          <td className="px-4 py-4 align-top text-sm font-medium text-[#002112]">{startup.ownerName || "Unknown"}</td>
                          <td className="px-4 py-4 align-top">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadge(startup.status)}`}>
                              {titleCase(startup.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-[#002112]">{startup.category}</p>
                            <p className="text-xs text-[#707973]">{startup.stage}</p>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-[#404943]">{formatDate(startup.createdAt)}</td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedStartup(startup)}
                                className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#0f5238] hover:bg-[#d5fde2]"
                              >
                                Details
                              </button>
                              {startup.status !== "approved" && (
                                <button
                                  type="button"
                                  onClick={() => handleSetStatus([startup.id], "approved")}
                                  disabled={isBusy}
                                  className="rounded-lg bg-[#0f5238] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2d6a4f] disabled:opacity-50"
                                >
                                  Activate
                                </button>
                              )}
                              {startup.status !== "inactive" && (
                                <button
                                  type="button"
                                  onClick={() => handleSetStatus([startup.id], "inactive")}
                                  disabled={isBusy}
                                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                                >
                                  Inactive
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete([startup.id])}
                                disabled={isBusy}
                                className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <StartupDetailsModal
        startup={selectedStartup}
        onClose={() => setSelectedStartup(null)}
        onApprove={selectedStartup?.status === "pending" ? (id) => handleSetStatus([id], "approved") : undefined}
        onReject={selectedStartup?.status === "pending" ? (id) => handleSetStatus([id], "rejected") : undefined}
        isUpdating={selectedStartup ? updating.has(selectedStartup.id) : false}
      />
    </div>
  );
}
