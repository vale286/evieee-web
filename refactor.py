import re

with open('src/LevelApp.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update imports
code = code.replace("import IntroOverlay from './components/IntroOverlay';", "")
code = code.replace("import LevelTransition from './components/LevelTransition';", "")
code = code.replace("import OutroOverlay from './components/OutroOverlay';", "")
code = re.sub(r"const bgmOverall = new Audio\('/music/overall-music\.mp3'\);\n.*?\nlet isAudioMuted = false;\n\nconst playMusic = .*?\n};\n\nconst toggleMuteGlobal = .*?\n};\n", 
              "import { playMusic, toggleMuteGlobal, isMuted } from './utils/audioManager';\nimport { unlockLevel } from './utils/gameState';\n", code, flags=re.DOTALL)

# 2. Function signature & initial state
code = code.replace("function App() {", "function LevelApp({ levelId }) {")
code = code.replace("const [phase, setPhase] = useState(0); // 0: Gate, 1: Intro/Menu, 2: Level 1, 3: Transition, 4: Level 2",
                    "const [phase, setPhase] = useState(levelId * 2);")

# 3. Use isMuted from audioManager instead of local state
code = code.replace("const [isMutedState, setIsMutedState] = useState(isMuted());", "")
code = re.sub(r"const \[isMuted, setIsMuted\] = useState\(false\);", "const [isMutedState, setIsMutedState] = useState(isMuted());", code)
code = code.replace("const newMuted = !isMuted;", "const newMuted = !isMutedState;")
code = code.replace("setIsMuted(newMuted);", "setIsMutedState(newMuted);")
code = code.replace("{isMuted ?", "{isMutedState ?")

# 4. handleReturnToMenu
old_return = '''  const handleReturnToMenu = () => {
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
  };'''
new_return = '''  const handleReturnToMenu = () => {
    unlockLevel(levelId + 1); // Unlock next level
    window.location.href = '/index.html';
  };'''
code = code.replace(old_return, new_return)

# 5. Play music on mount
code = code.replace("function LevelApp({ levelId }) {", '''function LevelApp({ levelId }) {
  useEffect(() => {
    playMusic('level' + levelId);
  }, [levelId]);
''')

# 6. Remove phase 0 and phase 1 blocks from return
code = re.sub(r"\{phase === 0 && \(.*?<\/AnimatePresence>", "", code, flags=re.DOTALL)
code = re.sub(r"<AnimatePresence>\s*\{phase === 1 && \(.*?</AnimatePresence>", "", code, flags=re.DOTALL)

# 7. Remove transitions from return
code = re.sub(r"\{\/\* Transitions \*\/}.*?\{phase === 11 && \(.*?\n      \)\}", "", code, flags=re.DOTALL)

# 8. Remove Outro from return
code = re.sub(r"\{\/\* Phase 13 \(Outro\) \*\/\}.*?<\/AnimatePresence>", "", code, flags=re.DOTALL)

# 9. Fix bottom-right icon onClick to keep it
# Actually it just stays.

# Export
code = code.replace("export default App;", "export default LevelApp;")

with open('src/LevelApp.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

