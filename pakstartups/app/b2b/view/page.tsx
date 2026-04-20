"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function B2BViewPage() {
  const params = useSearchParams();
  const kind = params.get("kind") ?? "demand";
  const id = params.get("id") ?? "";
  const [item, setItem] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ref = doc(db, kind === "solution" ? "b2bSolutions" : "b2bDemands", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setItem({ id: snap.id, ...snap.data() });
    })();
  }, [id, kind]);

  return (
    <main className="max-w-4xl mx-auto px-8 py-16">
      <Link href="/b2b" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to B2B</Link>
      <div className="bg-white rounded-2xl p-8 border border-[#dbeee2] space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0f5238]">{kind === "solution" ? "Solution" : "Demand"} Detail</p>
        <h1 className="text-3xl font-black text-[#002112]">{String(item?.title ?? "Listing not found")}</h1>
        <p className="text-[#404943]">{String(item?.desc ?? "This listing is not available.")}</p>
        <Link href={`mailto:hello@pakstartups.org?subject=${encodeURIComponent(`B2B ${kind}: ${String(item?.title ?? "Listing")}`)}`} className="inline-flex px-5 py-3 bg-[#0f5238] text-white rounded-lg font-bold">View & Respond</Link>
      </div>
    </main>
  );
}