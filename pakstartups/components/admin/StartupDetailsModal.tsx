"use client";

import { useEffect } from "react";

export type StartupDetail = {
  id: string;
  name: string;
  tagline?: string;
  desc?: string;
  ownerName: string;
  ownerId?: string;
  category: string;
  stage: string;
  city?: string;
  region?: string;
  country?: string;
  website?: string;
  linkedin?: string;
  logo?: string;
  slug?: string;
  founders?: string[] | string;
  teamSize?: string;
  recordType?: string;
  status: string;
  views?: number;
  createdAt: { toDate?: () => Date } | string | null;
};

type Props = {
  startup: StartupDetail | null;
  onClose: () => void;
  onApprove?: (id: string) => Promise<void> | void;
  onReject?: (id: string) => Promise<void> | void;
  isUpdating?: boolean;
};

function formatDate(ts: StartupDetail["createdAt"]) {
  if (!ts) return "–";
  const d = (ts as { toDate?: () => Date }).toDate
    ? (ts as { toDate: () => Date }).toDate()
    : new Date(ts as string);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StartupDetailsModal({
  startup,
  onClose,
  onApprove,
  onReject,
  isUpdating = false,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!startup) return null;

  const foundersList = Array.isArray(startup.founders)
    ? startup.founders
    : typeof startup.founders === "string"
    ? startup.founders.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#bfc9c1]/30 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="bg-[#d5fde2] p-6 border-b border-[#bfc9c1]/20 flex items-start justify-between relative">
          <div className="flex items-start gap-4 pr-8">
            <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-[#bfc9c1]/20 shrink-0">
              {startup.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[#0f5238] text-3xl">
                  rocket_launch
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-black text-[#002112] tracking-tight">
                  {startup.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    startup.status === "approved"
                      ? "bg-green-600 text-white"
                      : startup.status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}
                >
                  {startup.status}
                </span>
              </div>
              {startup.tagline && (
                <p className="text-sm font-medium text-[#404943] mt-1">
                  {startup.tagline}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#002112] flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Badges Bar */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-md bg-[#b4ef9d]/40 text-[#0e5138] text-xs font-bold">
              Category: {startup.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-[#c4ecd2]/40 text-[#2b4e3b] text-xs font-bold">
              Stage: {startup.stage}
            </span>
            {startup.city && (
              <span className="px-3 py-1 rounded-md bg-[#e3eae6] text-[#404943] text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {startup.city}
                {startup.region ? `, ${startup.region}` : ""}
              </span>
            )}
            {startup.recordType && (
              <span className="px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold">
                Origin: {startup.recordType}
              </span>
            )}
          </div>

          {/* Description Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
              About Startup
            </h4>
            <p className="text-[#002112] text-sm leading-relaxed whitespace-pre-line bg-[#f8fcf9] p-4 rounded-xl border border-[#bfc9c1]/20">
              {startup.desc || "No description provided."}
            </p>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Owner & Submission Info */}
            <div className="bg-[#f5fbf7] p-4 rounded-xl border border-[#bfc9c1]/20 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#0f5238]">
                Submission Info
              </h5>
              <div className="text-sm space-y-1 text-[#002112]">
                <p className="flex justify-between">
                  <span className="text-[#707973] text-xs font-medium">Submitted By:</span>
                  <span className="font-bold">{startup.ownerName}</span>
                </p>
                {startup.ownerId && (
                  <p className="flex justify-between">
                    <span className="text-[#707973] text-xs font-medium">User ID:</span>
                    <span className="font-mono text-xs text-[#404943] truncate max-w-[150px]">
                      {startup.ownerId}
                    </span>
                  </p>
                )}
                <p className="flex justify-between">
                  <span className="text-[#707973] text-xs font-medium">Submitted Date:</span>
                  <span className="text-xs">{formatDate(startup.createdAt)}</span>
                </p>
              </div>
            </div>

            {/* Team & Founders */}
            <div className="bg-[#f5fbf7] p-4 rounded-xl border border-[#bfc9c1]/20 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#0f5238]">
                Team & Founders
              </h5>
              <div className="text-sm space-y-1 text-[#002112]">
                <p className="flex justify-between">
                  <span className="text-[#707973] text-xs font-medium">Team Size:</span>
                  <span className="font-bold">{startup.teamSize || "Not specified"}</span>
                </p>
                <div>
                  <span className="text-[#707973] text-xs font-medium block mb-1">
                    Founders:
                  </span>
                  {foundersList.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {foundersList.map((founder, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#bfc9c1]/30 text-xs font-medium text-[#002112]"
                        >
                          <span className="material-symbols-outlined text-xs text-[#0f5238]">
                            person
                          </span>
                          {founder}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[#707973] italic">
                      No founder names listed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Links & Social Media */}
          {(startup.website || startup.linkedin || startup.slug) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#707973] mb-2">
                External Links & Preview
              </h4>
              <div className="flex flex-wrap gap-3">
                {startup.website && (
                  <a
                    href={
                      startup.website.startsWith("http")
                        ? startup.website
                        : `https://${startup.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d5fde2] text-[#0f5238] text-xs font-bold hover:bg-[#b4ef9d] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">language</span>
                    Website
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                )}
                {startup.linkedin && (
                  <a
                    href={
                      startup.linkedin.startsWith("http")
                        ? startup.linkedin
                        : `https://${startup.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    LinkedIn
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                )}
                {startup.slug && (
                  <a
                    href={`/startups/${startup.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002112] text-white text-xs font-bold hover:bg-[#0f5238] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View Public Page
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="bg-[#f5fbf7] p-4 border-t border-[#bfc9c1]/20 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#404943] hover:bg-[#e3eae6] transition-colors"
          >
            Close
          </button>
          {(onApprove || onReject) && (
            <div className="flex items-center gap-3">
              {onReject && (
                <button
                  onClick={async () => {
                    await onReject(startup.id);
                    onClose();
                  }}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Processing..." : "Reject Startup"}
                </button>
              )}
              {onApprove && (
                <button
                  onClick={async () => {
                    await onApprove(startup.id);
                    onClose();
                  }}
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#0f5238] text-white text-xs font-bold hover:bg-[#2d6a4f] shadow-md transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Processing..." : "Approve Startup"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
