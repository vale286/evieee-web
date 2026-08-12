import { useState, useEffect, useRef } from 'react';

import AFrameScene from './components/AFrameScene';
import DPadOverlay from './components/DPadOverlay';


import MissionCompleteOverlay from './components/MissionCompleteOverlay';
import CertificateOverlay from './components/CertificateOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Recycle, Maximize, Minimize, CheckCircle, Leaf, Flame, Droplets, Zap, Volume2, VolumeX } from 'lucide-react';

import { playMusic, toggleMuteGlobal, isMuted } from './utils/audioManager';
function LevelApp({ levelId }) {
  useEffect(() => {
    playMusic('level' + levelId);
  }, [levelId]);

  const [phase, setPhase] = useState(levelId * 2);
  const [userName, setUserName] = useState('');
  const [isMutedState, setIsMutedState] = useState(isMuted());
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState([false, false, false, false, false, false]);
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Level 1 State
  const [trashCollected, setTrashCollected] = useState(0);
  const [currentTrashId, setCurrentTrashId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Level 2 State (Eco-Restoration 3-Step)
  const [currentStep, setCurrentStep] = useState(1); // 1: Clean, 2: Plant, 3: Nurture, 4: Complete

  const [dialogue, setDialogue] = useState('');
  const [showDialogue, setShowDialogue] = useState(false);
  const dialogTimerRef = useRef(null);
  const dialogCallbackRef = useRef(null);

  const handleSkipDialogue = () => {
    window.speechSynthesis.cancel();
    if (dialogTimerRef.current) {
      clearTimeout(dialogTimerRef.current);
      dialogTimerRef.current = null;
    }
    setShowDialogue(false);
    if (dialogCallbackRef.current) {
      dialogCallbackRef.current();
      dialogCallbackRef.current = null;
    }
  };

  // Centralized helper: schedule dialog auto-hide with a clearable timer
  const scheduleHideDialogue = (ms, callback) => {
    if (dialogTimerRef.current) clearTimeout(dialogTimerRef.current);
    dialogCallbackRef.current = callback || null;
    dialogTimerRef.current = setTimeout(() => {
      setShowDialogue(false);
      dialogTimerRef.current = null;
      if (dialogCallbackRef.current) {
        dialogCallbackRef.current();
        dialogCallbackRef.current = null;
      }
    }, ms);
  };
  
  // Movement State
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSetMovement = (dir, isPressed) => {
    setMovement(prev => ({ ...prev, [dir]: isPressed }));
  };

  const handleToggleMute = () => {
    const newMuted = !isMutedState;
    setIsMutedState(newMuted);
    toggleMuteGlobal(newMuted);
  };

  const handleEnterSystem = () => {
    setPhase(1);
    playMusic('overall');
  };

  const handleIntroComplete = (name) => {
    setUserName(name);
  };
  
  const handleLevelSelect = (levelId) => {
    if (levelId === 6) {
      const canPlayLevel6 = unlockedLevels.slice(0, 5).every(status => status === true);
      if (!canPlayLevel6) {
        alert("Access Denied! You must save the other 5 islands first before unlocking Papua!");
        return;
      }
    }
    if (levelId === 1) { playMusic('level1'); setPhase(2); }
    else if (levelId === 2) { playMusic('level2'); setPhase(4); }
    else if (levelId === 3) { playMusic('level3'); setPhase(6); }
    else if (levelId === 4) { playMusic('level4'); setPhase(8); }
    else if (levelId === 5) { playMusic('level5'); setPhase(10); }
    else if (levelId === 6) { playMusic('level6'); setPhase(12); }
  };

  const handleReturnToMenu = () => {
    let levelIndex = -1;
    if (phase === 2) levelIndex = 0;
    else if (phase === 4) levelIndex = 1;
    else if (phase === 6) levelIndex = 2;
    else if (phase === 8) levelIndex = 3;
    else if (phase === 10) levelIndex = 4;
    else if (phase === 12) levelIndex = 5;

    if (levelIndex !== -1) {
      const nextLevelId = levelIndex + 2;
      localStorage.setItem(`evieee_unlocked_level${nextLevelId}`, 'true');
    }

    localStorage.setItem('evieee_skip_intro', 'true');
    window.location.href = '/';
  };

  const handleDownloadCertificate = async (name, location) => {
    // Dynamically load jsPDF if not already available
    if (!window.jspdf) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load jsPDF library'));
          document.head.appendChild(script);
        });
      } catch (e) {
        console.error("jsPDF load error:", e);
        alert("Failed to load PDF library. Please check your internet connection and try again.");
        return;
      }
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      alert("PDF library not available. Please refresh the page and try again.");
      return;
    }

    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });

    try {
        // Load images and Poppins font concurrently
        const loadFont = async (url) => {
          const res = await fetch(url);
          const buf = await res.arrayBuffer();
          let binary = '';
          const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        };

        const [bgImg, sealImg, poppinsRegularB64, poppinsBoldB64, poppinsItalicB64] = await Promise.all([
            loadImage('/template_certificate.png'),
            loadImage('/icon_sertif.png'),
            loadFont('https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-400-normal.ttf'),
            loadFont('https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-700-normal.ttf'),
            loadFont('https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-400-italic.ttf'),
        ]);

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // Register Poppins fonts
        doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegularB64);
        doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
        doc.addFileToVFS('Poppins-Bold.ttf', poppinsBoldB64);
        doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');
        doc.addFileToVFS('Poppins-Italic.ttf', poppinsItalicB64);
        doc.addFont('Poppins-Italic.ttf', 'Poppins', 'italic');

        // 1. Draw Background Template
        doc.addImage(bgImg, 'PNG', 0, 0, 297, 210);
        
        // 2. Main Title - "EvIEEE SMART CITY METAVERSE ADVENTURE"
        doc.setFont("Poppins", "bold");
        doc.setFontSize(22);
        doc.setTextColor(32, 38, 100); // #202664
        doc.text("EvIEEE SMART CITY METAVERSE ADVENTURE", 148, 48, { align: "center" });
        
        // 3. Subtitle - IEEE Program
        doc.setFont("Poppins", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Black
        doc.text("Part of IEEE Metaverse Grand Challenge for Simulation Based Learning 2026", 148, 56, { align: "center" });
        
        // 4. Certificate Title
        doc.setFont("Poppins", "bold");
        doc.setFontSize(32);
        doc.setTextColor(32, 38, 100); // #202664
        doc.text("CERTIFICATE OF COMPLETION", 148, 72, { align: "center" });
        
        // 5. "Proudly Presented To:"
        doc.setFont("Poppins", "normal");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Black
        doc.text("Proudly Presented To:", 148, 92, { align: "center" });
        
        // 6. Dynamic Name
        doc.setFont("Poppins", "bold");
        doc.setFontSize(40);
        doc.setTextColor(139, 7, 20); // #8b0714
        const certName = name || document.getElementById('user-name-input')?.value || "Eco-Hero"; 
        doc.text(certName, 148, 115, { align: "center" });
        
        // 7. Encouragement Message
        doc.setFont("Poppins", "italic");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black
        const closingMessage = "Hopefully, you can become a true local hero in " + location + "!";
        doc.text(closingMessage, 148, 135, { align: "center" });
        
        // 8. Sustainability Impact Section
        doc.setFont("Poppins", "bold");
        doc.setFontSize(10);
        doc.setTextColor(32, 38, 100); // #202664
        doc.text("SIMULATED SUSTAINABILITY IMPACT:", 148, 155, { align: "center" });
        
        doc.setFont("Poppins", "normal");
        doc.setTextColor(0, 0, 0); // Black
        doc.text("• 150kg Carbon Reduced   • 5,000 Trees Planted   • 200kg Marine Waste Cleared", 148, 163, { align: "center" });
        
        // 9. Footer (Auto-Date and System Name)
        const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Black
        doc.text(`Date of Completion: ${today}`, 20, 192, { align: "left" });

        // 10. Add Medal
        doc.addImage(sealImg, 'PNG', 230, 140, 45, 45); 

        // 11. Save PDF
        doc.save(certName.replace(/\s+/g, '_') + "_Eco_Hero_Certificate.pdf");

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate certificate. Please check your connection and try again.");
    }
  };

  // Intro Dialogue Setup
  useEffect(() => {
    if (phase === 2) {
      setTimeout(() => {
        setDialogue(`Welcome to Java! The city is in danger. GUIDE: Explore the area and use the "Scan Area" button to find and sort trash!`);
        setShowDialogue(true);
        scheduleHideDialogue(5000);
      }, 1000);
    } else if (phase === 4) {
      setTimeout(() => {
        setDialogue(`Oh no! The forest is destroyed. We must restore it step-by-step to stop the flood!`);
        setShowDialogue(true);
        scheduleHideDialogue(12000);
      }, 1000);
    } else if (phase === 6) {
      setTimeout(() => {
        setDialogue(`Welcome to Borneo! Peatland fires are causing toxic smog and animals are trapped! We must act fast!`);
        setShowDialogue(true);
        scheduleHideDialogue(12000);
      }, 1000);
    } else if (phase === 8) {
      setTimeout(() => {
        setDialogue(`Welcome to Celebes! The coral reefs are sick. Deploy the IoT (Internet of Things) Rover, a Smart Remote-Controlled Submarine, to clean the waste and plant Bio-Corals!`);
        setShowDialogue(true);
        scheduleHideDialogue(12000);
      }, 1000);
    } else if (phase === 10) {
      setTimeout(() => {
        setDialogue(`Welcome to Nusa! The land is dry and crops are failing. Use the Soil Scanner and deploy the AI Irrigation System!`);
        setShowDialogue(true);
        scheduleHideDialogue(12000);
      }, 1000);
    } else if (phase === 12) {
      setTimeout(() => {
        setDialogue(`Welcome to Papua! The village is in darkness. Build a Renewable Energy Microgrid to bring clean power!`);
        setShowDialogue(true);
        scheduleHideDialogue(12000);
      }, 1000);
    }
  }, [phase, userName]);

  // UI Action Handlers
  const triggerDialogue = (msg) => {
    setDialogue(msg);
    setShowDialogue(true);
    scheduleHideDialogue(5000);
  };

  const handleScan = () => {
    if (phase === 2) {
      const trashItems = document.querySelectorAll('.trash-item');
      let found = null;
      for (let i = 0; i < trashItems.length; i++) {
        if (trashItems[i].dataset.collected !== 'true') {
          found = trashItems[i];
          break;
        }
      }

      if (found) {
        setCurrentTrashId(found.id);
        
        let highlight = found.querySelector('.trash-highlight');
        if (!highlight) {
          highlight = document.createElement('a-box');
          highlight.setAttribute('class', 'trash-highlight');
          highlight.setAttribute('wireframe', 'true');
          highlight.setAttribute('color', '#00f0ff');
          highlight.setAttribute('width', '1.5');
          highlight.setAttribute('height', '1.5');
          highlight.setAttribute('depth', '1.5');
          highlight.setAttribute('position', '0 0.5 0');
          highlight.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear');
          found.appendChild(highlight);
        }
        
        let label = found.querySelector('.trash-label');
        if (!label) {
          label = document.createElement('a-text');
          label.setAttribute('class', 'trash-label');
          label.setAttribute('value', found.dataset.name || 'Trash');
          label.setAttribute('color', '#00f0ff');
          label.setAttribute('align', 'center');
          label.setAttribute('position', '0 1.0 0');
          label.setAttribute('scale', '1.5 1.5 1.5');
          found.appendChild(label);
        }
      } else {
        triggerDialogue("Area is clean! Great job!");
      }
    }
  };

  const handleSortChoice = (choice) => {
    setIsModalOpen(false);
    
    if (!currentTrashId) return;
    
    const trashEl = document.getElementById(currentTrashId);
    if (!trashEl) return;
    
    if (choice === 'cancel') {
      const highlight = trashEl.querySelector('.trash-highlight');
      if (highlight) trashEl.removeChild(highlight);
      const label = trashEl.querySelector('.trash-label');
      if (label) trashEl.removeChild(label);
      setCurrentTrashId(null);
      return;
    }

    const actualType = trashEl.dataset.type;
    
    if (actualType === choice) {
      const highlight = trashEl.querySelector('.trash-highlight');
      if (highlight) trashEl.removeChild(highlight);
      const label = trashEl.querySelector('.trash-label');
      if (label) trashEl.removeChild(label);

      trashEl.dataset.collected = 'true';
      setCurrentTrashId(null);
      
      const targetBinId = `bin-${choice}`;
      const binEl = document.getElementById(targetBinId);
      
      if (binEl && typeof AFRAME !== 'undefined') {
        const binPos = new AFRAME.THREE.Vector3();
        binEl.object3D.getWorldPosition(binPos);
        binPos.y += 1;
        
        trashEl.setAttribute('animation', `property: position; to: ${binPos.x} ${binPos.y} ${binPos.z}; dur: 1000; easing: easeInOutQuad`);
        
        setTimeout(() => {
          trashEl.setAttribute('visible', 'false');
          setTrashCollected(prev => {
            const newVal = prev + 1;
            if (newVal === 3) {
              setDialogue("REAL WORLD IMPACT: Sorting and recycling reduces landfill waste and turns old paper into new plants!");
              setShowDialogue(true);
              scheduleHideDialogue(8000, () => setShowMissionComplete(true));
            } else {
              triggerDialogue("Great job! Processing waste... Success!");
            }
            return newVal;
          });
        }, 1000);
      }
    } else {
      triggerDialogue("Oops! That belongs in the other bin. Try again!");
    }
  };

  const handleRestorationAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("River cleaned! Now, let's plant new seeds.");
      setShowDialogue(true);
      scheduleHideDialogue(8000);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Seeds planted! They need water and sunlight to grow strong.");
      setShowDialogue(true);
      scheduleHideDialogue(8000);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("REAL WORLD IMPACT: Planting trees prevents deadly floods and absorbs bad pollution from the air!");
      setShowDialogue(true);
      scheduleHideDialogue(8000, () => setShowMissionComplete(true));
    }
  };

  const handleBorneoAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("Drone deployed! Positioned above the fire zones.");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("REAL WORLD IMPACT: Putting out peat fires stops toxic smog and saves the homes of endangered animals!");
      setShowDialogue(true);
      scheduleHideDialogue(8000, () => setShowMissionComplete(true));
    }
  };

  const handleCelebesAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("IoT Rover deployed! Starting marine waste clean-up.");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Waste cleared! Deploying Bio-Coral skeletons for fast growth.");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("REAL WORLD IMPACT: Restoring coral reefs brings back fish, cleans the ocean, and protects our coastlines!");
      setShowDialogue(true);
      scheduleHideDialogue(8000, () => setShowMissionComplete(true));
    }
  };

  const handleNusaAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("Dry area scanned! Connecting AI irrigation pipes.");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Pipes connected! Distributing water evenly across the fields.");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("WONDERFUL! The crops are growing and the land is thriving again. You saved Nusa!");
      setShowDialogue(true);
      scheduleHideDialogue(8000, () => setShowMissionComplete(true));
    }
  };

  const handlePapuaAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("Microgrid constructed! Now, align the solar panels to the sun.");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Panels aligned! Absorbing solar energy... Powering up the village!");
      setShowDialogue(true);
      scheduleHideDialogue(6000);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("INCREDIBLE! The village is glowing with clean energy. You have saved Nusantara!");
      setShowDialogue(true);
      scheduleHideDialogue(8000, () => {
        setShowCertificate(true);
        playMusic('congrats');
      });
    }
  };

  return (
    <>
      {/* A-Frame 3D Scene — rendered inside absolute z-0 wrapper */}
      <div className="absolute inset-0 w-screen h-screen z-0 bg-transparent">
        {(phase === 2 || phase === 4 || phase === 6 || phase === 8 || phase === 10 || phase === 12) && (
          <AFrameScene movementState={movement} level={phase === 4 ? 2 : phase === 6 ? 3 : phase === 8 ? 4 : phase === 10 ? 5 : phase === 12 ? 6 : 1} currentStep={currentStep} />
        )}
      </div>

      {/* UI Layer — transparent fixed overlay ON TOP of the 3D scene */}
      <main className="fixed inset-0 z-50 overflow-hidden pointer-events-none bg-transparent">
      
        {/* Global Audio Toggle Button */}
        <button 
          onClick={handleToggleMute}
          className="fixed top-4 right-4 z-50 p-2 md:p-3 text-xs md:text-base rounded-full glass-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan/20 active:scale-95 transition-all pointer-events-auto flex items-center justify-center border-cyan/50"
        >
          {isMutedState ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} className="text-cyan" />}
        </button>

        <AnimatePresence>
          {showMissionComplete && (
            <MissionCompleteOverlay onReturn={handleReturnToMenu} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCertificate && (
            <CertificateOverlay onDownload={handleDownloadCertificate} defaultName={userName} />
          )}
        </AnimatePresence>

      {/* Phase 2 (Level 1) UI Overlays */}
      <AnimatePresence>
        {phase === 2 && (
          <>
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm whitespace-nowrap glass-cyan rounded-full pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold text-sm tracking-widest uppercase text-cyan">Level 1: Java</span>
            </motion.div>

            <motion.div 
              className="fixed top-4 left-4 z-50 p-2 md:p-4 text-xs md:text-base w-32 md:w-auto bg-[#0a192f]/80 backdrop-blur-md border border-cyan-400 rounded-lg flex flex-col space-y-1 md:space-y-2 pointer-events-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3">
                <Recycle className="text-green-400" size={24} />
                <span className="font-bold text-lg">Trash Recycled: <span className={trashCollected === 3 ? "text-green-400" : "text-cyan"}>{trashCollected}/3</span></span>
              </div>
            </motion.div>

            {(!showMissionComplete && !showCertificate) && (
              <DPadOverlay setMovement={handleSetMovement} />
            )}
            
            {/* Scan Button */}
            {!isModalOpen && !currentTrashId && trashCollected < 3 && (
              <motion.button 
                id="btn-scan"
                onClick={handleScan}
                className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass-cyan px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase text-cyan flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">🔍</span>
                <span>Scan Area for Trash</span>
              </motion.button>
            )}

            {/* Put in Trash Button */}
            {!isModalOpen && currentTrashId && trashCollected < 3 && (
              <motion.button 
                id="btn-put-in-trash"
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:bg-green-400/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase text-green-400 flex items-center space-x-2 border-green-400/30 w-[90%] md:w-auto justify-center whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">🗑️</span>
                <span>Put in the Trash</span>
              </motion.button>
            )}

            <AnimatePresence>
              {isModalOpen && (
                <motion.div 
                  className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm pointer-events-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="glass-cyan p-8 rounded-2xl flex flex-col items-center max-w-md w-full mx-4 shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center border border-cyan/50 mb-6">
                      <CheckCircle className="text-cyan w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Trash Found!</h2>
                    <p className="text-cyan/80 mb-8 text-center">Where does this belong?</p>
                    
                    <div className="flex flex-col w-full space-y-4">
                      <button 
                        onClick={() => handleSortChoice('organic')}
                        className="w-full glass py-3 px-6 rounded-xl text-green-400 font-bold tracking-wider hover:bg-green-400/20 transition-colors flex items-center space-x-3 border-green-400/30 shadow-[0_0_15px_rgba(74,222,128,0.2)] text-left"
                      >
                        <span className="text-3xl flex-shrink-0">🌿</span>
                        <div className="flex flex-col">
                          <span className="text-lg">Organic Bin</span>
                          <span className="text-xs text-green-400/80 normal-case tracking-normal mt-1 leading-tight">Natural waste that can decompose like leaves & food scraps! 🌱</span>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handleSortChoice('recycle')}
                        className="w-full glass py-3 px-6 rounded-xl text-blue-400 font-bold tracking-wider hover:bg-blue-400/20 transition-colors flex items-center space-x-3 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-left"
                      >
                        <span className="text-3xl flex-shrink-0">♻️</span>
                        <div className="flex flex-col">
                          <span className="text-lg">Recycle Bin</span>
                          <span className="text-xs text-blue-400/80 normal-case tracking-normal mt-1 leading-tight">Recyclable waste that can be made into new items (plastic & paper)! ♻️</span>
                        </div>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleSortChoice('cancel')}
                      className="mt-6 text-sm text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>

      {/* Phase 4 (Level 2) UI Overlays */}
      <AnimatePresence>
        {phase === 4 && (
          <>
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm whitespace-nowrap glass-cyan rounded-full pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold text-sm tracking-widest uppercase text-cyan">Level 2: Andalas (Mitigation)</span>
            </motion.div>

            {/* Eco-Restoration System Dashboard */}
            <motion.div 
              className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <Leaf className="text-slate-700 w-6 h-6" fill="#e2e8f0" />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm">Eco-Restoration<br/><span className="text-cyan text-xs">System</span></h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? 'bg-cyan-500 border-cyan-400' : 'border-white/30'}`}>
                    {currentStep > 1 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 1 ? "text-white/50 line-through" : "text-white"}>Clean River Area</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? 'bg-green-500 border-green-400' : 'border-white/30'}`}>
                    {currentStep > 2 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 2 ? "text-white/50 line-through" : "text-white"}>Plant Seeds</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? 'bg-yellow-500 border-yellow-400' : 'border-white/30'}`}>
                    {currentStep > 3 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 3 ? "text-white/50 line-through" : "text-white"}>Water & Sunlight</span>
                </li>
              </ul>
            </motion.div>

            {(!showMissionComplete && !showCertificate) && (
              <DPadOverlay setMovement={handleSetMovement} />
            )}

            {/* Action Button */}
            {currentStep < 4 && (
              <motion.button 
                onClick={handleRestorationAction}
                className={`fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? 'text-cyan border-cyan/30' : currentStep === 2 ? 'text-green-400 border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'text-yellow-400 border-yellow-400/30 shadow-[0_0_20px_rgba(251,191,36,0.4)]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">
                  {currentStep === 1 ? "🧹" : currentStep === 2 ? "🌱" : "☀️"}
                </span>
                <span>
                  {currentStep === 1 ? "Start Clean-Up" : currentStep === 2 ? "Plant Seeds" : "Give Water & Sunlight"}
                </span>
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Phase 6 (Level 3) UI Overlays */}
      <AnimatePresence>
        {phase === 6 && (
          <>
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm whitespace-nowrap glass-cyan rounded-full pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold text-sm tracking-widest uppercase text-cyan">Level 3: Borneo (Peatland Fires)</span>
            </motion.div>

            {/* Fire Mitigation System Dashboard */}
            <motion.div 
              className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <Flame className="text-red-500 w-6 h-6" fill="#fecaca" />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm">Fire Mitigation<br/><span className="text-cyan text-xs">System</span></h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? 'bg-cyan-500 border-cyan-400' : 'border-white/30'}`}>
                    {currentStep > 1 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 1 ? "text-white/50 line-through" : "text-white"}>Deploy Rescue Drone</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? 'bg-blue-500 border-blue-400' : 'border-white/30'}`}>
                    {currentStep > 2 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 2 ? "text-white/50 line-through" : "text-white"}>Extinguish Peatland Fires</span>
                </li>
              </ul>
            </motion.div>

            {(!showMissionComplete && !showCertificate) && (
              <DPadOverlay setMovement={handleSetMovement} />
            )}

            {/* Action Button */}
            {currentStep < 3 && (
              <motion.button 
                onClick={handleBorneoAction}
                className={`fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? 'text-cyan border-cyan/30' : 'text-blue-400 border-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.4)]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">
                  {currentStep === 1 ? "🚁" : "💧"}
                </span>
                <span>
                  {currentStep === 1 ? "Deploy Drone" : "Extinguish Fire"}
                </span>
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Phase 8 (Level 4) UI Overlays */}
      <AnimatePresence>
        {phase === 8 && (
          <>
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm whitespace-nowrap glass-cyan rounded-full pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold text-sm tracking-widest uppercase text-cyan">Level 4: Celebes (The Ocean's Heart)</span>
            </motion.div>

            {/* Marine Bio-Tech System Dashboard */}
            <motion.div 
              className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <Droplets className="text-blue-500 w-6 h-6" fill="#bfdbfe" />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm">Marine Bio-Tech<br/><span className="text-cyan text-xs">System</span></h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? 'bg-cyan-500 border-cyan-400' : 'border-white/30'}`}>
                    {currentStep > 1 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 1 ? "text-white/50 line-through" : "text-white"}>Deploy IoT Rover</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? 'bg-yellow-500 border-yellow-400' : 'border-white/30'}`}>
                    {currentStep > 2 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 2 ? "text-white/50 line-through" : "text-white"}>Clean Marine Waste</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? 'bg-pink-500 border-pink-400' : 'border-white/30'}`}>
                    {currentStep > 3 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 3 ? "text-white/50 line-through" : "text-white"}>Plant Bio-Corals</span>
                </li>
              </ul>
            </motion.div>

            {(!showMissionComplete && !showCertificate) && (
              <DPadOverlay setMovement={handleSetMovement} />
            )}

            {/* Action Button */}
            {currentStep < 4 && (
              <motion.button 
                onClick={handleCelebesAction}
                className={`fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? 'text-[#202664] border-cyan/30' : currentStep === 2 ? 'text-[#202664] border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'text-[#202664] border-pink-400/30 shadow-[0_0_20px_rgba(244,114,182,0.4)]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">
                  {currentStep === 1 ? "🚀" : currentStep === 2 ? "🧹" : "🪸"}
                </span>
                <span>
                  {currentStep === 1 ? "Deploy IoT Rover" : currentStep === 2 ? "Clean Marine Waste" : "Plant Bio-Corals"}
                </span>
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Phase 10 (Level 5) UI Overlays */}
      <AnimatePresence>
        {phase === 10 && (
          <>
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm whitespace-nowrap glass-cyan rounded-full pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold text-sm tracking-widest uppercase text-cyan">Level 5: Nusa (The Thirsty Lands)</span>
            </motion.div>

            {/* Smart Agriculture System Dashboard */}
            <motion.div 
              className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <Leaf className="text-green-500 w-6 h-6" fill="#bbf7d0" />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm">Smart Agriculture<br/><span className="text-cyan text-xs">System</span></h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? 'bg-cyan-500 border-cyan-400' : 'border-white/30'}`}>
                    {currentStep > 1 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 1 ? "text-white/50 line-through" : "text-white"}>Scan Dry Soil</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? 'bg-blue-500 border-blue-400' : 'border-white/30'}`}>
                    {currentStep > 2 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 2 ? "text-white/50 line-through" : "text-white"}>Connect AI Pipes</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? 'bg-green-500 border-green-400' : 'border-white/30'}`}>
                    {currentStep > 3 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 3 ? "text-white/50 line-through" : "text-white"}>Distribute Water</span>
                </li>
              </ul>
            </motion.div>

            {(!showMissionComplete && !showCertificate) && (
              <DPadOverlay setMovement={handleSetMovement} />
            )}

            {/* Action Button */}
            {currentStep < 4 && (
              <motion.button 
                onClick={handleNusaAction}
                className={`fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? 'text-cyan border-cyan/30' : currentStep === 2 ? 'text-blue-400 border-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.4)]' : 'text-green-400 border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.4)]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">
                  {currentStep === 1 ? "🔍" : currentStep === 2 ? "🔧" : "💧"}
                </span>
                <span>
                  {currentStep === 1 ? "Scan Soil" : currentStep === 2 ? "Connect Pipes" : "Distribute Water"}
                </span>
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Phase 12 (Level 6) UI Overlays */}
      <AnimatePresence>
        {phase === 12 && (
          <>
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm whitespace-nowrap glass-cyan rounded-full pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold text-sm tracking-widest uppercase text-cyan">Level 6: Papua (The Morning Star)</span>
            </motion.div>

            {/* Microgrid Dashboard */}
            <motion.div 
              className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <Zap className="text-yellow-500 w-6 h-6" fill="#fef08a" />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm">Renewable Microgrid<br/><span className="text-cyan text-xs">System</span></h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? 'bg-cyan-500 border-cyan-400' : 'border-white/30'}`}>
                    {currentStep > 1 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 1 ? "text-white/50 line-through" : "text-white"}>Build Smart Grid</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? 'bg-yellow-500 border-yellow-400' : 'border-white/30'}`}>
                    {currentStep > 2 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 2 ? "text-white/50 line-through" : "text-white"}>Align Solar Panels</span>
                </li>
                <li className="flex items-center space-x-3 text-xs md:text-sm">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? 'bg-green-500 border-green-400' : 'border-white/30'}`}>
                    {currentStep > 3 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={currentStep > 3 ? "text-white/50 line-through" : "text-white"}>Power Up Village</span>
                </li>
              </ul>
            </motion.div>

            {(!showMissionComplete && !showCertificate) && (
              <DPadOverlay setMovement={handleSetMovement} />
            )}

            {/* Action Button */}
            {currentStep < 4 && (
              <motion.button 
                onClick={handlePapuaAction}
                className={`fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? 'text-cyan border-cyan/30' : currentStep === 2 ? 'text-yellow-400 border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'text-green-400 border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.4)]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-xl">
                  {currentStep === 1 ? "🏗️" : currentStep === 2 ? "☀️" : "⚡"}
                </span>
                <span>
                  {currentStep === 1 ? "Build Grid" : currentStep === 2 ? "Align Panels" : "Power Up"}
                </span>
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      

      {/* Shared UI Overlays */}
      {(phase === 2 || phase === 4 || phase === 6 || phase === 8 || phase === 10 || phase === 12) && (
        <>
          <motion.button 
            className="fixed bottom-4 left-4 z-[999] pointer-events-auto p-2 md:p-3 text-xs md:text-base bg-slate-800/80 backdrop-blur-md border border-cyan-400 rounded-lg hover:bg-cyan-900 transition-colors text-cyan"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
          </motion.button>

          <AnimatePresence>
            {showDialogue && (
              <div className="fixed top-24 right-4 md:top-28 md:right-8 z-50 w-64 md:w-80 lg:w-96 pointer-events-none">
                <div className="glass-cyan p-4 rounded-xl w-full animate-unroll shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <div className="flex items-start space-x-3 opacity-0" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
                    <div className="w-8 h-8 rounded-full bg-cyan/20 flex-shrink-0 flex items-center justify-center border border-cyan/50">
                      <Sparkles className="text-cyan w-4 h-4" />
                    </div>
                    <div className="pointer-events-auto">
                      <div className="flex items-center mb-1">
                        <h3 className="text-sm font-bold text-cyan uppercase tracking-widest">EvIEEE</h3>
                        <button 
                          id="btn-read-aloud" 
                          className="ml-3 text-cyan-400 hover:text-white transition-colors flex items-center gap-1 text-sm bg-cyan-900/30 px-2 py-1 rounded border border-cyan-400/50" 
                          title="Turn on Narrator"
                          onClick={() => {
                            // 1. KILL THE AUTO-HIDE TIMER
                            if (dialogTimerRef.current) {
                              clearTimeout(dialogTimerRef.current);
                              dialogTimerRef.current = null;
                            }
                            
                            window.speechSynthesis.cancel();
                            setShowDialogue(true);
                            const utterance = new SpeechSynthesisUtterance(dialogue);
                            utterance.lang = 'en-US';
                            utterance.rate = 0.9;
                            
                            // 2. HIDE DIALOG ONLY WHEN SPEECH ENDS
                            utterance.onend = function() {
                              console.log("Speech finished.");
                              setTimeout(() => {
                                setShowDialogue(false);
                                if (dialogCallbackRef.current) {
                                  dialogCallbackRef.current();
                                  dialogCallbackRef.current = null;
                                }
                              }, 1000);
                            };
                            window.speechSynthesis.speak(utterance);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 8H7a2 2 0 00-2 2z" />
                          </svg>
                          Narrator
                        </button>
                        
                        <button 
                          id="btn-skip-dialog" 
                          className="ml-2 text-cyan-400 hover:text-white transition-colors flex items-center gap-1 text-sm bg-cyan-900/30 px-3 py-1 rounded border border-cyan-400/50" 
                          title="Skip and Proceed"
                          onClick={handleSkipDialogue}
                        >
                          Next ❯
                        </button>
                      </div>
                      <p id="evieee-dialog-text" className="text-sm leading-relaxed h-auto break-words whitespace-normal">{dialogue}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
      `}} />
      </main>
    </>
  );
}

export default LevelApp;
