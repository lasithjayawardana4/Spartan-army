'use client';

import { useTransition } from 'react';
import { logoutAdmin } from './actions';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Activity, 
  LogOut, 
  Terminal, 
  Wrench, 
  Cpu,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  email: string;
}

export default function AdminDashboard({ email }: AdminDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logoutAdmin();
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-spartan-red selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-spartan-red/40 flex items-center justify-center bg-neutral-900 shadow-glow-red">
              <svg className="w-4 h-4 text-spartan-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <span className="font-bold tracking-widest text-sm uppercase font-display block">Spartan Armory</span>
              <span className="text-[10px] tracking-wider text-spartan-gold uppercase block -mt-1">Control Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-neutral-400">Authenticated Agent</span>
              <span className="text-xs font-semibold text-spartan-gold">{email}</span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-spartan-red/40 text-xs text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5 text-spartan-red" />
              )}
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Under Development Banner */}
        <div className="glass-panel-gold p-6 rounded-2xl bg-neutral-950/80 border border-spartan-gold/20 flex flex-col md:flex-row gap-5 items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.06)_0%,rgba(0,0,0,0)_75%)] pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-spartan-gold/10 border border-spartan-gold/30 flex items-center justify-center text-spartan-gold shrink-0">
              <Wrench className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold uppercase font-display text-white">System Under Construction</h2>
                <span className="px-2 py-0.5 rounded bg-spartan-gold/20 border border-spartan-gold/40 text-[9px] font-semibold text-spartan-gold uppercase tracking-wider animate-pulse">
                  Development Mode
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Database client successfully connected. Awaiting further instruction packages to integrate schema bindings.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Mock Gross Revenue</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">$24,850.50</h3>
              </div>
              <span className="p-2 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">+18.2%</span>
              <span>from previous session</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Active Orders</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">42</h3>
              </div>
              <span className="p-2 rounded bg-spartan-red/10 border border-spartan-red/25 text-spartan-red">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-spartan-red font-semibold">12 pending</span>
              <span>fulfillment queue</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Registered Spartans</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">1,284</h3>
              </div>
              <span className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-spartan-gold font-semibold">+14 new</span>
              <span>warriors today</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Atlas Node Status</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">Online</h3>
              </div>
              <span className="p-2 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 animate-pulse">
                <Activity className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">Ping 84ms</span>
              <span>cluster connection green</span>
            </div>
          </div>
        </div>

        {/* Central Terminal / Road map section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main system log */}
          <div className="lg:col-span-2 bg-neutral-950 border border-neutral-900 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-4 mb-4">
              <Terminal className="h-4 w-4 text-spartan-red" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-display">System Console Log</h3>
            </div>
            
            <div className="font-mono text-xs text-neutral-500 space-y-2.5 overflow-x-auto">
              <div className="flex items-start gap-2">
                <span className="text-spartan-gold shrink-0">[2026-06-06 10:14:33]</span>
                <span className="text-neutral-400">INITIALIZE: Establishing secure tunnel to Cluster0 MongoDB Atlas...</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0">[SUCCESS]</span>
                <span className="text-neutral-400">CONNECTION: Authenticated as db_user inside `spartan_supplements`</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-spartan-gold shrink-0">[2026-06-06 10:15:10]</span>
                <span className="text-neutral-400">VERIFY: Running check on collection `admins`</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neutral-500 shrink-0">[INFO]</span>
                <span className="text-neutral-400">STATUS: admins exists, default credentials ready for validation check</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-spartan-red shrink-0">[ALERT]</span>
                <span className="text-neutral-400">SECURITY: Admin cookie session established for user {email}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-spartan-gold shrink-0">[CONSOLE]</span>
                <span className="text-neutral-300 animate-pulse">&gt; System is awaiting admin portal configuration commands...</span>
              </div>
            </div>
          </div>

          {/* Development Roadmap Card */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 relative">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-4 mb-4">
              <Cpu className="h-4 w-4 text-spartan-gold" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-display">System Roadmap</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 shrink-0 font-bold">1</div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-300">Catalog Management</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Admin UI to add, update, delete products, control stock levels, and upload images.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 shrink-0 font-bold">2</div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-300">Order Dispatch</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Fulfillment dashboard to view customer orders, update shipping states, and print logs.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 shrink-0 font-bold">3</div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-300">Promotions & Coupons</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Tool to create active discounts, campaign percentages, and customer referral codes.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
