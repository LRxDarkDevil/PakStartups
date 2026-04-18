export default function ReportsManagementPage() {
  const metrics = [
    { label: "Total Startups Registered", value: "1,204", growth: "+12%" },
    { label: "Active Co-Founder Matches", value: "342", growth: "+5%" },
    { label: "B2B Deals Facilitated", value: "$4.2M", growth: "+24%" },
    { label: "Community Members", value: "15.4K", growth: "+8%" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Platform Analytics</h2>
        <p className="text-[#404943] font-medium">High-level growth metrics and ecosystem reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-[#bfc9c1]/20 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#404943]">{m.label}</span>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-[#0f5238]">{m.value}</span>
                <span className="text-sm font-bold text-[#2d6a4f] bg-[#cff7dd] px-2 py-0.5 rounded-full mb-1">{m.growth}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-96 bg-[#f5fbf7] rounded-xl border border-[#bfc9c1]/20 flex flex-col items-center justify-center text-[#404943]">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">bar_chart</span>
        <p className="font-bold">Growth Chart Visualization</p>
        <p className="text-sm opacity-80">Requires integration with Recharts or Chart.js</p>
      </div>
    </div>
  );
}
