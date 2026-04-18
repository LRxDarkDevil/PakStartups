import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Platform: [
    { label: "Startup Directory", href: "/startups" },
    { label: "Co-Founder Matching", href: "/match" },
    { label: "B2B Marketplace", href: "/b2b" },
    { label: "Ecosystem Map", href: "/ecosystem" },
    { label: "Startup Directory", href: "/startups" },
  ],
  Community: [
    { label: "Reddit", href: "https://reddit.com/r/PakStartups" },
    { label: "Discord", href: "#" },
    { label: "Events & Meetups", href: "/events" },
    { label: "Success Stories", href: "/blog" },
    { label: "Volunteer", href: "/volunteer" },
  ],
  Resources: [
    { label: "Knowledge Hub", href: "/knowledge" },
    { label: "Legal Templates", href: "/knowledge" },
    { label: "Blog & Insights", href: "/blog" },
    { label: "Idea Validation", href: "/ideas" },
    { label: "About Us", href: "/about" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#d5fde2] w-full rounded-t-[32px] mt-20 font-['Plus_Jakarta_Sans']">
      <div className="max-w-8xl mx-auto px-8 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4 active:scale-95 transition-transform">
              <Image
                src="/logo.png"
                alt="PakStartups Logo"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#2d6a4f] leading-relaxed mb-8">
              Building the definitive platform for Pakistan&apos;s entrepreneurial ecosystem through data, community, and capital.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              <a href="https://reddit.com/r/PakStartups" aria-label="Reddit" className="text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
                <span className="material-symbols-outlined">forum</span>
              </a>
              <a href="#" aria-label="Discord" className="text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
                <span className="material-symbols-outlined">chat</span>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a href="#" aria-label="Twitter" className="text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-black text-[#0f5238] mb-6 uppercase tracking-widest">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.slice(0, 4).map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#2d6a4f] hover:text-[#0f5238] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#bfc9c1]/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#2d6a4f] uppercase tracking-widest">
            © 2024 PakStartups. Cultivating the next generation of founders.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-xs text-[#2d6a4f] hover:text-[#0f5238] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
