import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Share2, ArrowRight, ExternalLink, CheckCircle2, Zap } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import confetti from 'canvas-confetti';

export default function Result() {
  const { setActiveRoomId } = useAppStore();
  const [reward, setReward] = useState(0);
  const targetReward = 0.15; // Example reward

  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#D946EF', '#0EA5E9', '#FFFFFF']
    });

    const duration = 2500;
    const steps = 100;
    const increment = targetReward / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetReward) {
        setReward(targetReward);
        clearInterval(timer);
      } else {
        setReward(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative mb-20 inline-block"
      >
        <div className="absolute inset-0 bg-accent-primary/40 blur-[150px] rounded-full -z-10 animate-pulse-slow" />
        <div className="w-56 h-56 bg-linear-to-br from-accent-primary via-accent-secondary to-accent-tertiary rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(139,92,246,0.5)] border-4 border-white/20 relative">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
          <Trophy size={100} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-7xl md:text-9xl font-display font-black mb-6 tracking-tighter uppercase">
          SESSION <span className="text-gradient">SYNCED</span>
        </h2>
        <p className="text-2xl text-white/40 mb-20 max-w-3xl mx-auto font-medium leading-relaxed">
          Protocol validation complete. Your cognitive proof-of-work has been verified and rewards have been allocated to the network.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
        {/* Reward Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="lg:col-span-12 xl:col-span-7 f-glass rounded-[56px] p-16 flex flex-col items-center justify-center relative overflow-hidden group border-white/5 bg-white/[0.02]"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent-primary/5 blur-[100px] rounded-full -ml-32 -mt-32 group-hover:bg-accent-primary/10 transition-all duration-1000" />

          <div className="w-24 h-24 bg-accent-primary/10 rounded-[32px] flex items-center justify-center text-accent-primary mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner border border-accent-primary/20">
            <Zap size={48} className="animate-pulse" />
          </div>

          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">Aggregate Protocol Yield</span>
          <div className="flex items-baseline gap-4">
            <motion.span className="text-9xl font-black font-display tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {reward.toFixed(4)}
            </motion.span>
            <span className="text-4xl font-black text-accent-primary tracking-widest">MON</span>
          </div>

          <div className="mt-12 inline-flex items-center gap-4 bg-emerald-500/5 text-emerald-400 px-8 py-4 rounded-3xl border border-emerald-500/10 text-xs font-black uppercase tracking-[0.3em]">
            <CheckCircle2 size={24} className="text-emerald-500" />
            Network Distribution Confirmed
          </div>
        </motion.div>

        {/* NFT Badge Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="lg:col-span-12 xl:col-span-5 f-glass rounded-[56px] p-12 flex flex-col items-center relative overflow-hidden group border-white/5 bg-white/[0.02]"
        >
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-secondary/5 blur-[100px] rounded-full -mr-32 -mb-32 group-hover:bg-accent-secondary/10 transition-all duration-1000" />

          <motion.div
            animate={{ rotateY: [0, 360], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="relative w-64 h-64 mb-10 perspective-1000"
          >
            <div className="absolute inset-0 f-glass rounded-[40px] p-6 flex items-center justify-center shadow-3xl border-accent-secondary/30 bg-white/[0.05] backface-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-accent-secondary/20 to-transparent opacity-50" />
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=FocusSync"
                alt="NFT Badge"
                className="w-full h-full drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] relative z-10"
              />
            </div>
          </motion.div>

          <div className="text-center relative z-10">
            <h3 className="text-3xl font-display font-black tracking-tighter mb-2 uppercase">PRODUCER NODE #{"FF3".split('').sort(() => Math.random() - 0.5).join('')}8</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10">Verification Asset Layer 2</p>
          </div>

          <div className="flex flex-col gap-4 w-full relative z-10">
            <button className="btn-secondary w-full py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
              <ExternalLink size={20} className="text-accent-tertiary" /> Protocol Explorer
            </button>
            <button className="btn-secondary w-full py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
              <Share2 size={20} className="text-accent-secondary" /> Broadcast Success
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-6 justify-center"
      >
        <button
          onClick={() => setActiveRoomId(null)}
          className="btn-primary flex items-center gap-4 px-16 py-8 text-xl group relative overflow-hidden"
        >
          <span className="font-black uppercase tracking-widest">Re-Initialize Focus</span>
          <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
          <div className="absolute inset-0 shimmer opacity-20" />
        </button>
      </motion.div>
    </div>
  );
}
