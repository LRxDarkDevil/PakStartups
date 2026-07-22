"use client";

import Link from "next/link";

export default function EventDetailError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-900">
        <h1 className="text-3xl font-black">We could not load this event</h1>
        <p className="mt-3 leading-7">The event service may be temporarily unavailable. No RSVP or booking action was completed.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="min-h-11 rounded-lg bg-red-800 px-5 py-3 font-bold text-white transition hover:bg-red-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300 motion-reduce:transition-none">Try again</button>
          <Link href="/events" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-300 px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300">Browse events</Link>
        </div>
      </div>
    </div>
  );
}
