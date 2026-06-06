'use client';

import { useActionState, useState, useEffect } from 'react';
import { loginAdmin, verify2FACodeAction } from './actions';
import { Lock, Mail, ShieldAlert, Loader2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  
  // Login form action state
  const [loginState, loginAction, loginPending] = useActionState(loginAdmin, null);
  
  // 2FA form action state
  const [verifyState, verifyAction, verifyPending] = useActionState(verify2FACodeAction, null);
  
  // Local state to manage 2FA step transition
  const [requires2FA, setRequires2FA] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Watch login action for requiring 2FA transition
  useEffect(() => {
    if (loginState && loginState.success && loginState.requires2FA && loginState.email) {
      setRequires2FA(true);
      setAdminEmail(loginState.email);
    }
  }, [loginState]);

  // Watch verification action for redirection/refresh upon success
  useEffect(() => {
    if (verifyState && verifyState.success && verifyState.authenticated) {
      router.refresh();
    }
  }, [verifyState, router]);

  // Go back to credentials login phase
  const handleBackToLogin = () => {
    setRequires2FA(false);
    setTwoFactorCode('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden">
      {/* Background radial glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
      
      {/* Decorative floating grids/particles */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Subtle decorative gold/red top-bar for premium feel */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[3px] bg-gradient-to-r from-transparent ${requires2FA ? 'via-spartan-gold' : 'via-spartan-red'} to-transparent rounded-full z-10 transition-all duration-500`} />

        <div className="glass-panel-red p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl bg-neutral-950/90 border border-spartan-red/25">
          
          {!requires2FA ? (
            /* --- PHASE 1: EMAIL & PASSWORD LOGIN --- */
            <>
              {/* Header section */}
              <div className="flex flex-col items-center mb-8 text-center">
                {/* Spartan Shield Icon Overlay */}
                <div className="w-16 h-16 rounded-full border border-spartan-red/40 bg-neutral-900 flex items-center justify-center mb-4 shadow-glow-red relative group">
                  <div className="absolute inset-0 rounded-full bg-spartan-red/10 animate-ping opacity-50" />
                  <svg 
                    className="w-8 h-8 text-spartan-red group-hover:text-spartan-gold transition-colors duration-300"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                
                <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-display">
                  Spartan Armory
                </h1>
                <p className="text-xs tracking-wider text-spartan-gold uppercase mt-1">
                  Admin Access Terminal
                </p>
              </div>

              {/* Form */}
              <form action={loginAction} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="admin@spartan.supplements"
                      disabled={loginPending}
                      className="block w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-spartan-red focus:ring-1 focus:ring-spartan-red/50 transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••••••"
                      disabled={loginPending}
                      className="block w-full pl-10 pr-10 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-spartan-red focus:ring-1 focus:ring-spartan-red/50 transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loginPending}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {loginState && !loginState.success && loginState.error && (
                  <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-900/60 rounded-lg text-red-200 text-xs leading-relaxed">
                    <ShieldAlert className="h-4 w-4 text-spartan-red shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5 text-spartan-red uppercase tracking-wider">Authentication Error</span>
                      {loginState.error}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginPending}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-spartan-red to-spartan-red-dark hover:from-spartan-red-dark hover:to-spartan-red text-white text-sm font-semibold tracking-widest uppercase rounded-lg shadow-glow-red hover:shadow-glow-red-heavy focus:outline-none transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loginPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>Verify Identity</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* --- PHASE 2: 2-FACTOR CODE VERIFICATION --- */
            <>
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={verifyPending}
                className="absolute top-4 left-4 p-1.5 rounded-lg border border-neutral-900 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider cursor-pointer"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back</span>
              </button>

              {/* Header section */}
              <div className="flex flex-col items-center mb-8 text-center pt-2">
                {/* 2FA Shield check icon */}
                <div className="w-16 h-16 rounded-full border border-spartan-gold/40 bg-neutral-900 flex items-center justify-center mb-4 shadow-glow-gold relative group">
                  <div className="absolute inset-0 rounded-full bg-spartan-gold/10 animate-ping opacity-30" />
                  <ShieldCheck className="w-8 h-8 text-spartan-gold" />
                </div>
                
                <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-display">
                  Secure Verification
                </h1>
                <p className="text-xs tracking-wider text-spartan-gold uppercase mt-1">
                  2FA Passcode Required
                </p>
                <p className="text-[10px] text-neutral-400 max-w-[280px] mt-3 leading-relaxed">
                  We have dispatched a 6-digit numeric verification code to your registered email: 
                  <span className="block font-semibold text-spartan-gold mt-1 font-mono">lasithjayawardana4@gmail.com</span>
                </p>
              </div>

              {/* Form */}
              <form action={verifyAction} className="space-y-6">
                {/* Hidden email parameter */}
                <input type="hidden" name="email" value={adminEmail} />

                {/* Verification Code Input */}
                <div className="space-y-2">
                  <label htmlFor="code" className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase text-center">
                    Enter 6-Digit Passcode
                  </label>
                  <div className="relative max-w-[200px] mx-auto">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="000000"
                      disabled={verifyPending}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                      className="block w-full py-3.5 bg-neutral-950 border border-neutral-800 rounded-lg text-2xl font-bold tracking-[8px] text-center text-white placeholder-neutral-800 focus:outline-none focus:border-spartan-gold focus:ring-1 focus:ring-spartan-gold/50 transition-all duration-300 disabled:opacity-50 font-mono"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {verifyState && !verifyState.success && verifyState.error && (
                  <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-900/60 rounded-lg text-red-200 text-xs leading-relaxed">
                    <ShieldAlert className="h-4 w-4 text-spartan-red shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5 text-spartan-red uppercase tracking-wider">Verification Failure</span>
                      {verifyState.error}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={verifyPending || twoFactorCode.length < 6}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-spartan-gold to-yellow-600 hover:from-yellow-600 hover:to-spartan-gold text-black text-sm font-bold tracking-widest uppercase rounded-lg shadow-glow-gold hover:scale-[1.01] focus:outline-none transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
                >
                  {verifyPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Passcode...</span>
                    </>
                  ) : (
                    <span>Unlock Terminal</span>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Footer branding */}
          <div className="mt-8 pt-6 border-t border-neutral-900 text-center text-[10px] tracking-wider text-neutral-600 uppercase">
            SECURE SYSTEM &bull; FOR AUTHORIZED SPARTANS ONLY
          </div>
        </div>
      </div>
    </div>
  );
}
