export default function SettingsPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
            <h2 className="text-2xl font-bold text-[#002112] mb-2">Public Profile</h2>
            <p className="text-[#707973] text-sm mb-8">This information will be displayed publicly on your profile.</p>

            {/* Avatar */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#b4ef9d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0f5238] text-4xl">person</span>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-sm font-bold text-[#002112] hover:bg-[#f5f5f5] transition-all">
                  Change Avatar
                </button>
                <button className="px-4 py-2 text-sm text-[#707973] hover:text-red-600 transition-colors">
                  Remove
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#404943] mb-2">Full Name</label>
                <input defaultValue="Ahmed Khan" className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#404943] mb-2">Bio</label>
                <textarea
                  defaultValue="Tech enthusiast building the next generation of fintech solutions in Lahore. Focused on financial inclusion and sustainable growth."
                  rows={3}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none resize-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#404943] mb-2">City</label>
                  <select className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none">
                    <option>Lahore</option>
                    <option>Karachi</option>
                    <option>Islamabad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#404943] mb-2">Primary Role</label>
                  <select className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#002112] focus:ring-2 focus:ring-[#0f5238]/40 focus:border-[#0f5238] outline-none">
                    <option>Founder</option>
                    <option>Freelancer</option>
                    <option>Student</option>
                    <option>Investor</option>
                  </select>
                </div>
              </div>
              <button className="bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all">
                Save Changes
              </button>
            </div>

            <div className="mt-10 pt-10 border-t border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-[#002112] mb-6">Private Information</h3>
              <div>
                <label className="block text-sm font-medium text-[#404943] mb-2">Email Address</label>
                <div className="relative">
                  <input defaultValue="ahmed.khan@pakstartups.io" readOnly className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#707973] bg-[#f9f9f9] pr-10 outline-none" />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#0f5238] text-sm">verified</span>
                </div>
                <p className="text-xs text-[#707973] mt-2">Email addresses are verified for security and cannot be changed frequently.</p>
              </div>
            </div>
    </div>
  );
}
