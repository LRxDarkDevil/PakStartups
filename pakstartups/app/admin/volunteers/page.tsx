export default function VolunteerManagementPage() {
  const applicants = [
    { name: "Fatima Baloch", role: "University Ambassador", university: "LUMS", applied: "2 days ago", status: "Reviewing" },
    { name: "Hassan Raza", role: "Event Volunteer", university: "NUST", applied: "4 days ago", status: "Pending" },
    { name: "Ayesha Khan", role: "Content Writer", university: "IBA Karachi", applied: "Oct 12, 2024", status: "Approved" },
    { name: "Bilal Tariq", role: "University Ambassador", university: "FAST NUCES", applied: "Oct 10, 2024", status: "Approved" },
    { name: "Zuhra M", role: "Community Moderator", university: "Freelance", applied: "Oct 08, 2024", status: "Rejected" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Volunteer Applications</h2>
        <p className="text-[#404943] font-medium">Review and onboard student ambassadors and community volunteers.</p>
      </div>

      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Applicant Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Applied Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">University / Org</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Date Applied</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c1]/20">
              {applicants.map((app, i) => (
                <tr key={i} className="hover:bg-[#f5fbf7] transition-colors group">
                  <td className="px-6 py-4 font-bold text-[#002112]">{app.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#404943]">{app.role}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 rounded bg-[#dee4e0] text-[#002112] text-xs font-bold">{app.university}</span></td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{app.applied}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                         app.status === 'Approved' ? 'bg-[#c4ecd2]/50 text-[#2b4e3b]' : 
                         app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                         'bg-amber-100 text-amber-800'
                     }`}>
                         {app.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[#0f5238] font-bold text-xs hover:bg-[#e3eae6] px-3 py-1.5 rounded-lg transition-colors">View Profile</button>
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
