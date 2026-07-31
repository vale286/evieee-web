import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Leaf, Cpu, ChevronRight, Play } from 'lucide-react';

const TypewriterText = ({ text, onComplete, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

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
  const [step, setStep] = useState(initialName ? 2 : 0); // 0: welcome, 1: ask name, 2: level selector
  const [isTyping, setIsTyping] = useState(!initialName);
  const [name, setName] = useState(initialName);

  const textStep0 = "Welcome to EvIEEE. This is a simulation platform designed to build sustainable smart cities and inclusive futures.";
  const textStep1 = "Before we begin our tour, may I know your name?";

  const handleNextStep = () => {
    setStep(1);
    setIsTyping(true);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

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
        className={`pointer-events-auto w-full mx-4 glass-cyan p-8 rounded-2xl relative overflow-hidden flex flex-col min-h-[300px] ${step === 2 ? 'max-w-4xl' : 'max-w-lg'}`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/20 rounded-full blur-[50px] pointer-events-none"></div>

        {step < 2 ? (
          <div className="flex flex-col items-center mb-6 border-b border-white/10 pb-6 text-center">
            <img src="/Logo EvIEEE.png" alt="EvIEEE Logo" className="h-24 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" style={{ mixBlendMode: 'screen' }} />
            <h2 className="text-white font-bold text-2xl tracking-wide">EvIEEE</h2>
            <p className="text-cyan/70 text-sm uppercase tracking-widest mt-1">AI Guide</p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 pb-4 text-center">
            <img src="/Logo EvIEEE.png" alt="EvIEEE Logo" className="h-24 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" style={{ mixBlendMode: 'screen' }} />
            <h2 className="text-white font-bold text-2xl tracking-widest uppercase">Nusantara Map</h2>
            <p className="text-cyan/70 text-sm tracking-widest mt-1">Select a Level to Begin</p>
          </div>
        )}

        {step < 2 ? (
          <>
            <div className="flex-1 text-lg font-light text-white/90 leading-relaxed">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TypewriterText text={textStep0} onComplete={() => setIsTyping(false)} />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TypewriterText text={textStep1} onComplete={() => setIsTyping(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 h-[60px] flex items-end justify-end">
              <AnimatePresence>
                {step === 0 && !isTyping && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={handleNextStep}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan/20 hover:bg-cyan/40 text-cyan rounded-lg transition-colors border border-cyan/30"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </motion.button>
                )}
                {step === 1 && !isTyping && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleNameSubmit}
                    className="relative w-full flex items-center"
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full bg-navy-900/50 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none focus:border-cyan/50 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="absolute right-2 p-2 bg-cyan/20 hover:bg-cyan/40 text-cyan rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-8 h-full overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
            {levels.map((lvl, idx) => (
              <motion.div
                key={lvl.id}
                className="glass p-6 rounded-2xl flex flex-col justify-between border-white/10 hover:border-cyan/50 hover:bg-white/5 transition-all group"
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
                <button
                  onClick={() => {
                    onComplete(name);
                    onLevelSelect(lvl.id);
                  }}
                  className="w-full glass-cyan py-3 rounded-xl text-white font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 hover:bg-cyan hover:text-navy-900 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  <Play size={14} />
                  <span>INITIATE PROTOCOL</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
