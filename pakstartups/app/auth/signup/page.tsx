"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/lib/firebase/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f9f9ff]">
      {/* Left Side: Branding */}
      <section className="hidden md:flex md:w-1/2 bg-[#b7f2a0] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #0f5238 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="z-10 text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0f5238] rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span className="text-3xl font-black text-[#0f5238] tracking-tighter">PakStartups</span>
          </div>
          <div className="w-full max-w-md mb-12 bg-[#9cd686]/40 rounded-3xl aspect-[4/3] flex items-center justify-center">
            <span className="material-symbols-outlined text-[100px] text-[#0f5238] opacity-40">diversity_3</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#002112] tracking-tight leading-tight max-w-sm">
            Build Pakistan&apos;s tomorrow together.
          </h1>
        </div>
        <div className="absolute bottom-12 left-12 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0f5238]" />
          <span className="text-xs font-bold text-[#0f5238] tracking-widest uppercase">Ecosystem Portal</span>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full md:w-1/2 bg-[#f9f9ff] flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-10 md:hidden">
            <span className="material-symbols-outlined text-[#0f5238] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            <span className="text-xl font-black text-[#0f5238] tracking-tighter">PakStartups</span>
          </div>

          <header className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#151c27] tracking-tight mb-2">Join the Ecosystem</h2>
            <p className="text-[#404943] font-medium">Create your account to connect, learn, and build.</p>
          </header>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 px-5 py-4 rounded-xl border border-[#bfc9c1]/40 bg-white hover:bg-[#f0fff4] hover:border-[#0f5238]/30 transition-all shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#0f5238]/30 border-t-[#0f5238] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-[#404943] font-bold text-base">Continue with Google</span>
          </button>

          <div className="mt-8 space-y-3">
            {[
              { icon: "check_circle", text: "Free to join — no credit card required" },
              { icon: "check_circle", text: "Access co-founder matching, B2B marketplace, and events" },
              { icon: "check_circle", text: "Your data is secured via your Google account" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0f5238] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <span className="text-sm text-[#404943]">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#f5faf6] rounded-xl border border-[#d5fde2]">
            <p className="text-xs text-[#404943] text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-[#0f5238] font-bold hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[#0f5238] font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <footer className="mt-10 text-center">
            <p className="text-[#404943] text-sm font-medium">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#0f5238] font-bold ml-1 hover:underline underline-offset-4 decoration-2">Log in</Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
