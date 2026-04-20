import Link from "next/link";

const faqs = [
  {
    question: "What is PakStartups?",
    answer:
      "PakStartups is a platform for founders, startup teams, investors, and ecosystem enablers in Pakistan. We help people discover startups, connect with collaborators, and find practical resources.",
  },
  {
    question: "How do I submit my startup?",
    answer:
      "Open the Submit Startup flow, complete the required details, and send your application for review. Approved profiles are published in the directory.",
  },
  {
    question: "How does co-founder matchmaking work?",
    answer:
      "You can browse profiles in Matchmaking and connect with candidates that align with your vision, skill set, and stage preferences.",
  },
  {
    question: "Can I promote my event on PakStartups?",
    answer:
      "Yes. Community and ecosystem events can be shared through our Events section after a quick quality and relevance check.",
  },
  {
    question: "How can I get support if something is not working?",
    answer:
      "Email us at hello@pakstartups.org with a short description of the issue, the page link, and a screenshot if possible.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#f4fff7] font-['Plus_Jakarta_Sans']">
      <section className="max-w-5xl mx-auto px-6 md:px-8 pt-14 md:pt-20 pb-10">
        <div className="rounded-3xl border border-[#ccefd8] bg-white shadow-[0_20px_50px_rgba(15,82,56,0.08)] p-8 md:p-12">
          <p className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#2d6a4f] mb-4">
            Help Center
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-[#002112] leading-tight">
            Help / FAQ
          </h1>
          <p className="text-[#404943] mt-4 max-w-2xl leading-relaxed">
            Find answers to common questions about PakStartups. If you still need help, our team is one email away.
          </p>

          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-[#dbeee2] bg-[#fbfffc] p-5 md:p-6">
                <h2 className="text-lg md:text-xl font-extrabold text-[#0f5238]">{item.question}</h2>
                <p className="text-[#404943] mt-2 leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-[#d5fde2] border border-[#b8e7c8] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#0f5238]">Still need help?</h3>
              <p className="text-[#2d6a4f] mt-1">
                Contact us at <a href="mailto:hello@pakstartups.org" className="font-bold underline decoration-[#0f5238]/40 underline-offset-4">hello@pakstartups.org</a>
              </p>
            </div>
            <Link
              href="mailto:hello@pakstartups.org"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0f5238] text-white font-bold hover:bg-[#0c412d] transition-colors"
            >
              Email Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}