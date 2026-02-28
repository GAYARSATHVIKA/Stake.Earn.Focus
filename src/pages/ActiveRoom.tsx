import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Users, Coins, AlertTriangle, CheckCircle, XCircle, Award, TrendingUp, User, Zap } from 'lucide-react';
import { useAppStore, useWeb3Store } from '../store/useStore';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { FOCUS_ROOM_ABI, FOCUS_ROOM_ADDRESS } from '../utils/contract';
import confetti from 'canvas-confetti';

export default function ActiveRoom() {
  const { activeRoomId, rooms, setActiveRoomId } = useAppStore();
  const { address } = useWeb3Store();
  const [timeLeft, setTimeLeft] = useState(0);
  const [room, setRoom] = useState<any>(null);
  const [isQuitting, setIsQuitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participantsStatus, setParticipantsStatus] = useState<any[]>([]);

  const fetchRoomData = async () => {
    if (!activeRoomId || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, provider);

      const roomData = await contract.rooms(activeRoomId);
      const participants = await contract.getParticipants(activeRoomId);
      const completedStatus = await contract.completed(activeRoomId, address);
      const exitedStatus = await contract.exitedEarly(activeRoomId, address);

      // Fetch status for all participants
      const statusPromises = participants.map(async (p: string) => {
        const isDone = await contract.completed(activeRoomId, p);
        const hasQuit = await contract.exitedEarly(activeRoomId, p);
        return { address: p, isDone, hasQuit };
      });
      const statuses = await Promise.all(statusPromises);
      setParticipantsStatus(statuses);

      const currentRoom = {
        id: Number(roomData.id),
        stakeAmount: ethers.formatEther(roomData.stakeAmount),
        startTime: Number(roomData.startTime),
        endTime: Number(roomData.endTime),
        participants: participants,
        distributed: roomData.distributed
      };

      setRoom(currentRoom);
      setIsCompleted(completedStatus);
      setIsExited(exitedStatus);

      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(Math.max(0, currentRoom.endTime - now));
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  useEffect(() => {
    fetchRoomData();
    const interval = setInterval(() => {
      fetchRoomData();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeRoomId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuit = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, signer);

      const tx = await contract.exitEarly(activeRoomId);
      toast.loading('Processing exit...', { id: 'exit' });

      // Screen vibration/flash effect
      document.body.classList.add('vibrate');
      setTimeout(() => document.body.classList.remove('vibrate'), 500);

      await tx.wait();
      toast.error('You forfeited your stake!', { id: 'exit' });
      setIsQuitting(false);
      setActiveRoomId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to quit', { id: 'exit' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, signer);

      const tx = await contract.markCompleted(activeRoomId);
      toast.loading('Marking as completed...', { id: 'complete' });
      await tx.wait();
      toast.success('Session completed!', { id: 'complete' });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#A855F7', '#FFFFFF']
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete', { id: 'complete' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, signer);

      const tx = await contract.distributeRewards(activeRoomId);
      toast.loading('Distributing rewards...', { id: 'claim' });
      await tx.wait();
      toast.success('Rewards claimed!', { id: 'claim' });
      setActiveRoomId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to claim', { id: 'claim' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!room) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      <p className="text-white/40 font-medium">Synchronizing with Monad...</p>
    </div>
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration = 3600; // 60 mins
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const quitCount = participantsStatus.filter(p => p.hasQuit).length;
  const completedCount = participantsStatus.filter(p => p.isDone).length;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN: Timer */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-12 xl:col-span-5 flex flex-col items-center"
        >
          <div className="f-glass rounded-[56px] p-12 w-full flex flex-col items-center text-center relative overflow-hidden shadow-3xl bg-white/[0.02]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[100px] rounded-full -mr-20 -mt-20" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full f-glass mb-12 border-accent-primary/10 bg-accent-primary/5"
            >
              <span className="w-2 h-2 bg-accent-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-primary">Protocol Active</span>
            </motion.div>

            <div className="relative w-80 h-80 mb-12 group">
              <div className="absolute inset-0 bg-accent-primary/5 blur-[40px] rounded-full scale-110 group-hover:bg-accent-primary/10 transition-all duration-1000" />
              <svg className="w-full h-full -rotate-90 relative z-10 transition-transform duration-700 group-hover:scale-105">
                <circle
                  cx="160"
                  cy="160"
                  r="145"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-white/[0.03]"
                />
                <motion.circle
                  cx="160"
                  cy="160"
                  r="145"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="911"
                  initial={{ strokeDashoffset: 911 }}
                  animate={{ strokeDashoffset: 911 - (911 * progress) / 100 }}
                  className="text-accent-primary"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-7xl font-mono font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Remaining</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full relative z-10">
              {timeLeft > 0 ? (
                <button
                  onClick={() => setIsQuitting(true)}
                  className="w-full btn-secondary text-red-500/60 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 py-6 transition-all group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <XCircle size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-black uppercase tracking-[0.2em] text-sm">Initialize Forfeit</span>
                  </div>
                </button>
              ) : !isCompleted ? (
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full btn-primary py-6 text-lg relative overflow-hidden group"
                >
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <CheckCircle size={24} className="group-hover:scale-125 transition-transform" />
                    <span className="font-black uppercase tracking-widest">Mark as Completed</span>
                  </div>
                  <div className="absolute inset-0 shimmer opacity-20" />
                </button>
              ) : !room.distributed ? (
                <button
                  onClick={handleClaim}
                  disabled={isLoading}
                  className="w-full btn-primary py-6 text-lg relative overflow-hidden group"
                >
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <Award size={24} className="group-hover:bounce transition-transform" />
                    <span className="font-black uppercase tracking-widest">Claim Protocol Rewards</span>
                  </div>
                  <div className="absolute inset-0 shimmer opacity-20" />
                </button>
              ) : (
                <div className="w-full py-6 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black uppercase tracking-widest flex items-center justify-center gap-3">
                  <CheckCircle size={24} />
                  Rewards Synchronized
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Stats & Participants */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-8">
          {/* Main Stat Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="f-glass rounded-[40px] p-12 border-white/5 shadow-2xl relative overflow-hidden group h-fit"
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent-secondary/5 blur-[80px] rounded-full group-hover:bg-accent-secondary/10 transition-all duration-1000" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block">Aggregated Protocol Pool</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-7xl font-display font-black tracking-tighter text-gradient">
                    {(Number(room.stakeAmount) * room.participants.length).toFixed(2)}
                  </span>
                  <span className="text-2xl font-black text-white/40 tracking-widest">MON</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400/80 text-xs font-black uppercase tracking-widest">
                  <Zap size={18} className="animate-pulse" />
                  <span>Dynamic yield auto-compounding</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 shrink-0">
                {[
                  { label: "Participants", value: room.participants.length, color: "text-white" },
                  { label: "Individual Stake", value: `${room.stakeAmount} MON`, color: "text-accent-primary" },
                  { label: "Marked Done", value: completedCount, color: "text-emerald-400" },
                  { label: "Early Exit", value: quitCount, color: "text-red-500" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl min-w-[140px] group-hover:bg-white/[0.06] transition-colors">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">{stat.label}</span>
                    <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Participants Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="f-glass rounded-[40px] p-10 border-white/5 shadow-2xl flex-grow overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-display font-black tracking-tight uppercase">Protocol Peers</h3>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Network Verification Layer</span>
              </div>
              <div className="f-glass px-4 py-2 rounded-2xl border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/[0.02]">
                {room.participants.length} Active Node{room.participants.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[460px] pr-4 custom-scrollbar lg:grid-cols-2">
              {participantsStatus.map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-5 rounded-3xl transition-all duration-500 group relative overflow-hidden ${p.hasQuit ? 'bg-red-500/5 border-red-500/10' :
                    p.isDone ? 'bg-emerald-500/5 border-emerald-500/10' :
                      'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                    } border`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg ${p.hasQuit ? 'bg-red-500 text-white' :
                      p.isDone ? 'bg-emerald-500 text-white' :
                        'bg-linear-to-br from-accent-primary to-accent-secondary text-white'
                      }`}>
                      {p.address.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono font-bold tracking-tight text-white/80">{p.address.slice(0, 10)}...{p.address.slice(-6)}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${p.hasQuit ? 'text-red-500/60' :
                          p.isDone ? 'text-emerald-500/60' :
                            'text-accent-primary/60'
                          }`}>
                          {p.hasQuit ? 'Node Terminated' : p.isDone ? 'Sync Complete' : 'Active Channel'}
                        </span>
                        {!p.hasQuit && !p.isDone && <span className="w-1 h-1 bg-accent-primary rounded-full animate-ping" />}
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    {p.isDone && <CheckCircle size={22} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                    {p.hasQuit && <XCircle size={22} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Rage Quit Modal */}
      <AnimatePresence>
        {isQuitting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative f-glass border-red-500/30 w-full max-w-md rounded-[40px] p-10 shadow-2xl text-center shake"
            >
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 animate-pulse">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-3xl font-display font-black mb-4">RAGE QUIT?</h3>
              <p className="text-white/60 mb-10 leading-relaxed">
                You are about to <span className="text-red-500 font-bold">permanently lose</span> your stake of <span className="text-white font-bold">{room.stakeAmount} MON</span>. <br />
                This action cannot be undone.
              </p>
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuit}
                  disabled={isLoading}
                  className="w-full bg-red-500 py-5 rounded-2xl font-bold text-xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 glow-red"
                >
                  Confirm Quit
                </motion.button>
                <button
                  onClick={() => setIsQuitting(false)}
                  className="w-full bg-white/5 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Stay Focused
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
