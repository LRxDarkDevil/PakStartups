import Link from "next/link";

export const metadata = {
  title: "About Us | PakStartups",
  description:
    "Learn about the mission, vision, and team behind PakStartups — Pakistan's definitive platform for entrepreneurs.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#e8ffee] font-['Plus_Jakarta_Sans'] text-[#002112]">
      {/* Hero Section */}
      <section className="relative px-8 pt-32 pb-24 overflow-hidden border-b border-[#c4ecd2]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d5fde2] rounded-full blur-[100px] -z-10 opacity-70 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#b1f0ce] rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5fde2] text-[#0f5238] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#002112] tracking-tighter mb-6 leading-[1.1]">
            Catalyzing Pakistan's <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f5238] to-[#2d6a4f]">
              Innovation Era.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#2d6a4f] max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            We are building the definitive digital infrastructure to connect, empower,
            and scale the next generation of Pakistani entrepreneurs and startups.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-8 bg-white selection:bg-[#b1f0ce]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#e8ffee] to-[#d5fde2] rounded-[40px] transform -rotate-3 scale-105 -z-10"></div>
              <div className="bg-[#0f5238] rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden aspect-square flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[40px] transform translate-x-1/2 -translate-y-1/2"></div>
                
                <span className="material-symbols-outlined text-7xl text-[#b1f0ce] mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>
                  public
                </span>
                <h3 className="text-3xl font-extrabold mb-4">Our Vision</h3>
                <p className="text-[#e8ffee] text-lg font-medium leading-relaxed opacity-90">
                  To position Pakistan as a leading hub of tech innovation by breaking
                  down barriers to knowledge, funding, and talent for every founder—no
                  matter where they start.
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div>
                <h2 className="text-4xl font-extrabold text-[#002112] tracking-tight mb-4">The Problem We Are Solving</h2>
                <p className="text-[#404943] text-lg leading-relaxed">
                  Too many brilliant ideas die in isolation. Pakistan has an incredibly young, energetic, and tech-savvy population, yet founders often struggle with fragmented networks, opaque data, and missing early-stage support structures.
                </p>
              </div>
              <div>
                <h2 className="text-4xl font-extrabold text-[#002112] tracking-tight mb-4">Our Mission</h2>
                <p className="text-[#404943] text-lg leading-relaxed">
                  PakStartups acts as the operating system for the ecosystem. We unify the community by providing open access to a comprehensive startup directory, co-founder matchmaking, B2B procurement, and free educational resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Team / Who We Are */}
      <section className="py-24 px-8 bg-[#f5faf6]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5fde2] text-[#0f5238] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">group</span>
            The People
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#002112] tracking-tight mb-6">
            Built by Founders, <br /> for Founders.
          </h2>
          <p className="text-lg text-[#404943] max-w-3xl mx-auto font-medium leading-relaxed mb-16">
            PakStartups is managed by a diverse team of operators, developers, and tech enthusiasts who have built, scaled, and navigated the complexities of the Pakistani market firsthand.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.12)] transition-shadow group flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full mb-6 bg-[#d5fde2] border-4 border-[#b1f0ce] flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl text-[#0f5238]">person</span>
              </div>
              <h3 className="font-extrabold text-[#002112] text-xl">Ahmed Raza</h3>
              <p className="text-[#0f5238] font-bold text-sm mb-3">Founder & Architect</p>
              <p className="text-[#707973] text-sm leading-relaxed mb-5">
                Passionate about scaling digital infrastructure for emerging markets.
              </p>
              <div className="mt-auto flex gap-3">
                <a href="https://linkedin.com/company/pakstartups" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#f5faf6] text-[#2d6a4f] flex items-center justify-center hover:bg-[#0f5238] hover:text-white transition-colors" aria-label="LinkedIn">
                  <span className="material-symbols-outlined text-sm">link</span>
                </a>
                <a href="mailto:hello@pakstartups.org" className="w-8 h-8 rounded-full bg-[#f5faf6] text-[#2d6a4f] flex items-center justify-center hover:bg-[#0f5238] hover:text-white transition-colors" aria-label="Email">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.12)] transition-shadow group flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full mb-6 bg-[#d5fde2] border-4 border-[#b1f0ce] flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl text-[#0f5238]">person</span>
              </div>
              <h3 className="font-extrabold text-[#002112] text-xl">Fatima Tariq</h3>
              <p className="text-[#0f5238] font-bold text-sm mb-3">Head of Community</p>
              <p className="text-[#707973] text-sm leading-relaxed mb-5">
                Connecting the dots between founders, investors, and talent.
              </p>
              <div className="mt-auto flex gap-3">
                <a href="https://reddit.com/r/PakStartups" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#f5faf6] text-[#2d6a4f] flex items-center justify-center hover:bg-[#0f5238] hover:text-white transition-colors" aria-label="Reddit">
                  <span className="material-symbols-outlined text-sm">link</span>
                </a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(15,82,56,0.06)] hover:shadow-[0_12px_40px_rgba(15,82,56,0.12)] transition-shadow group flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full mb-6 bg-[#d5fde2] border-4 border-[#b1f0ce] flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl text-[#0f5238]">person</span>
              </div>
              <h3 className="font-extrabold text-[#002112] text-xl">The Community</h3>
              <p className="text-[#0f5238] font-bold text-sm mb-3">Volunteers & Contributors</p>
              <p className="text-[#707973] text-sm leading-relaxed mb-5">
                Dozens of open-source contributors and community volunteers.
              </p>
              <div className="mt-auto flex gap-3">
                <Link href="/volunteer" className="text-xs font-bold text-[#0f5238] uppercase tracking-wider hover:underline">
                  Join Them →
                </Link>
              </div>
            </div>

            {/* Open Role */}
            <div className="bg-[#e8ffee] border-2 border-dashed border-[#b1f0ce] rounded-3xl p-6 hover:border-[#0f5238] hover:bg-[#d5fde2] transition-colors group flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="w-20 h-20 rounded-full mb-4 bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-[#0f5238]">add</span>
              </div>
              <h3 className="font-extrabold text-[#0f5238] text-lg mb-2">Join the Mission</h3>
              <p className="text-[#404943] text-sm leading-relaxed">
                We are always looking for passionate builders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 px-8 bg-white border-t border-[#c4ecd2]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-[#f5faf6] p-10 md:p-12 rounded-[40px]">
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight mb-4">Our Core Values</h2>
              <p className="text-[#404943] leading-relaxed">
                What drives our decisions and shapes our platform architecture on a daily basis.
              </p>
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#0f5238] text-3xl shrink-0">volunteer_activism</span>
                <div>
                  <h4 className="font-bold text-[#002112] text-lg mb-1">Collaboration Over Competition</h4>
                  <p className="text-[#404943] text-sm">We believe the market is big enough for everyone. Our platform aims to multiply opportunities rather than divide them.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#0f5238] text-3xl shrink-0">lock_open</span>
                <div>
                  <h4 className="font-bold text-[#002112] text-lg mb-1">Open Access</h4>
                  <p className="text-[#404943] text-sm">Data that helps the ecosystem flourish shouldn't be hidden behind expensive paywalls. We democratize access to essential data.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#0f5238] text-3xl shrink-0">verified</span>
                <div>
                  <h4 className="font-bold text-[#002112] text-lg mb-1">Uncompromising Trust</h4>
                  <p className="text-[#404943] text-sm">Transparency is our default. We protect your data rigidly and moderate the community strictly to ensure high quality interactions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-[#e8ffee]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#002112] tracking-tight mb-6">
            Ready to shape the future?
          </h2>
          <p className="text-[#404943] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re validating an idea or raising your Series A, the whole ecosystem is here to support you. Join us today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-[#0f5238] text-white font-extrabold rounded-xl shadow-[0_8px_24px_rgba(15,82,56,0.2)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,82,56,0.3)] transition-all active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              href="/startups"
              className="px-8 py-4 border-2 border-[#bfc9c1] text-[#0f5238] font-bold rounded-xl hover:border-[#0f5238] hover:bg-white transition-all active:scale-95"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
