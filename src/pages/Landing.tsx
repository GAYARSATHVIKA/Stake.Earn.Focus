import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Wallet,
  ShieldCheck,
  Zap,
  Trophy,
  Clock,
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  MessageSquare,
  BarChart3,
  Award,
  Users,
  Lock
} from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { useWeb3Store } from '../store/useStore';

interface LandingProps {
  onStart: () => void;
}

const StatCounter = ({ value, label, suffix = "" }: { value: string, label: string, suffix?: string }) => (
  <div className="text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black font-display mb-2 gradient-text"
    >
      {value}{suffix}
    </motion.div>
    <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</div>
  </div>
);

export default function Landing({ onStart }: LandingProps) {
  const { connectWallet } = useWeb3();
  const { isConnected, isConnecting } = useWeb3Store();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const steps = [
    { title: "Connect Wallet", desc: "Link your Monad wallet to start your journey.", icon: Wallet },
    { title: "Stake Tokens", desc: "Commit MON tokens as a stake for your focus session.", icon: Lock },
    { title: "Focus & Earn", desc: "Complete your session to get your stake back plus rewards.", icon: Zap },
  ];

  const testimonials = [
    { name: "Alex.eth", role: "Web3 Developer", text: "FocusRoom changed how I build. Staking tokens makes procrastination too expensive to afford.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { name: "Sarah Chen", role: "Crypto Researcher", text: "The on-chain accountability is exactly what the productivity space was missing. Clean UI too!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "Marcus.mon", role: "Monad Builder", text: "Earning rewards for staying focused? It's a no-brainer. The NFT badges are a nice touch.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="min-h-[95vh] flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full f-glass mb-12 border-white/5 shadow-2xl"
          >
            <span className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Monad Testnet Protocol</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-9xl font-black font-display leading-[0.85] mb-10 tracking-tighter"
          >
            STAKE. EARN. <br />
            <span className="text-gradient drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]">FOCUS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-white/40 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
          >
            The ultimate decentralized accountability protocol. <br className="hidden md:block" />
            Commit to your goals, stay productive, and earn <span className="text-white">on-chain rewards</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary flex items-center gap-3 px-10 py-5 group min-w-[240px] text-lg"
              >
                <Wallet size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                <span>{isConnecting ? "Connecting..." : "Initialize Protocol"}</span>
                <div className="absolute inset-0 shimmer opacity-10" />
              </button>
            ) : (
              <button
                onClick={onStart}
                className="btn-primary flex items-center gap-3 px-10 py-5 group min-w-[240px] text-lg"
              >
                <span>Launch Dashboard</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            )}
            <button className="btn-secondary flex items-center gap-3 px-10 py-5 group text-lg min-w-[200px]">
              Learn Strategy
            </button>
          </motion.div>
        </motion.div>

        {/* Global Orbs Moved to Background for better performance/look */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-accent-primary/20 blur-[120px] rounded-full animate-float pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-accent-secondary/15 blur-[150px] rounded-full animate-float pointer-events-none animate-delay-2000" />
      </section>


      {/* How It Works */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black font-display mb-6">How It Works</h2>
            <p className="text-white/40 max-w-xl mx-auto">Three simple steps to unlock your peak productivity and earn on-chain rewards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 f-glass rounded-3xl flex items-center justify-center mb-8 border-white/10 group hover:scale-110 transition-transform">
                  <step.icon className="text-accent-purple" size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-xs font-bold border-4 border-bg">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/40 text-sm max-w-[250px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Vitalik.eth", score: "2,450", rewards: "12.5 MON", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vitalik" },
                  { rank: 2, name: "Satoshi.mon", score: "2,120", rewards: "10.2 MON", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Satoshi" },
                  { rank: 3, name: "Builder.eth", score: "1,980", rewards: "8.4 MON", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Builder" },
                ].map((user, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="f-glass p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:border-accent-purple/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>
                        {user.rank}
                      </div>
                      <img src={user.avatar} className="w-10 h-10 rounded-full bg-white/5" alt="" />
                      <div>
                        <div className="text-sm font-bold">{user.name}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase">{user.score} Focus Points</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-accent-purple">{user.rewards}</div>
                      <div className="text-[10px] text-white/40 font-bold uppercase">Earned</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black font-display mb-8 leading-tight">
                Climb the <br />
                <span className="gradient-text">Leaderboard.</span>
              </h2>
              <p className="text-white/40 text-lg mb-8 leading-relaxed">
                Compete with the world's most productive builders. Earn points for every session,
                unlock exclusive NFT badges, and climb the ranks to earn a share of the protocol rewards.
              </p>
              <button onClick={onStart} className="flex items-center gap-2 text-accent-purple font-bold hover:gap-4 transition-all">
                View Full Leaderboard <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black font-display mb-8 leading-tight">
                Built for the <br />
                <span className="gradient-text">Next Generation</span> <br />
                of Builders.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 f-glass rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-accent-purple" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">On-Chain Accountability</h4>
                    <p className="text-sm text-white/40">Your focus sessions are verified on the Monad blockchain, ensuring immutable proof of work.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 f-glass rounded-xl flex items-center justify-center shrink-0">
                    <Award className="text-accent-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">NFT Achievement Badges</h4>
                    <p className="text-sm text-white/40">Earn unique generative NFT badges for reaching focus milestones and maintaining streaks.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-accent-purple/20 blur-[120px] rounded-full" />
              <motion.div
                initial={{ rotateY: 20, rotateX: 10 }}
                whileInView={{ rotateY: 0, rotateX: 0 }}
                viewport={{ once: true }}
                className="f-glass rounded-[40px] p-8 border-white/10 relative z-10 shadow-2xl"
              >
                {/* Dashboard Preview Mockup */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Session</div>
                </div>

                <div className="flex flex-col items-center py-12">
                  <div className="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-8 border-accent-purple border-t-transparent animate-spin-slow" />
                    <div className="text-center">
                      <div className="text-4xl font-black font-mono">24:59</div>
                      <div className="text-[10px] font-bold text-white/40 uppercase">Remaining</div>
                    </div>
                  </div>
                  <div className="mt-12 w-full space-y-4">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 gradient-bg" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                      <span>Progress</span>
                      <span>66%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black font-display mb-6">Loved by Builders</h2>
            <p className="text-white/40 max-w-xl mx-auto">Join thousands of students and developers who are crushing their goals with FocusRoom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="f-glass p-8 rounded-[32px] border-white/5 relative group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-white/10" />
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="absolute top-6 right-8 text-accent-purple/20">
                  <MessageSquare size={40} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight">
                  Focus<span className="gradient-text">Room</span>
                </span>
              </div>
              <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
                The decentralized productivity protocol building the future of deep work.
                Stake, focus, and earn on-chain rewards.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 f-glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 f-glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="w-10 h-10 f-glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white/60">Protocol</h4>
              <ul className="space-y-4 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Audit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white/60">Community</h4>
              <ul className="space-y-4 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2026 FocusRoom Protocol. Built on Monad.</p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Contract: 0x7c3a...ed42</span>
              <a href="#" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
