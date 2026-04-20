"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code;
      if (msg === "auth/invalid-credential" || msg === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (msg === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f9f9ff]">
      {/* Left side branding */}
      <section className="hidden md:flex md:w-1/2 bg-[#b7f2a0] items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #0f5238 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="z-10 text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0f5238] rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span className="text-3xl font-black text-[#0f5238] tracking-tighter">PakStartups</span>
          </div>
          <div className="w-full max-w-md mb-12 bg-[#9cd686]/40 rounded-3xl aspect-[4/3] flex items-center justify-center">
            <span className="material-symbols-outlined text-[100px] text-[#0f5238] opacity-40">account_circle</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#002112] tracking-tight leading-tight max-w-sm">
            Welcome back, founder.
          </h1>
        </div>
        <div className="absolute bottom-12 left-12 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0f5238]" />
          <span className="text-xs font-bold text-[#0f5238] tracking-widest uppercase">Ecosystem Portal</span>
        </div>
      </section>

      {/* Right side form */}
      <section className="w-full md:w-1/2 bg-[#f9f9ff] flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-10 md:hidden">
            <span className="material-symbols-outlined text-[#0f5238] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            <span className="text-xl font-black text-[#0f5238] tracking-tighter">PakStartups</span>
          </div>

          <header className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#151c27] tracking-tight mb-2">Sign In</h2>
            <p className="text-[#404943] font-medium">Access your PakStartups account.</p>
          </header>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Social Auth */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-start px-5 py-3 rounded-lg border border-[#bfc9c1]/40 bg-white hover:bg-[#f0fff4] transition-colors disabled:opacity-60"
            >
              <svg className="w-5 h-5 mr-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[#404943] font-bold text-sm">Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-[#bfc9c1] opacity-30" />
            <span className="flex-shrink mx-4 text-xs font-bold text-[#707973] uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-[#bfc9c1] opacity-30" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#404943] mb-2 ml-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-[#F4FAF6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238] focus:bg-white transition-all text-[#151c27] placeholder:text-[#707973]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#404943] mb-2 ml-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#F4FAF6] border-none rounded-lg focus:ring-2 focus:ring-[#0f5238] focus:bg-white transition-all text-[#151c27] placeholder:text-[#707973]/50 outline-none"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707973] hover:text-[#0f5238]">
                  <span className="material-symbols-outlined text-lg">{showPw ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/support" className="text-xs text-[#0f5238] font-bold hover:underline">Forgot password?</Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-[#0f5238] to-[#2d6a4f] text-white font-bold rounded-lg shadow-xl shadow-[#0f5238]/10 hover:shadow-[#0f5238]/20 active:scale-[0.98] transition-all mt-4 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing In...</>
              ) : "Sign In"}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-[#404943] text-sm font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[#0f5238] font-bold ml-1 hover:underline underline-offset-4 decoration-2">
                Join Now
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
