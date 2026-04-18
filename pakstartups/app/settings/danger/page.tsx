"use client";

export default function DangerZonePage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)] border border-red-100">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h2>
      <p className="text-[#707973] text-sm mb-8">Irreversible actions regarding your data and account.</p>

      <div className="space-y-6 max-w-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-red-200 rounded-xl bg-red-50/50 gap-4">
            <div>
                <h4 className="font-bold text-red-700">Export Account Data</h4>
                <p className="text-sm text-red-600/80 mt-1">Download a copy of all your submitted startups, connections, and platform activity in JSON format.</p>
            </div>
            <button className="whitespace-nowrap px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-50 transition-all">
                Request Data Export
            </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-red-200 rounded-xl bg-red-50/50 gap-4">
            <div>
                <h4 className="font-bold text-red-700">Delete Account & Data</h4>
                <p className="text-sm text-red-600/80 mt-1">Permanently remove your personal account and all of its contents from the PakStartups ecosystem. This action is not reversible.</p>
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition-all">
                Delete Account
            </button>
        </div>
      </div>
    </div>
  );
}
