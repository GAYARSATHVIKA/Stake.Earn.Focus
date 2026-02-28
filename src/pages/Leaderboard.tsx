import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, User } from 'lucide-react';

export default function Leaderboard() {
  const leaders = [
    { name: "0x72...4a1", sessions: 42, earned: "12.5 MON", rank: 1 },
    { name: "0x1a...9b2", sessions: 38, earned: "10.2 MON", rank: 2 },
    { name: "0x4f...c33", sessions: 35, earned: "9.8 MON", rank: 3 },
    { name: "0x8e...d44", sessions: 29, earned: "7.4 MON", rank: 4 },
    { name: "0x2c...e55", sessions: 24, earned: "6.1 MON", rank: 5 },
  ];

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="text-center mb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-3 f-glass px-5 py-2.5 rounded-full border-accent-primary/10 bg-accent-primary/5 text-accent-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10"
        >
          <Trophy size={16} className="text-accent-primary" />
          Global High-Performance Node Layer
        </motion.div>
        <h2 className="text-6xl font-display font-black tracking-tighter mb-6 uppercase text-white">
          PROTOCOL <span className="text-gradient">MASTERS</span>
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          The most synchronized builders in the Monad ecosystem. Optimize your focus to dominate the rankings.
        </p>
      </div>

      <div className="space-y-6">
        {leaders.map((leader, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="f-glass-card rounded-[32px] p-8 flex items-center justify-between border-white/5 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-accent-primary/10 transition-all duration-700" />

            <div className="flex items-center gap-8 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${leader.rank === 1 ? 'bg-amber-400 text-black' :
                leader.rank === 2 ? 'bg-slate-300 text-black' :
                  leader.rank === 3 ? 'bg-orange-400 text-black' :
                    'bg-white/5 text-white/40 border border-white/10'
                }`}>
                {leader.rank === 1 ? <Crown size={32} /> : leader.rank}
              </div>

              <div className="flex items-center gap-5">
                <div className="w-14 h-14 f-glass rounded-2xl flex items-center justify-center border-white/5 bg-white/[0.02] shadow-xl">
                  <User size={28} className="text-white/20 group-hover:text-accent-primary transition-colors duration-500" />
                </div>
                <div>
                  <p className="font-mono font-black text-xl tracking-tight text-white mb-1">{leader.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{leader.sessions} Sessions Synchronized</span>
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right relative z-10">
              <p className="text-3xl font-black font-display tracking-tight text-white group-hover:text-accent-primary transition-colors">{leader.earned}</p>
              <p className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.3em] mt-1">Total Rewards Allocated</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
