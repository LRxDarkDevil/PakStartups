export default function EventDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16" aria-busy="true" aria-label="Loading event details">
      <div className="h-6 w-36 animate-pulse rounded bg-[#cfe5d6] motion-reduce:animate-none" />
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#dbeee2] bg-white">
        <div className="bg-[#f4fbf6] p-6 sm:p-10 lg:p-12">
          <div className="h-6 w-28 animate-pulse rounded-full bg-[#d5fde2] motion-reduce:animate-none" />
          <div className="mt-5 h-12 max-w-3xl animate-pulse rounded bg-[#dbeee2] motion-reduce:animate-none" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse rounded bg-[#e7f2ea] motion-reduce:animate-none" />
        </div>
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_320px] lg:p-12">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-[#f0f6f2] motion-reduce:animate-none" />)}
          </div>
          <div className="h-52 animate-pulse rounded-2xl bg-[#f0f6f2] motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
