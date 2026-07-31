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

  const btnClass = "w-16 h-16 glass rounded-xl flex items-center justify-center text-cyan hover:bg-cyan/20 active:bg-cyan/40 transition-colors select-none touch-none";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-center pointer-events-auto">
      <div className="mb-2">
        <button 
          className={btnClass}
          onPointerDown={handleStart('forward')}
          onPointerUp={handleEnd('forward')}
          onPointerLeave={handleEnd('forward')}
          onTouchStart={handleStart('forward')}
          onTouchEnd={handleEnd('forward')}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ArrowUp size={32} />
        </button>
      </div>
      <div className="flex space-x-2">
        <button 
          className={btnClass}
          onPointerDown={handleStart('left')}
          onPointerUp={handleEnd('left')}
          onPointerLeave={handleEnd('left')}
          onTouchStart={handleStart('left')}
          onTouchEnd={handleEnd('left')}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ArrowLeft size={32} />
        </button>
        <button 
          className={btnClass}
          onPointerDown={handleStart('backward')}
          onPointerUp={handleEnd('backward')}
          onPointerLeave={handleEnd('backward')}
          onTouchStart={handleStart('backward')}
          onTouchEnd={handleEnd('backward')}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ArrowDown size={32} />
        </button>
        <button 
          className={btnClass}
          onPointerDown={handleStart('right')}
          onPointerUp={handleEnd('right')}
          onPointerLeave={handleEnd('right')}
          onTouchStart={handleStart('right')}
          onTouchEnd={handleEnd('right')}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ArrowRight size={32} />
        </button>
      </div>
    </div>
  );
}
