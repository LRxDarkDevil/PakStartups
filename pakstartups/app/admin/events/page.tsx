export default function EventsManagementPage() {
  const events = [
    { name: "Founder Mixer Lahore", host: "NIC Lahore", date: "Oct 30, 2024", attendees: 120, status: "Approved" },
    { name: "SaaS Scaling Masterclass", host: "Ahmad Raza", date: "Nov 05, 2024", attendees: 45, status: "Reviewing" },
    { name: "Karachi Tech Ignite", host: "The Nest I/O", date: "Nov 12, 2024", attendees: 300, status: "Pending" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Events Management</h2>
        <p className="text-[#404943] font-medium">Review community event proposals and manage upcoming mixers.</p>
      </div>

      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Event Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Host / Organizer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Target Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Expected Attendees</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c1]/20">
              {events.map((ev, i) => (
                <tr key={i} className="hover:bg-[#f5fbf7] transition-colors group">
                  <td className="px-6 py-4 font-bold text-[#002112]">{ev.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#404943]">{ev.host}</td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{ev.date}</td>
                  <td className="px-6 py-4 font-bold text-[#0f5238]">{ev.attendees}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                         ev.status === 'Approved' ? 'bg-[#c4ecd2]/50 text-[#2b4e3b]' : 
                         'bg-amber-100 text-amber-800'
                     }`}>
                         {ev.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[#0f5238] font-bold text-xs hover:bg-[#e3eae6] px-3 py-1.5 rounded-lg transition-colors">Manage</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
