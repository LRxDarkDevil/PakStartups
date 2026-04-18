"use client";

const roles = [
  { icon: "school", title: "Mentor", desc: "Provide 1-on-1 guidance to early-stage founders on product, marketing, fundraising, or ops. 2–4 hrs/month." },
  { icon: "groups", title: "Community Facilitator", desc: "Help moderate and grow our Discord, Reddit, and LinkedIn communities. Keep discussions vibrant and on-topic." },
  { icon: "event", title: "Event Organizer", desc: "Co-organize local meetups, workshops, and pitch nights. Manage logistics and speaker pipelines." },
  { icon: "code", title: "Tech Volunteer", desc: "Contribute to the PakStartups open-source codebase, fix bugs, or build new features." },
  { icon: "translate", title: "Content Creator", desc: "Write guides, translate resources into Urdu/Punjabi, or create video content for the knowledge hub." },
  { icon: "campaign", title: "Outreach Lead", desc: "Connect with universities, incubators, and media to grow PakStartups' reach across Pakistan." },
];

export default function VolunteerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0f5238] py-24 px-8 text-white text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 3px 3px, #b1f0ce 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-white/10 text-[#a8e7c5] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            Give Back to the Ecosystem
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Volunteer with PakStartups
          </h1>
          <p className="text-[#a8e7c5] text-lg leading-relaxed max-w-2xl mx-auto">
            Our platform is built on community. Join 150+ volunteers who dedicate their time, expertise, and energy to help Pakistan&apos;s founders succeed.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a href="#apply" className="bg-white text-[#0f5238] px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:bg-[#d5fde2] transition-all active:scale-95">
              Apply to Volunteer
            </a>
            <a href="#roles" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all">
              Explore Roles
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["150+", "Active Volunteers"], ["12", "Cities Represented"], ["500+", "Hours Contributed"], ["30+", "Mentors Onboarded"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-4xl font-black text-[#0f5238] mb-1">{val}</div>
              <div className="text-xs font-bold text-[#404943] uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles Grid */}
      <section id="roles" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-bold text-[#0f5238] uppercase tracking-widest mb-2">Open Positions</p>
            <h2 className="text-4xl font-black text-[#002112] tracking-tight">Find Your Role</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div key={role.title} className="bg-[#f5faf6] rounded-xl p-8 border border-[#d5fde2] hover:border-[#0f5238] hover:shadow-[0_8px_32px_rgba(15,82,56,0.08)] transition-all group">
                <div className="w-14 h-14 bg-[#d5fde2] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#b4ef9d] transition-colors">
                  <span className="material-symbols-outlined text-[#0f5238] text-3xl">{role.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#002112] mb-3">{role.title}</h3>
                <p className="text-[#404943] text-sm leading-relaxed mb-6">{role.desc}</p>
                <a href="#apply" className="text-[#0f5238] font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Apply for this Role <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 px-8 bg-[#d5fde2]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#002112] tracking-tight mb-3">Ready to Contribute?</h2>
            <p className="text-[#404943]">Fill in the form and our team will reach out within 3 business days.</p>
          </div>
          <div className="bg-white rounded-2xl p-10 shadow-[0_16px_48px_rgba(15,82,56,0.08)]">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Full Name</label>
                  <input type="text" placeholder="Ahmad Raza" className="w-full px-4 py-3 bg-[#f5faf6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all text-[#002112] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">City</label>
                  <select className="w-full px-4 py-3 bg-[#f5faf6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all text-[#002112] outline-none">
                    <option>Select city...</option>
                    <option>Karachi</option>
                    <option>Lahore</option>
                    <option>Islamabad</option>
                    <option>Faisalabad</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Email</label>
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 bg-[#f5faf6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all text-[#002112] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Role Preference</label>
                <select className="w-full px-4 py-3 bg-[#f5faf6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all text-[#002112] outline-none">
                  <option>Select a role...</option>
                  {roles.map((r) => <option key={r.title}>{r.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">Why do you want to volunteer?</label>
                <textarea rows={4} placeholder="Tell us about your background and what you hope to contribute..." className="w-full px-4 py-3 bg-[#f5faf6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all text-[#002112] outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#404943] mb-2 uppercase tracking-wider">LinkedIn / Portfolio URL</label>
                <input type="url" placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 bg-[#f5faf6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 focus:bg-white transition-all text-[#002112] outline-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-[#0f5238] text-white font-bold rounded-lg shadow-xl shadow-[#0f5238]/15 hover:shadow-[#0f5238]/25 active:scale-[0.98] transition-all text-lg">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
