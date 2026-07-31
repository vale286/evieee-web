import fs from 'fs';

let code = fs.readFileSync('src/components/IntroOverlay.jsx', 'utf-8');

// Import gameState
if (!code.includes('isLevelUnlocked')) {
  code = code.replace("import { Send, Trash2, Leaf, Cpu, ChevronRight, Play } from 'lucide-react';", 
                      "import { Send, Trash2, Leaf, Cpu, ChevronRight, Play, Lock } from 'lucide-react';\nimport { isLevelUnlocked } from '../utils/gameState';");
}

// Modify the map rendering
const old_map_code =             {levels.map((lvl, idx) => (
              <motion.div
                key={lvl.id}
                className=\"glass p-6 rounded-2xl flex flex-col justify-between border-white/10 hover:border-cyan/50 hover:bg-white/5 transition-all group\";

const new_map_code =             {levels.map((lvl, idx) => {
              const unlocked = isLevelUnlocked(lvl.id);
              return (
              <motion.div
                key={lvl.id}
                className={\glass p-6 rounded-2xl flex flex-col justify-between border-white/10 \ transition-all group\}
;
code = code.replace(old_map_code, new_map_code);

const old_btn =                 <button
                  onClick={() => {
                    onComplete(name);
                    onLevelSelect(lvl.id);
                  }}
                  className=\"w-full glass-cyan py-3 rounded-xl text-white font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 hover:bg-cyan hover:text-navy-900 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]\"
                >
                  <Play size={14} />
                  <span>INITIATE PROTOCOL</span>
                </button>
              </motion.div>
            ))};

const new_btn =                 {unlocked ? (
                  <button
                    onClick={() => {
                      onComplete(name);
                      onLevelSelect(lvl.id);
                    }}
                    className=\"w-full glass-cyan py-3 rounded-xl text-white font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 hover:bg-cyan hover:text-navy-900 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]\"
                  >
                    <Play size={14} />
                    <span>INITIATE PROTOCOL</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className=\"w-full glass py-3 rounded-xl text-white/50 font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 cursor-not-allowed\"
                  >
                    <Lock size={14} />
                    <span>LOCKED</span>
                  </button>
                )}
              </motion.div>
            )})};

code = code.replace(old_btn, new_btn);

fs.writeFileSync('src/components/IntroOverlay.jsx', code, 'utf-8');
