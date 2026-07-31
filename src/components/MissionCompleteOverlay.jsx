import { motion } from 'framer-motion';

export default function MissionCompleteOverlay({ onReturn }) {
  return (
    <motion.div 
      id="mission-complete-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 pointer-events-auto backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="glass-cyan p-12 rounded-3xl flex flex-col items-center text-center max-w-xl mx-4 shadow-[0_0_50px_rgba(0,240,255,0.2)] border border-cyan/50 relative overflow-hidden"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-cyan mb-4 tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          MISSION ACCOMPLISHED!
        </motion.h1>

        <motion.p 
          className="text-xl text-white/90 mb-10 tracking-wide font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          You have successfully restored the ecosystem.
        </motion.p>

        <motion.button 
          id="btn-return-menu"
          onClick={onReturn}
          className="glass px-8 py-4 rounded-full text-white font-bold tracking-widest text-lg hover:bg-white/10 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center space-x-3 border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-2xl">🗺️</span>
          <span>Return to Nusantara Map</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
