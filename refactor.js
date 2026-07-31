const fs = require('fs');

let code = fs.readFileSync('src/LevelApp.jsx', 'utf-8');

// 1. Update imports
code = code.replace("import IntroOverlay from './components/IntroOverlay';", "");
code = code.replace("import LevelTransition from './components/LevelTransition';", "");
code = code.replace("import OutroOverlay from './components/OutroOverlay';", "");
code = code.replace(/const bgmOverall = new Audio\('\/music\/overall-music\.mp3'\);[\s\S]*?let isAudioMuted = false;\n\nconst playMusic = [\s\S]*?};\n\nconst toggleMuteGlobal = [\s\S]*?};\n/, 
              "import { playMusic, toggleMuteGlobal, isMuted } from './utils/audioManager';\nimport { unlockLevel } from './utils/gameState';\n");

// 2. Function signature & initial state
code = code.replace("function App() {", "function LevelApp({ levelId }) {");
code = code.replace("const [phase, setPhase] = useState(0); // 0: Gate, 1: Intro/Menu, 2: Level 1, 3: Transition, 4: Level 2",
                    "const [phase, setPhase] = useState(levelId * 2);");

// 3. Use isMuted from audioManager instead of local state
code = code.replace("const [isMutedState, setIsMutedState] = useState(isMuted());", "");
code = code.replace("const [isMuted, setIsMuted] = useState(false);", "const [isMutedState, setIsMutedState] = useState(isMuted());");
code = code.replace("const newMuted = !isMuted;", "const newMuted = !isMutedState;");
code = code.replace("setIsMuted(newMuted);", "setIsMutedState(newMuted);");
code = code.replace(/{isMuted \?/g, "{isMutedState ?");

// 4. handleReturnToMenu
const old_return = `  const handleReturnToMenu = () => {
    let levelIndex = -1;
    if (phase === 2) levelIndex = 0;
    else if (phase === 4) levelIndex = 1;
    else if (phase === 6) levelIndex = 2;
    else if (phase === 8) levelIndex = 3;
    else if (phase === 10) levelIndex = 4;
    else if (phase === 12) levelIndex = 5;

    if (levelIndex !== -1) {
      setUnlockedLevels(prev => {
        const newArr = [...prev];
        newArr[levelIndex] = true;
        return newArr;
      });
    }

    setShowMissionComplete(false);
    setPhase(1);
    setCurrentStep(1);
    setTrashCollected(0);
    playMusic(bgmOverall);
  };`;
const new_return = `  const handleReturnToMenu = () => {
    unlockLevel(levelId + 1); // Unlock next level
    window.location.href = '/index.html';
  };`;
code = code.replace(old_return, new_return);

// 5. Play music on mount
code = code.replace("function LevelApp({ levelId }) {", `function LevelApp({ levelId }) {\n  useEffect(() => {\n    playMusic('level' + levelId);\n  }, [levelId]);\n`);

// 6. Remove phase 0 and phase 1 blocks from return
code = code.replace(/\{phase === 0 && \([\s\S]*?<\/AnimatePresence>/g, "");
code = code.replace(/<AnimatePresence>\s*\{phase === 1 && \([\s\S]*?<\/AnimatePresence>/g, "");

// 7. Remove transitions from return
code = code.replace(/\{\/\* Transitions \*\/\}[\s\S]*?\{phase === 11 && \([\s\S]*?\n      \)\}/g, "");

// 8. Remove Outro from return
code = code.replace(/\{\/\* Phase 13 \(Outro\) \*\/\}[\s\S]*?<\/AnimatePresence>/g, "");

// Export
code = code.replace("export default App;", "export default LevelApp;");

fs.writeFileSync('src/LevelApp.jsx', code, 'utf-8');
