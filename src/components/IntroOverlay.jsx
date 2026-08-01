import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Leaf, Cpu, ChevronRight, Play, Lock } from 'lucide-react';
import { isLevelUnlocked } from '../utils/gameState';



const floatingAnimation = (delay) => ({
  y: ['-15px', '15px'],
  transition: {
    y: {
      duration: 3 + delay * 0.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
});

export default function IntroOverlay({ onComplete, initialName = '', onLevelSelect }) {
  const [step, setStep] = useState(initialName ? 2 : 0); // 0: welcome, 2: level selector
  const [name, setName] = useState(initialName || 'Eco-Hero');

  const levels = [
    { id: 1, name: "Java", desc: "Urban Waste Management" },
    { id: 2, name: "Andalas", desc: "Eco-Restoration Mitigation" },
    { id: 3, name: "Borneo", desc: "Peatland Fire Rescue" },
    { id: 4, name: "Celebes", desc: "Marine Bio-Tech System" },
    { id: 5, name: "Nusa", desc: "Smart Agriculture System" },
    { id: 6, name: "Papua", desc: "Renewable Microgrid" }
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-navy-900 overflow-hidden pointer-events-auto"
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div 
        className="absolute inset-0 opacity-40" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)', 
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-[20%] left-[15%] text-white/50 glass p-4 rounded-2xl border-white/10" animate={floatingAnimation(0)}>
          <Trash2 size={32} className="text-cyan/70 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </motion.div>
        <motion.div className="absolute top-[60%] left-[10%] text-white/50 glass p-4 rounded-full border-green-400/20" animate={floatingAnimation(1)}>
          <Leaf size={40} className="text-green-400/80 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
        </motion.div>
        <motion.div className="absolute top-[30%] right-[15%] text-white/50 glass-cyan p-5 rounded-xl" animate={floatingAnimation(2)}>
          <Cpu size={48} className="text-cyan drop-shadow-[0_0_15px_rgba(0,240,255,1)]" />
        </motion.div>
      </div>

      <motion.div
        className={`pointer-events-auto w-full mx-4 glass-cyan p-6 rounded-2xl relative overflow-hidden flex flex-col min-h-[300px] ${step === 2 ? 'max-w-2xl' : 'max-w-lg'}`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/20 rounded-full blur-[50px] pointer-events-none"></div>

        {step === 0 ? (
          <div className="flex flex-col items-center mb-6 text-center mt-4">
            <h2 className="text-white font-bold text-3xl tracking-wide mb-6 text-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">Welcome to EvIEEE</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-10 max-w-sm">
              EvIEEE features representations of various local islands across Indonesia, seamlessly integrating smart city concepts with environmental conservation.
            </p>
            <button
              onClick={() => setStep(2)}
              className="glass-cyan px-8 py-4 rounded-xl text-white font-bold tracking-widest text-sm uppercase flex items-center justify-center hover:bg-cyan hover:text-navy-900 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              Continue to Nusantara Map 🗺️
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 pb-4 text-center">
            <img src="/Logo EvIEEE.png" alt="EvIEEE Logo" className="h-16 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" style={{ mixBlendMode: 'screen' }} />
            <h2 className="text-white font-bold text-2xl tracking-widest uppercase">Nusantara Map</h2>
            <p className="text-cyan/70 text-sm tracking-widest mt-1">Select a Level to Begin</p>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {levels.map((lvl, idx) => {
              const unlocked = isLevelUnlocked(lvl.id);
              return (
              <motion.div
                key={lvl.id}
                className={`glass p-6 rounded-2xl flex flex-col justify-between border-white/10 ${unlocked ? 'hover:border-cyan/50 hover:bg-white/5' : 'opacity-70 grayscale'} transition-all group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan text-xs font-bold tracking-widest uppercase">Level {lvl.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan transition-colors">{lvl.name}</h3>
                  <p className="text-white/60 text-sm mb-6">{lvl.desc}</p>
                </div>
                {unlocked ? (
                  <button
                    onClick={() => {
                      if (onComplete) onComplete(name);
                      onLevelSelect(lvl.id);
                    }}
                    className="w-full glass-cyan py-3 rounded-xl text-white font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 hover:bg-cyan hover:text-navy-900 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    <Play size={14} />
                    <span>START MISSION</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full glass py-3 rounded-xl text-white/50 font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 cursor-not-allowed"
                  >
                    <Lock size={14} />
                    <span>LOCKED</span>
                  </button>
                )}
              </motion.div>
            )})}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
