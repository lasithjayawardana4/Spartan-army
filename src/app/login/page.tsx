"use client";
 
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Mail, Lock, AlertTriangle, ShieldCheck } from "lucide-react";
 
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useCart();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get("redirect") || "/";
 
  React.useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
 
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
 
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center py-8 px-4 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(179,0,0,0.18)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,55,0.07)_0%,transparent_70%)]" />
      </div>

      <div className="w-full max-w-sm z-10">

        {/* Brand Logo Block */}
        <div className="flex flex-col items-center mb-7">
          {/* Logo with clean backglow */}
          <div className="relative h-24 w-24 flex items-center justify-center mb-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.55)_0%,transparent_70%)] rounded-full filter blur-md pointer-events-none" />
            <img
              src="/images/spartan_logo.png"
              alt="Spartan Supplements"
              className="h-24 w-24 object-contain filter drop-shadow-[0_0_12px_rgba(179,0,0,0.95)] drop-shadow-[0_0_3px_rgba(255,255,255,0.45)]"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white text-center leading-tight">
            SPARTAN <span className="text-spartan-gold">HQ LOG IN</span>
          </h1>
          <p className="mt-1.5 text-xs text-white/50 text-center font-semibold uppercase tracking-widest">
            Access your stacks &amp; orders
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel-red rounded-xl px-5 py-6 sm:px-8 sm:py-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/8 relative">
          {/* Red/gold gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-spartan-red via-spartan-gold to-spartan-red rounded-t-xl" />

          {/* Error message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-spartan-red/10 border border-spartan-red/50 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-spartan-red shrink-0 mt-0.5" />
              <span className="text-xs text-red-200 font-semibold leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-spartan-gold uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-white/35" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="leonidas@sparta.com"
                  className="w-full bg-black/60 border border-white/10 hover:border-spartan-gold/40 focus:border-spartan-red focus:shadow-[0_0_10px_rgba(179,0,0,0.3)] rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-black text-spartan-gold uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-spartan-gold/70 hover:text-spartan-red transition-colors font-bold uppercase tracking-wider"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/35" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/10 hover:border-spartan-gold/40 focus:border-spartan-red focus:shadow-[0_0_10px_rgba(179,0,0,0.3)] rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-spartan-red-dark via-spartan-red to-spartan-red-dark hover:shadow-[0_0_25px_rgba(179,0,0,0.6)] text-white py-3.5 rounded-lg font-black text-sm uppercase tracking-widest border border-spartan-red/50 hover:border-spartan-gold cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Enter Gym / Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-5 text-center">
            <span className="text-xs text-white/40 font-semibold">
              New to the Spartan Army?{" "}
            </span>
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-xs text-spartan-gold hover:text-spartan-red font-black uppercase tracking-wider transition-colors"
            >
              Join Army / Sign Up
            </Link>
          </div>
        </div>
 
        {/* Back to home link */}
        <p className="text-center mt-4">
          <Link href="/" className="text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
            ← Back to Spartan Armory
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
