import Image from "next/image";

export default function BlogManagementPage() {
  const posts = [
    { title: "The Ultimate Guide to Series A", author: "Ahmad Raza", category: "Guides", submitted: "2 hours ago", status: "Pending" },
    { title: "Building HealthHub: A Founder Journey", author: "Sara Ahmed", category: "Founder Journeys", submitted: "1 day ago", status: "Pending" },
    { title: "Q3 Agritech Market Report", author: "Admin", category: "Intelligence", submitted: "Oct 15, 2024", status: "Published" },
    { title: "How to validate your MVP", author: "Mariam Javed", category: "Lessons Learned", submitted: "Oct 14, 2024", status: "Published" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Blog & Stories Review</h2>
        <p className="text-[#404943] font-medium">Review and approve community submitted founder stories and market reports.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-[#f5fbf7] p-4 rounded-lg border border-[#bfc9c1]/20">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#bfc9c1]/20 text-sm font-semibold hover:border-[#0f5238]/30 transition-all text-[#002112]">
            Filter: Pending Review
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
        <button className="bg-[#0f5238] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#2d6a4f] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Draft New Post
        </button>
      </div>

      {/* Data Table Section */}
      <div className="overflow-hidden bg-white border border-[#bfc9c1]/20 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f5fbf7] border-b border-[#bfc9c1]/20">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Post Title</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Author</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Submitted</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#404943] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c1]/20">
              {posts.map((post, i) => (
                <tr key={i} className="hover:bg-[#f5fbf7] transition-colors group">
                  <td className="px-6 py-4">
                     <span className="font-bold text-[#002112] line-clamp-1">{post.title}</span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm font-medium text-[#404943]">{post.author}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-[#dee4e0] text-[#002112] text-xs font-bold">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#404943]">{post.submitted}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                         post.status === 'Published' ? 'bg-[#c4ecd2]/50 text-[#2b4e3b]' : 
                         'bg-amber-100 text-amber-800'
                     }`}>
                         {post.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {post.status === 'Pending' && (
                            <>
                                <button className="bg-[#0f5238] text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-[#2d6a4f] transition-colors">Review</button>
                                <button className="border border-[#bfc9c1]/50 text-[#404943] px-3 py-1 rounded-md text-xs font-bold hover:bg-[#e3eae6] transition-colors">Reject</button>
                            </>
                        )}
                        {post.status === 'Published' && (
                            <button className="text-[#404943] hover:text-[#0f5238] p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>
                        )}
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
