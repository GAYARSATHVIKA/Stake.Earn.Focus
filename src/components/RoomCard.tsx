import React from 'react';
import { motion } from 'motion/react';
import { Users, Timer, Coins, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  key?: number;
  room: {
    id: number;
    stakeAmount: string;
    startTime: number;
    endTime: number;
    participants: string[];
    distributed: boolean;
  };
  onJoin: (id: number) => void | Promise<void>;
}

export default function RoomCard({ room, onJoin }: RoomCardProps) {
  const timeLeft = Math.max(0, room.endTime - Math.floor(Date.now() / 1000));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="f-glass-card rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden group"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-primary/10 blur-[100px] border border-white/5 rounded-full group-hover:bg-accent-primary/20 transition-all duration-700" />

      <div className="flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Instance Control</span>
          <span className="text-3xl font-display font-black tracking-tighter">#{room.id}</span>
        </div>
        <div className={`px-5 py-2 rounded-full f-glass border-white/5 ${room.distributed ? 'bg-emerald-500/10 text-emerald-400' :
            timeLeft > 0 ? 'bg-accent-primary/5 text-accent-primary' :
              'bg-amber-500/10 text-amber-400'
          }`}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {room.distributed ? 'Finalized' : timeLeft > 0 ? 'Live Tracking' : 'Awaiting Claim'}
          </span>
          {timeLeft > 0 && !room.distributed && (
            <span className="ml-2 inline-block w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 relative z-10">
        <div className="flex flex-col gap-2 p-5 rounded-3xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-primary/20 rounded-xl text-accent-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Coins size={20} />
            </div>
            <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Protocol Stake</span>
          </div>
          <span className="text-xl font-black">{room.stakeAmount} <span className="text-accent-primary">MON</span></span>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-3xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-secondary/20 rounded-xl text-accent-secondary shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              <Users size={20} />
            </div>
            <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Active Peers</span>
          </div>
          <span className="text-xl font-black">{room.participants.length}</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 rounded-[24px] bg-white/[0.02] border border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent-tertiary rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
          <span className="text-xs font-black text-white/40 uppercase tracking-widest">Time Remaining</span>
        </div>
        <span className="font-mono font-black text-2xl tracking-tighter text-white/90">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <button
        onClick={() => onJoin(room.id)}
        className="w-full btn-primary flex items-center justify-center gap-3 group/btn text-sm py-5 relative z-10"
      >
        <span className="font-black uppercase tracking-widest">Initialize Sync</span>
        <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
        <div className="absolute inset-0 shimmer opacity-10" />
      </button>
    </motion.div>
  );
}
