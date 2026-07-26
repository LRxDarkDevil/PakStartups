"use client";

import { useState } from "react";

const CATEGORIES = [
  "General Support",
  "Startup Submission & Listing",
  "Co-Founder Matching",
  "B2B Deals & Perks",
  "Sponsorship & Investor Inquiry",
  "Bug Report / Website Feedback",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
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
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSubmitted(true);
      if (data.id) setTicketId(data.id);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Failed to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf6] font-['Plus_Jakarta_Sans'] pb-24 pt-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5fde2] text-[#0f5238] border border-[#a4f0c1] text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#0f5238] animate-pulse" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#002112] tracking-tight">
            Reach out to <span className="text-[#0f5238]">PakStartups</span>
          </h1>
          <p className="text-base sm:text-lg text-[#3d5a49] font-medium leading-relaxed">
            Have questions about startup listings, co-founder matching, or ecosystem partnerships? Fill out the form below to message our team, or join our live community on Discord.
          </p>
        </div>

        {/* PROMINENT DISCORD CALLOUT BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5865F2] via-[#4752C4] to-[#1e2358] text-white p-8 sm:p-10 shadow-2xl shadow-[#5865F2]/20 border border-indigo-400/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 z-10 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-black uppercase tracking-wider">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a74.77,74.77,0,0,0,64.3,0c.87.69,1.76,1.37,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.5,77.5,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.88-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Official Discord Community
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Join 14,000+ Founders & Builders on Discord
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Get immediate answers, find live co-founder matches, pitch your startup, and engage in real-time discussions with Pakistan&apos;s active tech community.
            </p>
          </div>

          <div className="z-10 shrink-0 w-full sm:w-auto">
            <a
              href="https://discord.gg/v336zDnYrF"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#5865F2] font-black text-base rounded-2xl shadow-xl hover:bg-indigo-50 active:scale-95 transform transition-all group"
            >
              <svg className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a74.77,74.77,0,0,0,64.3,0c.87.69,1.76,1.37,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.5,77.5,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.88-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              <span>Join Discord Server</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Main Grid: Form + Side Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(15,82,56,0.06)] border border-[#dbeee2]">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#002112]">Send Us a Message</h2>
              <p className="text-[#516457] text-sm mt-1">
                Submissions automatically notify our team and dispatch to our Discord support channel.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#f4fff7] border border-[#b4ef9d] rounded-2xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-[#d5fde2] text-[#0f5238] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#002112]">Message Received!</h3>
                  <p className="text-[#3d5a49] text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your message has been safely logged and dispatched to our Discord support desk.
                  </p>
                  {ticketId && (
                    <div className="pt-2">
                      <span className="inline-block bg-[#e8ffee] border border-[#a4f0c1] text-[#0f5238] font-mono text-xs font-bold px-3 py-1 rounded-md">
                        Reference Ticket ID: {ticketId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-[#0f5238] text-white rounded-xl font-bold hover:bg-[#2d6a4f] transition-all text-sm shadow-md"
                  >
                    Send Another Message
                  </button>
                  <a
                    href="https://discord.gg/v336zDnYrF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#5865F2] text-white rounded-xl font-bold hover:bg-[#4752C4] transition-all text-sm flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Join Us on Discord</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold animate-in fade-in">
                    <span className="material-symbols-outlined text-base shrink-0">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#2d6a4f] mb-2 uppercase tracking-wider">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      required
                      placeholder="e.g. Fatima Ali"
                      className="w-full px-4 py-3 bg-[#fbfdfc] border border-[#d2e5d9] rounded-xl focus:ring-2 focus:ring-[#0f5238]/30 focus:border-[#0f5238] outline-none text-[#002112] text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2d6a4f] mb-2 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="fatima@example.com"
                      className="w-full px-4 py-3 bg-[#fbfdfc] border border-[#d2e5d9] rounded-xl focus:ring-2 focus:ring-[#0f5238]/30 focus:border-[#0f5238] outline-none text-[#002112] text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#2d6a4f] mb-2 uppercase tracking-wider">
                      Inquiry Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#fbfdfc] border border-[#d2e5d9] rounded-xl focus:ring-2 focus:ring-[#0f5238]/30 focus:border-[#0f5238] outline-none text-[#002112] text-sm transition-all cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2d6a4f] mb-2 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      type="text"
                      placeholder="Brief topic summary"
                      className="w-full px-4 py-3 bg-[#fbfdfc] border border-[#d2e5d9] rounded-xl focus:ring-2 focus:ring-[#0f5238]/30 focus:border-[#0f5238] outline-none text-[#002112] text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2d6a4f] mb-2 uppercase tracking-wider">
                    Message Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you or how you'd like to collaborate..."
                    className="w-full px-4 py-3 bg-[#fbfdfc] border border-[#d2e5d9] rounded-xl focus:ring-2 focus:ring-[#0f5238]/30 focus:border-[#0f5238] outline-none text-[#002112] text-sm resize-y transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#0f5238] text-white font-bold rounded-xl shadow-lg shadow-[#0f5238]/20 hover:bg-[#2d6a4f] hover:shadow-xl active:scale-[0.99] transition-all text-base disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending to Discord & Support…</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">send</span>
                      <span>Send Form to Discord & Support</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,82,56,0.06)] border border-[#dbeee2] space-y-6">
              <h3 className="text-lg font-black text-[#002112] pb-4 border-b border-[#e0f0e6]">
                Direct Contact Channels
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e8ffee] text-[#0f5238] flex items-center justify-center shrink-0 border border-[#b8f3cb]">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#516457] uppercase tracking-wider">Email Address</p>
                    <a href="mailto:hello@pakstartups.org" className="text-sm font-bold text-[#0f5238] hover:underline">
                      hello@pakstartups.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5865F2] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a74.77,74.77,0,0,0,64.3,0c.87.69,1.76,1.37,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.5,77.5,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.88-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#516457] uppercase tracking-wider">Discord Channel</p>
                    <a
                      href="https://discord.gg/v336zDnYrF"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#5865F2] hover:underline"
                    >
                      discord.gg/v336zDnYrF
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e8ffee] text-[#0f5238] flex items-center justify-center shrink-0 border border-[#b8f3cb]">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#516457] uppercase tracking-wider">Response Time</p>
                    <p className="text-sm font-semibold text-[#002112]">Within 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f5238] rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
              <h4 className="text-lg font-black">Are you a Startup Founder?</h4>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                List your startup on PakStartups Directory to reach top local investors, technical co-founders, and potential early customers.
              </p>
              <a
                href="/startups/submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0f5238] rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all"
              >
                <span>Submit Your Startup</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}