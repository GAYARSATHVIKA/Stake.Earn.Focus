import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Clock, TrendingUp, Share2, ExternalLink } from 'lucide-react';
import { useWeb3Store } from '../store/useStore';

export default function Profile() {
  const { address, balance } = useWeb3Store();

  const stats = [
    { label: "Total Sessions", value: "24", icon: <Clock className="text-accent-primary" /> },
    { label: "Success Rate", value: "92%", icon: <ShieldCheck className="text-emerald-400" /> },
    { label: "Total Earned", value: "4.2 MON", icon: <TrendingUp className="text-accent-secondary" /> },
  ];

  const badges = [
    { id: 1, name: "Early Adopter", date: "Feb 2026" },
    { id: 2, name: "Focus Master", date: "Feb 2026" },
    { id: 3, name: "Streak King", date: "Feb 2026" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Info */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <div className="f-glass rounded-[56px] p-12 text-center border-white/5 shadow-3xl relative overflow-hidden bg-white/[0.02]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/5 blur-[80px] rounded-full -mr-20 -mt-20" />

            <div className="w-40 h-40 bg-linear-to-br from-accent-primary via-accent-secondary to-accent-tertiary rounded-full mx-auto mb-10 p-1.5 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              <div className="w-full h-full bg-bg rounded-full flex items-center justify-center overflow-hidden border-4 border-bg/50">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${address}`}
                  alt="Avatar"
                  className="w-28 h-28 transform hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            <h2 className="text-3xl font-black font-mono tracking-tighter mb-3 text-white">{address?.slice(0, 8)}...{address?.slice(-6)}</h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full f-glass border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-10">
              Validated Protocol Architect
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              <button className="btn-secondary w-full py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 group">
                <Share2 size={18} className="text-accent-primary group-hover:scale-110 transition-transform" /> Share Protocol Identity
              </button>
              <button className="btn-secondary w-full py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 group">
                <ExternalLink size={18} className="text-accent-tertiary group-hover:scale-110 transition-transform" /> Verified Explorer Node
              </button>
            </div>
          </div>

          <div className="f-glass rounded-[40px] p-10 border-white/5 shadow-xl bg-white/[0.01]">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/20 mb-8">Node Parameters</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center group">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">Network Chain</span>
                <span className="text-sm font-black text-accent-primary group-hover:text-glow transition-all">MONAD TESTNET</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">Asset Liquidity</span>
                <span className="text-sm font-black text-white">{Number(balance).toFixed(4)} <span className="text-accent-tertiary">MON</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Badges */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="f-glass-card rounded-[40px] p-10 border-white/5 relative overflow-hidden group"
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-all" />
                <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-[24px] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 32 })}
                </div>
                <p className="text-5xl font-black font-display tracking-tighter mb-2 text-white">{stat.value}</p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="f-glass rounded-[56px] p-12 border-white/5 shadow-3xl bg-white/[0.01]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-display font-black tracking-tight uppercase">PROTOCOL ACHIEVEMENTS</h3>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Non-Fungible Performance Assets</span>
              </div>
              <div className="f-glass px-5 py-2.5 rounded-2xl border-white/5 text-xs font-black text-white/40 uppercase tracking-widest bg-white/[0.02]">
                {badges.length} ASSETS COLLECTED
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -12 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center group relative"
                >
                  <div className="w-full aspect-square f-glass rounded-[32px] p-6 mb-6 border-white/5 group-hover:border-accent-primary/40 transition-all duration-700 relative overflow-hidden bg-white/[0.02]">
                    <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[40px]" />
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${badge.name}`}
                      alt={badge.name}
                      className="w-full h-full drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <p className="text-sm font-black tracking-tight text-white mb-2 uppercase group-hover:text-accent-primary transition-colors">{badge.name}</p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{badge.date}</p>
                </motion.div>
              ))}

              {/* Empty State / Coming Soon */}
              <div className="flex flex-col items-center opacity-10 group cursor-not-allowed">
                <div className="w-full aspect-square bg-white/[0.02] rounded-[32px] border-2 border-dashed border-white/10 flex items-center justify-center mb-6">
                  <Award size={48} />
                </div>
                <p className="text-sm font-black text-white/30 uppercase tracking-widest">LOCKED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
