"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";

const PRIMARY_SKILLS = ["Product Management", "Full-Stack Dev", "UI/UX Design", "Growth Marketing", "B2B Sales"];
const INDUSTRIES = ["FinTech", "EdTech", "HealthTech", "AgriTech", "SaaS", "E-Commerce", "Logistics", "AI/ML"];

export default function SkillsPage() {
  const { user, profile } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  useEffect(() => {
    setSkills(profile?.skills ?? []);
    setInterests(profile?.interests ?? []);
  }, [profile]);

  const toggle = (value: string, list: string[], setter: (next: string[]) => void, limit = 6) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }
    if (list.length >= limit) return;
    setter([...list, value]);
  };

  const handleAddCustom = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setCustomSkill("");
      setShowCustomInput(false);
      return;
    }
    if (skills.length >= 6) {
      alert("You can select up to 6 skills.");
      return;
    }
    setSkills([...skills, trimmed]);
    setCustomSkill("");
    setShowCustomInput(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        skills,
        interests,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Skills & Interests</h2>
      <p className="text-[#707973] text-sm mb-8">Select tags to improve your startup and co-founder matchmaking.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-[#404943] mb-3">Primary Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button key={skill} type="button" onClick={() => toggle(skill, skills, setSkills)} className={`px-4 py-2 border rounded-lg text-sm font-bold transition-all ${skills.includes(skill) ? "border-[#0f5238] bg-[#e8ffee] text-[#0f5238]" : "border-[#bfc9c1] text-[#404943] hover:border-[#0f5238]/50"}`}>
                {skill}
              </button>
            ))}
            {/* Show other primary skills not selected yet */}
            {PRIMARY_SKILLS.filter(s => !skills.includes(s)).map((skill) => (
              <button key={skill} type="button" onClick={() => toggle(skill, skills, setSkills)} className={`px-4 py-2 border rounded-lg text-sm font-bold transition-all border-[#bfc9c1] text-[#404943] hover:border-[#0f5238]/50`}>
                {skill}
              </button>
            ))}
            {showCustomInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Type a skill..."
                  className="px-3 py-1.5 border border-[#0f5238] rounded-lg text-sm outline-none text-[#002112]"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustom(); } }}
                  autoFocus
                />
                <button type="button" onClick={handleAddCustom} className="px-3 py-1.5 bg-[#0f5238] text-white rounded-lg text-sm font-bold hover:bg-[#2d6a4f] transition-all">Add</button>
                <button type="button" onClick={() => setShowCustomInput(false)} className="px-3 py-1.5 border border-[#bfc9c1] rounded-lg text-sm font-medium text-[#707973] hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            ) : (
              <button type="button" onClick={() => setShowCustomInput(true)} className="px-4 py-2 border border-dashed border-[#bfc9c1] rounded-lg text-sm font-bold text-[#707973] hover:text-[#0f5238] hover:border-[#0f5238] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">add</span> Add Skill
              </button>
            )}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-[#404943] mb-3">Industry Interests</label>
           <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <button key={ind} type="button" onClick={() => toggle(ind, interests, setInterests)} className={`px-4 py-2 border rounded-full text-sm transition-all ${interests.includes(ind) ? "border-[#0f5238] bg-[#0f5238] text-white" : "border-[#bfc9c1] text-[#404943] hover:border-[#0f5238]/50"}`}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => void handleSave()} disabled={saving} className="bg-[#0f5238] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d6a4f] transition-all mt-4 disabled:opacity-60">
          {saved ? "Saved!" : saving ? "Saving…" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
