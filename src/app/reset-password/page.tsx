"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordWithToken } from "@/app/actions/userActions";
import { Lock, Dumbbell, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("No password reset token was provided. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordWithToken(token, password);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel-red rounded-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 relative">
      {/* Subtle red line indicator at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-spartan-red via-spartan-gold to-spartan-red rounded-t-lg" />

      {error && (
        <div className="mb-6 p-4 rounded bg-spartan-red/10 border border-spartan-red flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-spartan-red shrink-0 mt-0.5" />
          <span className="text-sm text-red-200 font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded bg-green-950/20 border border-green-500/50 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <span className="text-sm text-green-200 font-semibold">
            Your password has been successfully reset.
          </span>
        </div>
      )}

      {!token && (
        <div className="text-center py-4">
          <AlertTriangle className="h-12 w-12 text-spartan-red mx-auto mb-4" />
          <p className="text-sm text-spartan-gray-text mb-6">
            This password reset link is invalid or has expired. Please request a new recovery email.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-xs text-spartan-gold hover:text-spartan-red font-bold uppercase tracking-wider transition-colors"
          >
            <span>Request Reset Link</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {token && !success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-xs font-black text-spartan-gold uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-white/10 hover:border-spartan-gold/45 focus:border-spartan-red focus:shadow-glow-red rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-black text-spartan-gold uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-white/10 hover:border-spartan-gold/45 focus:border-spartan-red focus:shadow-glow-red rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
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
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Reset Password / Update</span>
            )}
          </button>
        </form>
      )}

      {success && (
        <div className="text-center pt-2">
          <p className="text-sm text-spartan-gray-text mb-6">
            Your credentials have been successfully updated. You can now log into your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs text-spartan-gold hover:text-spartan-red font-bold uppercase tracking-wider transition-colors"
          >
            <span>Proceed to Log In</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
            Reset <span className="text-spartan-gold">Your Password</span>
          </h2>
          <p className="mt-2 text-sm text-spartan-gray-text text-center font-semibold">
            Establish your new Spartan HQ login credentials
          </p>
        </div>

        <Suspense
          fallback={
            <div className="glass-panel rounded-lg p-8 border border-white/5 text-center flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-spartan-red mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-spartan-gray-text">Loading secure reset forms...</p>
            </div>
          }
        >
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </main>
  );
}
