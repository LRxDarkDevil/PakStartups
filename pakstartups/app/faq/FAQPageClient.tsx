"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublishedFaqs, type FAQItem } from "@/lib/services/faqs";

const fallbackFaqs: FAQItem[] = [
  {
    question: "What is PakStartups?",
    answer:
      "PakStartups is a platform for founders, startup teams, investors, and ecosystem enablers in Pakistan.",
    order: 1,
    isPublished: true,
  },
  {
    question: "How do I submit my startup?",
    answer:
      "Go to the Submit Startup page, fill in your startup details, and submit for review.",
    order: 2,
    isPublished: true,
  },
  {
    question: "Is PakStartups free to use?",
    answer:
      "Most core features are free for founders and community members.",
    order: 3,
    isPublished: true,
  },
  {
    question: "How can I contact support?",
    answer: "Email us at hello@pakstartups.org and we will get back to you.",
    order: 4,
    isPublished: true,
  },
];

export default function FAQPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublishedFaqs();
        if (data.length > 0) {
          setFaqs(data);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#f8fffb] to-white min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#002112] tracking-tight mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-[#405244] mb-10 text-base md:text-lg font-medium">
          Clear answers about PakStartups, how it works, and how to get the most out of the platform.
        </p>

        <div className="space-y-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-[#dbe7de] rounded-xl p-5 animate-pulse h-20" />
              ))
            : faqs.map((item, idx) => (
                <div key={`${item.question}-${idx}`} className="bg-white border border-[#dbe7de] rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span className="text-[#002112] font-bold text-base md:text-lg">{item.question}</span>
                    <span className="material-symbols-outlined text-[#0f5238]">{openIndex === idx ? "remove" : "add"}</span>
                  </button>

                  {openIndex === idx && (
                    <div className="px-5 pb-5 text-[#4c5f52] leading-relaxed text-sm md:text-base">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#405244] mb-4">Still need help?</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-[#0f5238] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1b6a4a] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
