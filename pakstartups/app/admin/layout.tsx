import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5fbf7]">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-[#dee4e0]/80 backdrop-blur-xl border-b border-[#bfc9c1]/20">
        <div className="flex-1 flex items-center gap-6">
          <Link href="/admin" className="font-bold text-[#0f5238] uppercase tracking-widest text-lg hover:opacity-80 transition-opacity">
            PakStartups Admin
          </Link>
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943] text-lg">search</span>
            <input className="w-full bg-[#dee4e0] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0f5238] outline-none placeholder:text-[#404943]/60" placeholder="Search startups, applicants..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#0f5238] border border-[#0f5238]/20 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#b1f0ce] transition-colors">
            Export Data
          </button>
          <div className="flex items-center gap-4 text-[#404943]">
            <button className="p-1 hover:bg-[#e3eae6] rounded-full transition-colors hidden sm:block">
              <span className="material-symbols-outlined hover:text-[#0f5238]">notifications</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-[#2d6a4f] overflow-hidden ring-2 ring-[#f5fbf7] cursor-pointer hover:ring-[#b1f0ce] transition-all">
              <Image width={32} height={32} src="/images/image-048.jpg" alt="Admin info" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
        {/* SideNavBar */}
        <aside className="w-64 border-r border-[#bfc9c1]/20 flex flex-col pt-8 pb-6 px-4 hidden lg:flex bg-white">
          <nav className="flex-1 space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6] transition-colors font-semibold tracking-tight">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Overview / Queue</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6] transition-colors font-semibold tracking-tight">
              <span className="material-symbols-outlined">group</span>
              <span>User Management</span>
            </Link>
            <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6] transition-colors font-semibold tracking-tight">
              <span className="material-symbols-outlined">article</span>
              <span>Blog & Stories</span>
            </Link>
            <Link href="/admin/volunteers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6] transition-colors font-semibold tracking-tight">
              <span className="material-symbols-outlined">volunteer_activism</span>
              <span>Volunteer Apps</span>
            </Link>
            <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6] transition-colors font-semibold tracking-tight">
              <span className="material-symbols-outlined">event</span>
              <span>Events Mgt.</span>
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6] transition-colors font-semibold tracking-tight h-full">
              <span className="material-symbols-outlined">description</span>
              <span>Reports</span>
            </Link>
          </nav>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 w-full bg-white relative">
          {children}
        </main>
      </div>
    </div>
  );
}
