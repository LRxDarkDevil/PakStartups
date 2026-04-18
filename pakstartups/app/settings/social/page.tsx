"use client";

export default function SocialAccountsPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Social Accounts</h2>
      <p className="text-[#707973] text-sm mb-8">Link your social profiles to build trust within the community.</p>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-[#bfc9c1] rounded-xl">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0077b5] rounded-lg flex items-center justify-center text-white font-bold">in</div>
                <div>
                    <h4 className="font-bold text-[#002112]">LinkedIn</h4>
                    <p className="text-sm text-[#707973]">Not connected</p>
                </div>
            </div>
            <button className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-sm font-bold text-[#002112] hover:bg-[#f5f5f5] transition-all">
                Connect
            </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-[#bfc9c1] rounded-xl">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center text-white font-bold">
                    <span className="material-symbols-outlined">code</span>
                </div>
                <div>
                    <h4 className="font-bold text-[#002112]">GitHub</h4>
                    <p className="text-sm text-[#707973]">Connected as @ahmadraza</p>
                </div>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-all">
                Disconnect
            </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-[#bfc9c1] rounded-xl">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">𝕏</div>
                <div>
                    <h4 className="font-bold text-[#002112]">X (Twitter)</h4>
                    <p className="text-sm text-[#707973]">Not connected</p>
                </div>
            </div>
            <button className="px-4 py-2 border border-[#bfc9c1] rounded-lg text-sm font-bold text-[#002112] hover:bg-[#f5f5f5] transition-all">
                Connect
            </button>
        </div>
      </div>
    </div>
  );
}
