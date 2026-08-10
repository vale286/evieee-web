import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function DPadOverlay({ setMovement }) {
  const handleStart = (dir) => (e) => {
    e.preventDefault();
    setMovement(dir, true);
  };
  const handleEnd = (dir) => (e) => {
    e.preventDefault();
    setMovement(dir, false);
  };

  const btnClass = "p-2 md:p-3 text-xs md:text-base bg-slate-800/80 border border-cyan-400 rounded hover:bg-cyan-900 transition-colors flex items-center justify-center select-none touch-none text-white";

  return (
    <div id="d-pad" className="fixed bottom-4 right-4 z-[999] grid grid-cols-3 gap-1 md:gap-2 pointer-events-auto">
        <div></div>
        <button 
          id="btn-up" 
          className={btnClass}
          onPointerDown={handleStart('forward')}
          onPointerUp={handleEnd('forward')}
          onPointerLeave={handleEnd('forward')}
          onTouchStart={handleStart('forward')}
          onTouchEnd={handleEnd('forward')}
          onContextMenu={(e) => e.preventDefault()}
        >⬆️</button>
        <div></div>
        <button 
          id="btn-left" 
          className={btnClass}
          onPointerDown={handleStart('left')}
          onPointerUp={handleEnd('left')}
          onPointerLeave={handleEnd('left')}
          onTouchStart={handleStart('left')}
          onTouchEnd={handleEnd('left')}
          onContextMenu={(e) => e.preventDefault()}
        >⬅️</button>
        <button 
          id="btn-down" 
          className={btnClass}
          onPointerDown={handleStart('backward')}
          onPointerUp={handleEnd('backward')}
          onPointerLeave={handleEnd('backward')}
          onTouchStart={handleStart('backward')}
          onTouchEnd={handleEnd('backward')}
          onContextMenu={(e) => e.preventDefault()}
        >⬇️</button>
        <button 
          id="btn-right" 
          className={btnClass}
          onPointerDown={handleStart('right')}
          onPointerUp={handleEnd('right')}
          onPointerLeave={handleEnd('right')}
          onTouchStart={handleStart('right')}
          onTouchEnd={handleEnd('right')}
          onContextMenu={(e) => e.preventDefault()}
        >➡️</button>
    </div>
  );
}
