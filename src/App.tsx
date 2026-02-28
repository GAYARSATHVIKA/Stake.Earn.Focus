import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import { useWeb3Store, useAppStore } from './store/useStore';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ActiveRoom from './pages/ActiveRoom';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

export default function App() {
  const { isConnected } = useWeb3Store();
  const { activeRoomId } = useAppStore();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'active' | 'result' | 'leaderboard' | 'profile'>('landing');

  useEffect(() => {
    if (!isConnected) {
      setCurrentView('landing');
    } else if (activeRoomId) {
      setCurrentView('active');
    } else if (currentView === 'landing' || currentView === 'active') {
      setCurrentView('dashboard');
    }
  }, [isConnected, activeRoomId]);

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <Landing onStart={() => setCurrentView('dashboard')} />;
      case 'dashboard': return <Dashboard />;
      case 'active': return <ActiveRoom />;
      case 'result': return <Result />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <Profile />;
      default: return <Landing onStart={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-bg">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 noise" />
        <div className="absolute inset-0 grid-lines opacity-20" />
      </div>

      <div className="relative z-10">
        <Navbar
          onNavigate={(view: any) => setCurrentView(view)}
          currentView={currentView}
        />

        <main className="container mx-auto px-4 pt-28 pb-12 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'f-glass text-white border-white/10 rounded-2xl shadow-2xl',
          duration: 4000,
          style: {
            background: 'rgba(3, 3, 3, 0.8)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            borderRadius: '16px',
            padding: '16px',
          }
        }}
      />
    </div>
  );
}
