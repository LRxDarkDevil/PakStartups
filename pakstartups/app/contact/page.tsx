"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter your message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error("API request failed");
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to send your message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-8 py-20">
      <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(15,82,56,0.08)] border border-[#dbeee2]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f5238] mb-4">Contact</p>
        <h1 className="text-4xl font-black text-[#002112] mb-4">Reach PakStartups</h1>
        <p className="text-[#404943] mb-6">For support, partnerships, or media requests, email hello@pakstartups.org or use the form below.</p>

        {submitted ? (
          <div className="bg-[#f4fff7] border border-[#b4ef9d] rounded-2xl p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#0f5238]">check_circle</span>
            <h3 className="text-2xl font-black text-[#002112]">Message Sent Successfully!</h3>
            <p className="text-[#404943] text-sm max-w-md mx-auto">
              Thank you for reaching out to PakStartups. Our team will review your message and get back to you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-[#0f5238] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-all text-sm"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
                <span className="material-symbols-outlined text-sm">error</span> {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Your Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none text-[#002112] transition-all"
                placeholder="Ahmed Ali"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Your Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none text-[#002112] transition-all"
                placeholder="ahmed@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">How can we help?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg min-h-40 focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none text-[#002112] resize-none transition-all"
                placeholder="Tell us details about your request..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#0f5238] text-white font-bold rounded-lg shadow-xl shadow-[#0f5238]/15 hover:shadow-[#0f5238]/25 active:scale-[0.98] transition-all text-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}