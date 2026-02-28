import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, RefreshCw, Timer, ArrowRight } from 'lucide-react';
import { useAppStore, useWeb3Store } from '../store/useStore';
import RoomCard from '../components/RoomCard';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { FOCUS_ROOM_ABI, FOCUS_ROOM_ADDRESS } from '../utils/contract';

export default function Dashboard() {
  const { rooms, setRooms, setActiveRoomId } = useAppStore();
  const { address } = useWeb3Store();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [isLoading, setIsLoading] = useState(false);

  const fetchRooms = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, provider);
      const counter = await contract.roomCounter();
      const count = Number(counter);

      const fetchedRooms = [];
      // Try fetching room 0 to counter to be safe with indexing
      for (let i = 0; i <= count; i++) {
        try {
          const roomData = await contract.rooms(i);
          // Only add if ID is non-zero (mapping default is 0)
          if (roomData.id && Number(roomData.id) !== 0) {
            const participants = await contract.getParticipants(i);
            fetchedRooms.push({
              id: Number(roomData.id),
              stakeAmount: ethers.formatEther(roomData.stakeAmount),
              startTime: Number(roomData.startTime),
              endTime: Number(roomData.endTime),
              participants: participants,
              distributed: roomData.distributed
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch room ${i}:`, err);
        }
      }

      // Filter out duplicates just in case and sort by ID descending
      const uniqueRooms = Array.from(new Map(fetchedRooms.map(r => [r.id, r])).values())
        .sort((a, b) => b.id - a.id);

      setRooms(uniqueRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, signer);

      const tx = await contract.createRoom(ethers.parseEther(stakeAmount));
      toast.loading('Creating room...', { id: 'create' });
      await tx.wait();
      toast.success('Room created successfully!', { id: 'create' });
      setIsModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room', { id: 'create' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    if (!window.ethereum) return;
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FOCUS_ROOM_ADDRESS, FOCUS_ROOM_ABI, signer);

      const tx = await contract.joinRoom(roomId, {
        value: ethers.parseEther(room.stakeAmount)
      });
      toast.loading('Joining room...', { id: 'join' });
      await tx.wait();
      toast.success('Joined room!', { id: 'join' });
      setActiveRoomId(roomId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to join room', { id: 'join' });
    }
  };

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-1.5 h-6 bg-accent-primary rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Protocol Interface</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter mb-6">
            ACTIVE <span className="text-gradient">INSTANCES</span>
          </h2>
          <p className="text-white/40 text-lg font-medium leading-relaxed">
            Initialize a focus session to synchronize with the Monad network and secure your productivity rewards.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-3 px-10 py-5 group min-w-[260px] relative overflow-hidden"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-black uppercase tracking-widest">Create Focus Room</span>
          <div className="absolute inset-0 shimmer opacity-10" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="f-glass p-8 rounded-[32px] flex items-center gap-6 border-white/5 hover:bg-white/[0.05] transition-all group">
          <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center text-accent-primary shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:scale-110 transition-transform">
            <RefreshCw size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1 block">Network Status</span>
            <p className="text-2xl font-black">{rooms.length} <span className="text-sm font-medium text-white/20 uppercase tracking-normal">Instances</span></p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
          ))}
        </div>
      ) : (
        <div className="f-glass rounded-[48px] p-24 flex flex-col items-center text-center border-white/5 bg-white/[0.01]">
          <div className="w-32 h-32 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 border border-white/5 relative">
            <div className="absolute inset-0 rounded-full border border-accent-primary/20 animate-pulse-slow" />
            <Search size={56} className="text-white/10" />
          </div>
          <h3 className="text-3xl font-black mb-4 tracking-tight">NO ACTIVE INSTANCES</h3>
          <p className="text-white/30 max-w-md font-medium text-lg leading-relaxed">
            The network is quiet. Be the first to initialize a focus room and set the pace for the global builder community.
          </p>
        </div>
      )}

      {/* Create Room Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ scale: 0.9, opacity: 0, y: 30, filter: 'blur(20px)' }}
              className="relative f-glass w-full max-w-lg rounded-[48px] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-white/5 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 blur-[60px] rounded-full" />

              <div className="relative z-10">
                <h3 className="text-4xl font-display font-black tracking-tighter mb-4 text-gradient">INITIALIZE ROOM</h3>
                <p className="text-white/40 font-medium mb-10 leading-relaxed">
                  Configure your protocol parameters and commit your stake to the network.
                </p>

                <div className="space-y-8">
                  <div className="group">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 block group-hover:text-accent-primary transition-colors">Stake Amount (MON)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-accent-primary/50 focus:bg-white/[0.05] transition-all font-mono text-2xl font-black"
                        placeholder="0.1"
                        step="0.1"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black tracking-widest text-xs uppercase">MON</div>
                    </div>
                  </div>

                  <div className="bg-accent-primary/5 p-6 rounded-3xl border border-accent-primary/10 flex gap-5 items-start">
                    <div className="p-2 bg-accent-primary/20 rounded-xl text-accent-primary shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0">
                      <Timer size={20} />
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      <span className="text-accent-primary font-black uppercase tracking-wider block mb-1">Session Protocol</span>
                      Standard duration is configured for <span className="text-white font-black">60 minutes</span>. Absolute focus required for stake release and rewards.
                    </p>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    className="w-full btn-primary py-6 rounded-2xl font-black text-lg group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? 'COMMITTING...' : 'INITIALIZE & STAKE'}
                      {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 shimmer opacity-10" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
