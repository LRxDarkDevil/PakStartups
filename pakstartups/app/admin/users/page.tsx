import Image from "next/image";

export default function UserManagementPage() {
  const users = [
    { name: "Ahmad Raza", email: "ahmad@paypak.pk", role: "Founder", joined: "Oct 20, 2024", status: "Active" },
    { name: "Sara Ahmed", email: "sara@healthhub.pk", role: "Founder", joined: "Oct 18, 2024", status: "Active" },
    { name: "Zain Khan", email: "zain@agrisupply.com", role: "Investor", joined: "Oct 15, 2024", status: "Pending" },
    { name: "Mariam Javed", email: "mariam.j@freelance.pk", role: "Freelancer", joined: "Oct 12, 2024", status: "Active" },
    { name: "Usman Ali", email: "usman@skillup.pk", role: "Student", joined: "Oct 10, 2024", status: "Suspended" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">User Management</h2>
        <p className="text-[#404943] font-medium">Manage all platform members, their roles, and account statuses.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-[#f5fbf7] p-4 rounded-lg border border-[#bfc9c1]/20">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#bfc9c1]/20 text-sm font-semibold hover:border-[#0f5238]/30 transition-all text-[#002112]">
            All Roles
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#bfc9c1]/20 text-sm font-semibold hover:border-[#0f5238]/30 transition-all text-[#002112]">
            Status: Active
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
        <div className="flex items-center relative w-64">
           <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943] text-sm">search</span>
           <input className="w-full bg-white border border-[#bfc9c1]/20 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#0f5238] outline-none placeholder:text-[#404943]/60 shadow-sm" placeholder="Search users by name or email" type="text" />
        </div>
      </div>

      {/* Data Table Section */}
      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">User Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Email Address</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Primary Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Joined Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c1]/20">
              {users.map((user, i) => (
                <tr key={user.email} className="hover:bg-[#f5fbf7] transition-colors group">
                  <td className="px-6 py-4">
                     <span className="font-bold text-[#002112]">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm font-medium text-[#404943]">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-[#dee4e0] text-[#002112] text-xs font-bold">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{user.joined}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                         user.status === 'Active' ? 'bg-[#c4ecd2]/50 text-[#2b4e3b]' : 
                         user.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                         'bg-red-100 text-red-800'
                     }`}>
                         {user.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#404943] hover:text-[#0f5238] p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#bfc9c1]/20 bg-[#f5fbf7]">
          <span className="text-sm text-[#404943] font-medium">1-5 of 124 users</span>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-[#e3eae6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled>
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-[#e3eae6] transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
