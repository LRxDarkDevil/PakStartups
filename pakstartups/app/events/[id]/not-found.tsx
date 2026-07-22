import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
      <p className="text-sm font-bold uppercase tracking-widest text-[#0f5238]">Event unavailable</p>
      <h1 className="mt-3 text-4xl font-black text-[#002112]">This event could not be found</h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-[#404943]">It may be awaiting review, removed, or the link may be incorrect. Cancelled public events remain visible with an update notice, so this link does not currently point to a published event.</p>
      <Link href="/events" className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-[#0f5238] px-5 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#77c99a]">Browse upcoming events</Link>
    </div>
  );
}
