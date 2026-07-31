import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Leaf, Zap, ShieldCheck } from 'lucide-react';

export default function OutroOverlay({ userName }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence
    const timers = [
      setTimeout(() => setStep(1), 1000), // Map appears dark
      setTimeout(() => setStep(2), 3000), // Map starts lighting up East to West
      setTimeout(() => setStep(3), 8000), // Fully lit, transition to certificate
      setTimeout(() => setStep(4), 9000) // Certificate shown
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const nodes = [
    { id: 'papua', x: '85%', y: '40%', delay: 0 },
    { id: 'maluku', x: '75%', y: '45%', delay: 0.5 },
    { id: 'celebes', x: '65%', y: '40%', delay: 1 },
    { id: 'nusa', x: '60%', y: '70%', delay: 1.5 },
    { id: 'borneo', x: '50%', y: '30%', delay: 2 },
    { id: 'java', x: '40%', y: '65%', delay: 2.5 },
    { id: 'sumatra', x: '20%', y: '35%', delay: 3 },
  ];

  const connections = [
    { from: 'papua', to: 'maluku' },
    { from: 'maluku', to: 'celebes' },
    { from: 'celebes', to: 'nusa' },
    { from: 'celebes', to: 'borneo' },
    { from: 'nusa', to: 'java' },
    { from: 'borneo', to: 'java' },
    { from: 'java', to: 'sumatra' },
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-900/50 via-black to-black"></div>

      {step >= 1 && step < 4 && (
        <div className="relative w-full max-w-5xl aspect-video">
          <h2 className="absolute top-10 w-full text-center text-3xl font-bold tracking-widest uppercase text-white/50">Restoring Nusantara</h2>
          
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn, i) => {
              const start = nodes.find(n => n.id === conn.from);
              const end = nodes.find(n => n.id === conn.to);
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="#00f0ff"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={step >= 2 ? { pathLength: 1, opacity: 0.6 } : {}}
                  transition={{ duration: 1.5, delay: end.delay, ease: "easeInOut" }}
                  className="drop-shadow-[0_0_10px_rgba(0,240,255,1)]"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => (
            <div 
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-white/10 border border-white/20"
                initial={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', scale: 1, boxShadow: 'none' }}
                animate={step >= 2 ? { 
                  backgroundColor: '#4ade80', 
                  borderColor: '#00f0ff',
                  scale: [1, 1.5, 1.2],
                  boxShadow: ['0 0 0px rgba(0,0,0,0)', '0 0 30px rgba(74,222,128,1)', '0 0 20px rgba(0,240,255,0.8)']
                } : {}}
                transition={{ duration: 1, delay: node.delay }}
              />
              <motion.div 
                className="mt-2 text-xs font-bold text-center uppercase tracking-widest"
                initial={{ color: 'rgba(255,255,255,0.2)' }}
                animate={step >= 2 ? { color: '#00f0ff', textShadow: '0 0 10px rgba(0,240,255,0.8)' } : {}}
                transition={{ duration: 0.5, delay: node.delay }}
              >
                {node.id}
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div 
            className="relative z-10 glass-cyan p-12 rounded-3xl max-w-3xl w-full mx-4 shadow-[0_0_50px_rgba(0,240,255,0.3)] border border-cyan/50 text-center overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
          >
            {/* Decorative background for certificate */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px]"></div>

            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="mx-auto w-24 h-24 mb-8 rounded-full bg-gradient-to-tr from-cyan to-green-400 p-1 shadow-[0_0_30px_rgba(74,222,128,0.5)] flex items-center justify-center"
            >
              <div className="w-full h-full bg-navy-900 rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-cyan" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              CERTIFICATE OF EXCELLENCE
            </motion.h1>
            
            <motion.p 
              className="text-cyan text-xl mb-8 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Eco-Hero Award
            </motion.p>

            <motion.div 
              className="text-2xl font-light text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p>Congratulations, <span className="font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{userName || 'Player'}</span>!</p>
              <p className="mt-4 text-lg">You are a Certified Eco-Hero.</p>
            </motion.div>

            <motion.div 
              className="glass p-6 rounded-2xl border-white/10 mb-8 inline-block mx-auto text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <p className="text-sm text-white/90 italic leading-relaxed max-w-xl text-center">
                "Thanks to your help, Nusantara is now an inclusive, sustainable, and safe Smart City network. 
                Technology is not the enemy of nature, but its protector."
              </p>
            </motion.div>

            <motion.div 
              className="flex justify-center items-center space-x-6 text-cyan/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <div className="flex flex-col items-center"><Leaf className="w-6 h-6 mb-2" /><span className="text-[10px] uppercase tracking-widest">Sustainable</span></div>
              <div className="flex flex-col items-center"><Zap className="w-6 h-6 mb-2" /><span className="text-[10px] uppercase tracking-widest">Innovation</span></div>
              <div className="flex flex-col items-center"><ShieldCheck className="w-6 h-6 mb-2" /><span className="text-[10px] uppercase tracking-widest">Safe</span></div>
            </motion.div>

            <motion.button
              className="mt-12 glass-cyan px-8 py-3 rounded-full text-white font-bold tracking-widest uppercase hover:bg-cyan hover:text-navy-900 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              onClick={() => window.location.reload()}
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
