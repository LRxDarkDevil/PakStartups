"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getKnowledgeResources, type KnowledgeResource } from "@/lib/services/knowledge";
import { useAuth } from "@/lib/context/AuthContext";

const CATEGORIES = ["All", "Grants", "Programs", "Legal", "Tools", "Mentorship", "Events"];

export default function KnowledgeDirectoryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedResource, setSelectedResource] = useState<KnowledgeResource | null>(null);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    getKnowledgeResources("directory")
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleInquirySubmit = async () => {
    if (!selectedResource) return;
    setSubmittingInquiry(true);
    try {
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/config");
      await addDoc(collection(db, "supportMessages"), {
        subject: `Directory Resource Inquiry: ${selectedResource.title}`,
        message: `User is requesting more details/contact link for the resource: ${selectedResource.title} (${selectedResource.org || "No Org"}).`,
        email: user?.email || "anonymous@pakstartups.org",
        createdAt: serverTimestamp(),
      });
      setInquirySuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const filtered = resources.filter((r) => {
    const catMatch = activeCategory === "All" || r.category === activeCategory;
    const q = search.trim().toLowerCase();
    const textMatch = !q || [r.title, r.org ?? "", r.desc, r.category].join(" ").toLowerCase().includes(q);
    return catMatch && textMatch;
  });

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/knowledge" className="flex items-center gap-1 text-sm text-[#0f5238] font-bold mb-4 hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span> Knowledge Hub
          </Link>
          <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Resource Directory</h1>
          <p className="text-[#404943] text-lg max-w-2xl">
            Grants, programs, legal resources, tools, and events for Pakistani founders.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-sm">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e0e0e0] outline-none focus:ring-2 focus:ring-[#0f5238]/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0f5238] text-white"
                    : "bg-white border border-[#e0e0e0] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-[#e0e0e0] h-36" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-[#707973] mb-6">Showing <b className="text-[#002112]">{filtered.length}</b> resources</p>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-[#f5faf6] rounded-xl">
                <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">search_off</span>
                <p className="font-bold text-[#002112]">No resources found</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-3 text-sm text-[#0f5238] font-bold hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((r) => {
                  const href = r.link && r.link !== "" ? r.link : undefined;
                  return (
                    <a
                      key={r.id ?? r.title}
                      href={href || "#"}
                      target={href ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!href) {
                          e.preventDefault();
                          setSelectedResource(r);
                          setInquirySuccess(false);
                        }
                      }}
                      className="bg-white rounded-xl p-6 border border-[#e0e0e0] hover:shadow-lg hover:border-[#0f5238]/20 transition-all group flex gap-4 no-underline cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-[#d5fde2] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[#0f5238] text-lg">{r.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-[#002112] group-hover:text-[#0f5238] transition-colors leading-snug">{r.title}</h3>
                          {href && (
                            <span className="material-symbols-outlined text-[#707973] text-base shrink-0 group-hover:text-[#0f5238] transition-colors">open_in_new</span>
                          )}
                        </div>
                        {r.org && <p className="text-xs font-bold text-[#707973] mb-2">{r.org}</p>}
                        <p className="text-sm text-[#404943] leading-relaxed mb-3 line-clamp-2">{r.desc}</p>
                        {r.tags && r.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {r.tags.map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-[#f5faf6] text-[#0f5238] text-[10px] font-bold rounded uppercase">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Submit CTA */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <div className="bg-[#f5faf6] rounded-2xl p-8 border border-[#d5fde2] flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-[#002112] mb-2">Know a resource we missed?</h3>
            <p className="text-[#404943]">Help the community by submitting grants, programs, or tools we should add to this directory.</p>
          </div>
          <Link href="/contact" className="px-6 py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all whitespace-nowrap">
            Submit a Resource
          </Link>
        </div>
      </div>

      {selectedResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border border-[#bfc9c1]/20 animate-in fade-in zoom-in duration-200 relative">
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 text-[#707973] hover:text-[#002112]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="w-16 h-16 bg-[#d5fde2] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[#0f5238] text-3xl font-bold">{selectedResource.icon || "explore"}</span>
            </div>
            <h3 className="text-xl font-black text-[#002112] mb-1">{selectedResource.title}</h3>
            {selectedResource.org && <p className="text-xs font-bold text-[#707973] mb-4">{selectedResource.org}</p>}
            <p className="text-[#404943] text-sm leading-relaxed mb-6">
              There is currently no direct website link verified for this resource. You can search the web for updates or request our team to find the official contact details for you.
            </p>

            {inquirySuccess ? (
              <div className="bg-[#f0fdf4] text-[#0f5238] p-4 rounded-xl font-bold text-sm mb-4">
                ✓ Request submitted! We will notify you once we verify the link.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(selectedResource.title + " " + (selectedResource.org || ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2 text-sm no-underline"
                >
                  <span className="material-symbols-outlined text-base">search</span> Search on Web
                </a>
                <button
                  onClick={handleInquirySubmit}
                  disabled={submittingInquiry}
                  className="w-full py-3 border border-[#0f5238] text-[#0f5238] rounded-lg font-bold hover:bg-[#d5fde2] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-55"
                >
                  {submittingInquiry ? "Submitting Request..." : "Request Verification"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
