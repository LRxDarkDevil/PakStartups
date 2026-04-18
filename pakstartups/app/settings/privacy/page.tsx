"use client";

export default function PrivacyPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Privacy & Visibility</h2>
      <p className="text-[#707973] text-sm mb-8">Control who can see your profile and activity across the ecosystem.</p>

      <div className="space-y-6 max-w-2xl">
        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Profile Visibility</h4>
                <p className="text-sm text-[#707973]">Make your profile discoverable in the Co-Founder match directory.</p>
            </div>
            <select className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-[#002112] font-semibold focus:ring-2 focus:ring-[#0f5238]/40 outline-none">
                <option>Public</option>
                <option>Platform Members Only</option>
                <option>Private</option>
            </select>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-[#e0e0e0]">
            <div>
                <h4 className="font-bold text-[#002112]">Show Email Address</h4>
                <p className="text-sm text-[#707973]">Allow other users to see your email address on your profile page.</p>
            </div>
            <select className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-[#002112] font-semibold focus:ring-2 focus:ring-[#0f5238]/40 outline-none">
                <option>Hidden</option>
                <option>Visible to Connections</option>
                <option>Public</option>
            </select>
        </div>

        <div className="pt-4">
            <button className="bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            Save Privacy Settings
            </button>
        </div>
      </div>
    </div>
  );
}
