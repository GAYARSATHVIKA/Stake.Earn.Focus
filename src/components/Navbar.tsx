import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, LogOut, ShieldCheck, ChevronDown, User, Award, LayoutDashboard, Trophy } from 'lucide-react';
import { useWeb3Store, useAppStore } from '../store/useStore';
import { useWeb3 } from '../hooks/useWeb3';

interface NavbarProps {
  onNavigate: (view: 'dashboard' | 'leaderboard' | 'profile') => void;
  currentView: string;
}

export default function Navbar({ onNavigate, currentView }: NavbarProps) {
  const { address, balance, isConnected, isConnecting } = useWeb3Store();
  const { setActiveRoomId } = useAppStore();
  const { connectWallet, disconnect } = useWeb3();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
      <div className="container mx-auto f-glass rounded-3xl px-8 py-4 flex items-center justify-between pointer-events-auto border-white/5 shadow-2xl backdrop-blur-3xl">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setActiveRoomId(null);
            onNavigate('dashboard');
          }}
        >
          <div className="w-11 h-11 bg-linear-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <ShieldCheck className="text-white" size={26} />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter hidden sm:block">
            Focus<span className="text-gradient">Room</span>
          </span>
        </div>

        {isConnected && (
          <div className="hidden lg:flex items-center gap-10">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-110 ${currentView === 'dashboard' ? 'text-accent-primary text-glow' : 'text-white/40 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-110 ${currentView === 'leaderboard' ? 'text-accent-primary text-glow' : 'text-white/40 hover:text-white'}`}
            >
              Leaderboard
            </button>
          </div>
        )}

        <div className="flex items-center gap-6">
          {isConnected ? (
            <div className="flex items-center gap-5">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Balance</span>
                <span className="text-sm font-black text-white">{Number(balance).toFixed(4)} <span className="text-accent-tertiary">MON</span></span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 transition-all group"
                >
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-mono font-bold tracking-tight">{shortenAddress(address!)}</span>
                  <ChevronDown size={16} className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''} text-white/40`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsDropdownOpen(false)}
                        className="fixed inset-0 z-[-1]"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                        className="absolute right-0 mt-4 w-60 f-glass rounded-2xl p-2.5 shadow-2xl border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-sm font-bold group"
                        >
                          <User size={18} className="text-accent-primary group-hover:scale-110 transition-transform" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('leaderboard');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-sm font-bold group lg:hidden"
                        >
                          <Trophy size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                          Leaderboard
                        </button>
                        <div className="h-[1px] bg-white/10 my-1.5" />
                        <button
                          onClick={() => {
                            disconnect();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-500/10 text-red-500/80 hover:text-red-500 transition-all text-sm font-bold group"
                        >
                          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                          Disconnect
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="btn-primary flex items-center gap-2 group"
            >
              <Wallet size={20} className="group-hover:rotate-12 transition-transform" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              <div className="absolute inset-0 shimmer opacity-20" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
