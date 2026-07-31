import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin } from 'lucide-react';

export default function LevelTransition({ fromLevel = 1, toLevel = 2, onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Start moving
      setTimeout(() => setStep(2), 4000), // Arrive
      setTimeout(() => onComplete(), 6000), // Complete transition
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Positions on map
  const pos = {
    1: { left: '70%', top: '70%', name: 'JAVA' },
    2: { left: '30%', top: '50%', name: 'ANDALAS' },
    3: { left: '60%', top: '30%', name: 'BORNEO' },
    4: { left: '80%', top: '40%', name: 'CELEBES' },
    5: { left: '60%', top: '75%', name: 'NUSA' },
    6: { left: '90%', top: '35%', name: 'PAPUA' }
  };

  const startPos = pos[fromLevel];
  const endPos = pos[toLevel];

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-navy-900 flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white tracking-widest uppercase mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">Mission Complete</h2>
        <p className="text-cyan text-lg">Traveling to the next destination...</p>
      </div>

      <div className="relative w-full max-w-4xl aspect-video bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)] flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <Map className="absolute opacity-10 w-[80%] h-[80%] text-cyan" />

        <div className="relative w-full h-full flex items-center justify-center mt-12">
          
          {/* Start Marker */}
          <div className="absolute flex flex-col items-center" style={{ left: startPos.left, top: startPos.top, transform: 'translate(-50%, -50%)' }}>
            <div className="w-4 h-4 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)]"></div>
            <span className="mt-4 font-bold text-green-400 tracking-widest">{startPos.name}</span>
          </div>

          {/* End Marker */}
          <div className="absolute flex flex-col items-center" style={{ left: endPos.left, top: endPos.top, transform: 'translate(-50%, -50%)' }}>
            <div className="w-6 h-6 rounded-full bg-cyan/20 border-2 border-cyan flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan animate-ping"></div>
            </div>
            <span className="mt-4 font-bold text-cyan tracking-widest text-xl drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">{endPos.name}</span>
          </div>

          {/* Player moving */}
          <motion.div 
            className="absolute flex flex-col items-center z-10"
            initial={{ left: startPos.left, top: startPos.top, x: '-50%', y: '-100%' }}
            animate={step >= 1 ? { left: endPos.left, top: endPos.top, x: '-50%', y: '-100%' } : {}}
            transition={{ duration: 3, ease: 'easeInOut' }}
          >
            <div className="relative">
              <MapPin className="text-white w-12 h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" fill="#00f0ff" />
              {step >= 1 && step < 2 && (
                <motion.div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/50 rounded-[100%] blur-sm"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
