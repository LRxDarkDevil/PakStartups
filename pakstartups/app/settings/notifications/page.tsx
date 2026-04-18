"use client";

export default function NotificationsPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Notifications & Alerts</h2>
      <p className="text-[#707973] text-sm mb-8">Choose what you want to be notified about.</p>

      <div className="space-y-6">
        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Email Notifications</h4>
                <p className="text-sm text-[#707973]">Receive daily digests and important platform announcements.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5238]"></div>
            </label>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Co-Founder Match Alerts</h4>
                <p className="text-sm text-[#707973]">Get notified immediately when someone requests to connect with you.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5238]"></div>
            </label>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">B2B Marketplace Matches</h4>
                <p className="text-sm text-[#707973]">Weekly summary of demands or solutions that match your skills.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5238]"></div>
            </label>
        </div>

      </div>
    </div>
  );
}
