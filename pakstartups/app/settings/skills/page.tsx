"use client";

export default function SkillsPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Skills & Interests</h2>
      <p className="text-[#707973] text-sm mb-8">Select tags to improve your startup and co-founder matchmaking.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-[#404943] mb-3">Primary Skills</label>
          <div className="flex flex-wrap gap-2">
            {["Product Management", "Full-Stack Dev", "UI/UX Design", "Growth Marketing", "B2B Sales"].map((skill, i) => (
              <button key={skill} className={`px-4 py-2 border rounded-lg text-sm font-bold transition-all ${i < 3 ? 'border-[#0f5238] bg-[#e8ffee] text-[#0f5238]' : 'border-[#bfc9c1] text-[#404943] hover:border-[#0f5238]/50'}`}>
                {skill}
              </button>
            ))}
            <button className="px-4 py-2 border border-dashed border-[#bfc9c1] rounded-lg text-sm font-bold text-[#707973] hover:text-[#0f5238] hover:border-[#0f5238] transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">add</span> Add Skill
            </button>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-[#404943] mb-3">Industry Interests</label>
           <div className="flex flex-wrap gap-2">
            {["FinTech", "EdTech", "HealthTech", "AgriTech", "SaaS", "E-Commerce", "Logistics", "AI/ML"].map((ind, i) => (
              <button key={ind} className={`px-4 py-2 border rounded-full text-sm transition-all ${i === 0 || i === 4 || i === 7 ? 'border-[#0f5238] bg-[#0f5238] text-white' : 'border-[#bfc9c1] text-[#404943] hover:border-[#0f5238]/50'}`}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        <button className="bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all mt-4">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
