import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-20">
      <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(15,82,56,0.08)] border border-[#dbeee2]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f5238] mb-4">Contact</p>
        <h1 className="text-4xl font-black text-[#002112] mb-4">Reach PakStartups</h1>
        <p className="text-[#404943] mb-6">For support, partnerships, or media requests, email hello@pakstartups.org or use the form below.</p>
        <div className="grid gap-4">
          <input className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg" placeholder="Your name" />
          <input className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg" placeholder="Your email" />
          <textarea className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg min-h-40" placeholder="How can we help?" />
          <Link href="mailto:hello@pakstartups.org" className="inline-flex justify-center px-6 py-3 rounded-lg bg-[#0f5238] text-white font-bold">Send Email</Link>
        </div>
      </div>
    </main>
  );
}