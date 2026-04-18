"use client";

import { useState } from "react";
import Link from "next/link";

const upcoming = [
  { date: { month: "MAY", day: "02" }, title: "SaaS Growth Masterclass", type: "WORKSHOP", location: "LUMS, Lahore · Hybrid", organizer: "Zahra Khan", attending: 142 },
  { date: { month: "MAY", day: "05" }, title: "Founder Coffee: Karachi", type: "MEETUP", location: "Coffee Wagera, Karachi", organizer: "Bilal Ahmed", attending: 45 },
  { date: { month: "MAY", day: "12" }, title: "AgriTech Demo Day", type: "DEMO", location: "Islamabad · Online", organizer: "PakStartups Lab", attending: 312 },
];

const weekDays = ["S","M","T","W","T","F","S"];
const calDays: (number | null)[] = [null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-[#002112] tracking-tight mb-3">Events & Meetups</h1>
            <p className="text-[#404943] text-lg max-w-xl">
              Weekly sessions, pitching nights, and founder meetups across Pakistan. Cultivating the next generation of digital leaders.
            </p>
          </div>
          <Link href="/events/propose" className="flex items-center gap-2 bg-[#0f5238] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            <span className="material-symbols-outlined">add</span>
            Propose an Event
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {["Upcoming", "Past Events", "Weekly Meetups"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`py-4 whitespace-nowrap transition-colors ${activeTab === tab ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238]"}`}
              >
                {tab}
              </button>
            ))}
            <Link href="/events/propose" className="py-4 text-[#404943] hover:text-[#0f5238] transition-colors whitespace-nowrap">
              Propose an Event
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "Upcoming" && (
            <>
          {/* Featured Event */}
          <div className="bg-[#0f5238] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
              🔥 THIS WEEK
            </span>
            <h2 className="text-3xl font-black mb-4">Friday Founder Pitch Night #24</h2>
            <div className="flex items-center gap-4 text-[#a8e7c5] text-sm mb-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>Friday, Apr 25 · 8:00 PM PKT</span>
            </div>
            <div className="flex gap-2 mb-6">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Online</span>
              <span className="bg-[#b4ef9d] text-[#0f5238] text-xs font-bold px-3 py-1 rounded-full">Pitching</span>
            </div>
            <p className="text-[#a8e7c5] mb-8 max-w-lg">
              Watch 5 curated startups pitch to a panel of local and international investors. Live feedback, deep dives, and virtu...
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-white text-[#0f5238] px-6 py-3 rounded-lg font-bold hover:bg-[#d5fde2] transition-all">
                RSVP Now
              </button>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["#2d6a4f","#376a28","#8FC87A"].map((c,i)=>(
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f5238]" style={{backgroundColor:c}} />
                  ))}
                </div>
                <span className="text-[#a8e7c5] text-sm">287 attending</span>
              </div>
            </div>
          </div>

          {/* More Events */}
          <h3 className="text-xl font-black text-[#002112] mb-6">More Upcoming Events</h3>
          <div className="space-y-4">
            {upcoming.map((e) => (
              <div key={e.title} className="bg-white rounded-xl p-6 flex items-center gap-6 shadow-[0_4px_24px_rgba(15,82,56,0.06)] hover:shadow-[0_8px_32px_rgba(15,82,56,0.1)] transition-all">
                <div className="bg-[#0f5238] text-white rounded-xl px-4 py-3 text-center min-w-[60px]">
                  <div className="text-xs font-bold uppercase">{e.date.month}</div>
                  <div className="text-2xl font-black">{e.date.day}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#002112]">{e.title}</span>
                    <span className="px-2 py-0.5 bg-[#d5fde2] text-[#0f5238] text-[10px] font-bold rounded uppercase">{e.type}</span>
                  </div>
                  <p className="text-[#404943] text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>{e.location}
                  </p>
                  <p className="text-[#404943] text-xs mt-1 flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-[#b4ef9d]" />
                    Organized by {e.organizer}
                  </p>
                </div>
                <div className="text-right">
                  <button className="bg-[#0f5238] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#2d6a4f] transition-all mb-1 block">RSVP</button>
                  <p className="text-xs text-[#707973]">{e.attending} attending</p>
                </div>
              </div>
            ))}
          </div>
            </>
          )}

          {activeTab === "Past Events" && (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">history</span>
              <h3 className="text-xl font-bold text-[#002112]">No Past Events</h3>
              <p className="text-[#404943] mt-2">You haven't attended or hosted any past events yet.</p>
            </div>
          )}

          {activeTab === "Weekly Meetups" && (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e0e0e0]">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c1] mb-2">groups</span>
              <h3 className="text-xl font-bold text-[#002112]">Weekly Founder Meetups</h3>
              <p className="text-[#404943] mt-2">Weekly generic networking events. Check back for Friday updates.</p>
            </div>
          )}
        </div>

        {/* Sidebar Calendar */}
        <div className="w-full md:w-72 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#002112]">April 2024</h3>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-full hover:bg-[#d5fde2] flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-7 h-7 rounded-full hover:bg-[#d5fde2] flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-[#707973]">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((d, i) => (
                <div key={i} className={`text-center text-xs py-1 rounded-full cursor-pointer transition-colors ${d === 12 ? "bg-[#0f5238] text-white font-black" : d ? "hover:bg-[#d5fde2] text-[#002112]" : ""}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
              <label className="block text-xs font-bold text-[#404943] uppercase tracking-wider mb-2">Jump to Date</label>
              <input type="text" placeholder="Select MM/YYYY" className="w-full px-3 py-2 bg-[#f5f5f5] rounded-lg text-sm outline-none" />
            </div>
          </div>

          <div className="bg-[#d5fde2] rounded-xl p-6">
            <h3 className="font-bold text-[#002112] mb-2">Host Your Own</h3>
            <p className="text-[#404943] text-sm mb-4">Have an idea for a meetup or workshop? We provide the platform, audience, and logistical support.</p>
            <Link href="/events/propose" className="text-[#0f5238] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Learn about guidelines <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
