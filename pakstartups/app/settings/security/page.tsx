"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function SecurityPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,82,56,0.06)]">
      <h2 className="text-2xl font-bold text-[#002112] mb-2">Security Settings</h2>
      <p className="text-[#707973] text-sm mb-8">Your account is secured via Google Sign-In.</p>

      {/* Google account info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4 mb-8">
        <span className="material-symbols-outlined text-blue-600 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <div>
          <p className="font-bold text-blue-800">Signed in with Google</p>
          <p className="text-sm text-blue-700 mt-1">
            Your account is managed by Google. To change your password, update your recovery options, or enable 2FA, visit your{" "}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-blue-900"
            >
              Google Account Security settings
            </a>.
          </p>
        </div>
      </div>

      {/* Account info */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#002112]">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#f5faf6] border border-[#e0e0e0]">
            <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-1">Email Address</p>
            <p className="font-bold text-[#002112]">{user?.email ?? "—"}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#f5faf6] border border-[#e0e0e0]">
            <p className="text-xs font-bold text-[#707973] uppercase tracking-widest mb-1">Sign-In Method</p>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-bold text-[#002112]">Google</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security tips */}
      <div className="mt-10 pt-8 border-t border-[#e0e0e0]">
        <h3 className="text-lg font-bold text-[#002112] mb-4">Security Recommendations</h3>
        <div className="space-y-3">
          {[
            { icon: "lock", text: "Use a strong, unique password for your Google account" },
            { icon: "phone_iphone", text: "Enable 2-Step Verification on your Google Account for extra protection" },
            { icon: "devices", text: "Regularly review devices signed in to your Google Account" },
            { icon: "logout", text: "Sign out from shared or public devices after use" },
          ].map((tip) => (
            <div key={tip.text} className="flex items-center gap-3 p-3 rounded-lg bg-[#f5faf6]">
              <span className="material-symbols-outlined text-[#0f5238] text-lg">{tip.icon}</span>
              <span className="text-sm text-[#404943]">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
