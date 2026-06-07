"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Mail, Lock, Dumbbell, AlertTriangle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useCart();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
        router.push("/");
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
    <main className="min-h-screen bg-black flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-glow-red relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(179,0,0,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 mb-4 flex items-center justify-center rounded-full bg-zinc-950 border border-spartan-red shadow-glow-red">
            <Dumbbell className="h-8 w-8 text-spartan-red" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-wider text-white text-center">
            Spartan <span className="text-spartan-gold">HQ Log In</span>
          </h2>
          <p className="mt-2 text-sm text-spartan-gray-text text-center font-semibold">
            Access your custom stacks and orders
          </p>
        </div>

        <div className="glass-panel-red rounded-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 relative">
          {/* Subtle red line indicator at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-spartan-red via-spartan-gold to-spartan-red rounded-t-lg" />

          {error && (
            <div className="mb-6 p-4 rounded bg-spartan-red/10 border border-spartan-red flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-spartan-red shrink-0 mt-0.5" />
              <span className="text-sm text-red-200 font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-black text-spartan-gold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-white/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="leonidas@sparta.com"
                  className="w-full bg-zinc-950 border border-white/10 hover:border-spartan-gold/45 focus:border-spartan-red focus:shadow-glow-red rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-spartan-gold uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-spartan-gold/80 hover:text-spartan-red transition-colors font-bold uppercase tracking-wider"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/40" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/10 hover:border-spartan-gold/45 focus:border-spartan-red focus:shadow-glow-red rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-spartan-red-dark via-spartan-red to-spartan-red-dark hover:shadow-glow-red text-white py-3 rounded-md font-bold text-sm uppercase tracking-wider border border-spartan-gold hover:border-spartan-gold cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-white" />
                  <span>Enter Gym / Log In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-spartan-gray-text font-semibold">
              New to the Spartan Army?{" "}
            </span>
            <Link
              href="/signup"
              className="text-xs text-spartan-gold hover:text-spartan-red font-bold uppercase tracking-wider transition-colors ml-1"
            >
              Join Army / Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
