import React, { useState } from 'react';
import IntroOverlay from './components/IntroOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Fullscreen } from 'lucide-react';
import { playMusic, toggleMuteGlobal, isMuted } from './utils/audioManager';

function MainMenu() {
  const [phase, setPhase] = useState(() => {
    return localStorage.getItem('evieee_skip_intro') === 'true' ? 1 : 0;
  });
  const [isMutedState, setIsMutedState] = useState(isMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleToggleMute = () => {
    const newMuted = !isMutedState;
    setIsMutedState(newMuted);
    toggleMuteGlobal(newMuted);
  };

  const handleEnterSystem = () => {
    setPhase(1);
    playMusic('overall');
  };

  const handleLevelSelect = (levelId) => {
    if (levelId === 6) {
      const u1 = localStorage.getItem('evieee_unlocked_level1') === 'true' || true; // 1 is always true
      const u2 = localStorage.getItem('evieee_unlocked_level2') === 'true';
      const u3 = localStorage.getItem('evieee_unlocked_level3') === 'true';
      const u4 = localStorage.getItem('evieee_unlocked_level4') === 'true';
      const u5 = localStorage.getItem('evieee_unlocked_level5') === 'true';
      if (!(u1 && u2 && u3 && u4 && u5)) {
        alert("Access Denied! You must save the other 5 islands first before unlocking Papua!");
        return;
      }
    }
    window.location.href = `/level-${levelId}.html`;
  };

  const handleManualCertificate = () => {
    const u6 = localStorage.getItem('evieee_unlocked_level6') === 'true'; // actually it unlocks 7 if beat 6? Or wait, if we beat 6 it saves... let's say if u6 is done
    // For now just alert if they haven't finished Level 6
    alert("Certificate will be awarded after completing Level 6 (Papua).");
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-navy-900 text-white font-sans pointer-events-none">
      
      <button 
        onClick={handleToggleMute}
        className="fixed top-4 right-4 z-[999] p-2 text-sm rounded-full glass-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan/20 active:scale-95 transition-all pointer-events-auto flex items-center justify-center border-cyan/50"
      >
        {isMutedState ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} className="text-cyan" />}
      </button>

      <button 
        onClick={toggleFullscreen}
        className="fixed top-4 right-16 z-[999] p-2 text-sm rounded-full glass-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan/20 active:scale-95 transition-all pointer-events-auto flex items-center justify-center border-cyan/50"
      >
        <Fullscreen size={20} className="text-cyan" />
      </button>

      <AnimatePresence>
        {phase === 0 && (
          <motion.div 
            className="fixed inset-0 z-[999] bg-navy-900/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto"
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/20 rounded-full blur-[100px] pointer-events-none"></div>
            <img src="/Logo EvIEEE.png" alt="EvIEEE Logo" className="h-32 w-auto mx-auto mb-8 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] relative z-10" style={{ mixBlendMode: 'screen' }} />
            <motion.button 
              id="btn-enter-system"
              onClick={handleEnterSystem}
              className="glass-cyan px-10 py-5 rounded-full text-white font-bold tracking-widest text-lg uppercase shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:bg-cyan hover:text-navy-900 transition-all relative z-10 border-cyan/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶️ START ADVENTURE
            </motion.button>
            <div className="absolute bottom-4 w-full text-center text-xs text-cyan-400/60 tracking-widest uppercase">
              Copyright created by Vallen for IEEE Metaverse Grand Challenge for Simulation Based Learning 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 1 && (
          <IntroOverlay key="intro" onLevelSelect={handleLevelSelect} initialName="" />
        )}
      </AnimatePresence>


    </main>
  );
}

export default MainMenu;
