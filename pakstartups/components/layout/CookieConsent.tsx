"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if the user has already consented or declined
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem("cookie-consent", "accepted");
    // Option to initialize analytics/tracking here if needed
    setShowConsent(false);
  };

  const declineConsent = () => {
    localStorage.setItem("cookie-consent", "declined");
    // Option to disable analytics/tracking here if needed
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] p-4 font-['Plus_Jakarta_Sans'] pointer-events-none animate-in slide-in-from-bottom flex justify-center pb-4 sm:pb-6">
      <div className="w-full max-w-5xl bg-white border border-[#e0e0e0] shadow-[0_20px_60px_rgba(15,82,56,0.12)] rounded-3xl p-5 md:p-6 lg:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 relative pointer-events-auto overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d5fde2] rounded-full blur-[80px] -z-10 opacity-60 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e8ffee] rounded-full blur-[60px] -z-10 opacity-50 pointer-events-none transform -translate-x-1/2 translate-y-1/3"></div>
        
        <div className="flex-1 flex gap-4 md:gap-5 items-start z-10 w-full">
          <div className="hidden sm:flex bg-[#e8ffee] rounded-xl p-3 shadow-inner shrink-0 mt-1">
            <span className="material-symbols-outlined text-[#0f5238] text-3xl">cookie</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[#002112] font-black tracking-tight text-lg md:text-xl">
                We value your privacy
              </h3>
              <div className="sm:hidden bg-[#e8ffee] px-2 py-0.5 rounded-md self-center">
                <span className="material-symbols-outlined text-[#0f5238] text-sm align-middle">cookie</span>
              </div>
            </div>
            <p className="text-[#404943] text-sm leading-relaxed max-w-3xl pr-4 sm:pr-0">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies according to GDPR and PDPA guidelines. Read our <Link href="/privacy" className="text-[#0f5238] font-bold underline decoration-[#b1f0ce] decoration-2 underline-offset-3 hover:decoration-[#0f5238] transition-colors whitespace-nowrap">Privacy Policy</Link> for more details.
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-3 w-full md:w-auto shrink-0 justify-end md:justify-center z-10 mt-2 md:mt-0">
          <button
            onClick={declineConsent}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-white border-2 border-[#e0e0e0] text-[#707973] font-bold rounded-xl hover:bg-[#f5faf6] hover:text-[#002112] hover:border-[#bfc9c1] transition-all transform active:scale-95 text-sm whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={acceptConsent}
            className="flex-1 md:flex-initial px-8 py-2.5 bg-[#0f5238] text-white font-extrabold tracking-wide rounded-xl shadow-[0_8px_16px_rgba(15,82,56,0.2)] hover:shadow-[0_12px_24px_rgba(15,82,56,0.3)] hover:opacity-90 hover:-translate-y-0.5 transition-all transform active:scale-95 text-sm whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
        
        {/* Mobile quick close option */}
        <button 
          onClick={declineConsent}
          className="absolute top-4 right-4 sm:hidden p-1.5 bg-[#f5faf6] rounded-full text-[#707973] hover:text-[#0f5238] hover:bg-[#e8ffee] transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm font-bold block">close</span>
        </button>
      </div>
    </div>
  );
}
