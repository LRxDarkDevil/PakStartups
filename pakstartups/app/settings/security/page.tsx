"use client";

export default function SecurityPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Security Settings</h2>
      <p className="text-[#707973] text-sm mb-8">Manage your password and secure your account.</p>

      <div className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-[#404943] mb-2">Current Password</label>
          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#404943] mb-2">New Password</label>
          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#404943] mb-2">Confirm New Password</label>
          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
        </div>
        
        <div className="pt-4">
            <button className="bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
            Update Password
            </button>
        </div>

        <div className="mt-10 pt-10 border-t border-[#e0e0e0]">
            <h3 className="text-lg font-bold text-[#002112] mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 border border-[#bfc9c1] rounded-xl bg-[#f9f9f9]">
                <div>
                    <h4 className="font-bold text-[#002112]">Authenticator App</h4>
                    <p className="text-sm text-[#707973]">Use Google Authenticator or Authy to generate one time security codes.</p>
                </div>
                <button className="px-4 py-2 border border-[#0f5238] text-[#0f5238] rounded-lg text-sm font-bold hover:bg-[#e8ffee] transition-all">
                    Enable
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
