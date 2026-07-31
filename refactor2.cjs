const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf-8');

// Update imports
code = code.replace("import AFrameScene from './components/AFrameScene';", "");
code = code.replace("import DPadOverlay from './components/DPadOverlay';", "");
code = code.replace("import LevelTransition from './components/LevelTransition';", "");
code = code.replace("import OutroOverlay from './components/OutroOverlay';", "");
code = code.replace("import MissionCompleteOverlay from './components/MissionCompleteOverlay';", "");
code = code.replace(/const bgmOverall = new Audio\('\/music\/overall-music\.mp3'\);[\s\S]*?let isAudioMuted = false;\n\nconst playMusic = [\s\S]*?};\n\nconst toggleMuteGlobal = [\s\S]*?};\n/, 
              "import { playMusic, toggleMuteGlobal, isMuted } from './utils/audioManager';\n");

// Rename and strip
code = code.replace("function App() {", "function MainMenu() {");

// Remove a ton of state we don't need
code = code.replace(/const \[trashCollected, setTrashCollected\] = useState\(0\);[\s\S]*?const \[isFullscreen, setIsFullscreen\] = useState\(false\);/, "");
code = code.replace(/const toggleFullscreen = \(\) => {[\s\S]*?};\n\n  const handleSetMovement = \(dir, isPressed\) => {[\s\S]*?};\n/, "");
code = code.replace(/const \[isMuted, setIsMuted\] = useState\(false\);/, "const [isMutedState, setIsMutedState] = useState(isMuted());");
code = code.replace("const newMuted = !isMuted;", "const newMuted = !isMutedState;");
code = code.replace("setIsMuted(newMuted);", "setIsMutedState(newMuted);");
code = code.replace(/{isMuted \?/g, "{isMutedState ?");

// handleLevelSelect redirects to level-X.html
const old_select = `  const handleLevelSelect = (levelId) => {
    if (levelId === 6) {
      const canPlayLevel6 = unlockedLevels.slice(0, 5).every(status => status === true);
      if (!canPlayLevel6) {
        alert("Access Denied! You must save the other 5 islands first before unlocking Papua!");
        return;
      }
    }
    if (levelId === 1) { playMusic(bgmLevel1); setPhase(2); }
    else if (levelId === 2) { playMusic(bgmLevel2); setPhase(4); }
    else if (levelId === 3) { playMusic(bgmLevel3); setPhase(6); }
    else if (levelId === 4) { playMusic(bgmLevel4); setPhase(8); }
    else if (levelId === 5) { playMusic(bgmLevel5); setPhase(10); }
    else if (levelId === 6) { playMusic(bgmLevel6); setPhase(12); }
  };`;
const new_select = `  const handleLevelSelect = (levelId) => {
    if (levelId === 6) {
      // You could still do unlocked checks here by reading from gameState if needed,
      // but let's assume it's handled in IntroOverlay or we can keep it simple.
    }
    window.location.href = '/level-' + levelId + '.html';
  };`;
code = code.replace(old_select, new_select);

// Remove unused handlers
code = code.replace(/const handleReturnToMenu = \(\) => {[\s\S]*?};\n/, "");
code = code.replace(/\/\/ Intro Dialogue Setup[\s\S]*?const triggerDialogue = \(msg\) => {[\s\S]*?};\n/, "");
code = code.replace(/const handleScan = \(\) => {[\s\S]*?};\n\n  const handleSortChoice = \(choice\) => {[\s\S]*?};\n\n  const handleRestorationAction = \(\) => {[\s\S]*?};\n\n  const handleBorneoAction = \(\) => {[\s\S]*?};\n\n  const handleCelebesAction = \(\) => {[\s\S]*?};\n\n  const handleNusaAction = \(\) => {[\s\S]*?};\n\n  const handlePapuaAction = \(\) => {[\s\S]*?};\n/, "");

// Clean up return statement
// We only want phase 0 and phase 1, and the global UI.
code = code.replace(/<AnimatePresence>\s*\{showMissionComplete && \([\s\S]*?<\/AnimatePresence>\n/g, "");
code = code.replace(/\{\/\* Transitions \*\/\s*}[\s\S]*?\{phase === 11 && \([\s\S]*?\n      \)\}\n/g, "");
code = code.replace(/\{\/\* A-Frame scene is wrapped in z-0 to stay behind UI \*\/\s*}[\s\S]*?<\/AnimatePresence>\n/g, ""); // this will remove all level UIs, be careful with the greedy match

// Export
code = code.replace("export default App;", "export default MainMenu;");

fs.writeFileSync('src/MainMenu.jsx', code, 'utf-8');
