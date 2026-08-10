import { useEffect, useRef } from 'react';
import 'aframe';

if (typeof AFRAME !== 'undefined') {
  if (!AFRAME.components['dpad-controls']) {
    AFRAME.registerComponent('dpad-controls', {
      schema: {
        forward: {type: 'boolean', default: false},
        backward: {type: 'boolean', default: false},
        left: {type: 'boolean', default: false},
        right: {type: 'boolean', default: false},
        speed: {type: 'number', default: 0.15}
      },
      tick: function () {
        if (!this.el) return;
        const data = this.data;
        const el = this.el;
        
        const THREE = AFRAME.THREE;
        const velocity = new THREE.Vector3();
        const rotation = el.getAttribute('rotation');
        const angle = THREE.MathUtils.degToRad(rotation.y);
        
        if (data.forward) {
          velocity.x -= Math.sin(angle) * data.speed;
          velocity.z -= Math.cos(angle) * data.speed;
        }
        if (data.backward) {
          velocity.x += Math.sin(angle) * data.speed;
          velocity.z += Math.cos(angle) * data.speed;
        }
        if (data.left) {
          velocity.x -= Math.cos(angle) * data.speed;
          velocity.z += Math.sin(angle) * data.speed;
        }
        if (data.right) {
          velocity.x += Math.cos(angle) * data.speed;
          velocity.z -= Math.sin(angle) * data.speed;
        }
        
        if (velocity.lengthSq() > 0) {
          const pos = el.getAttribute('position');
          el.setAttribute('position', {
            x: pos.x + velocity.x,
            y: pos.y,
            z: pos.z + velocity.z
          });
        }
      }
    });
  }
}

export default function AFrameScene({ movementState, level = 1, currentStep = 1 }) {
  const cameraRef = useRef(null);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setAttribute('dpad-controls', {
        forward: movementState.forward,
        backward: movementState.backward,
        left: movementState.left,
        right: movementState.right
      });
    }
  }, [movementState]);

  // Handle River color transition on Step 2 (Clean Area done)
  useEffect(() => {
    if (level === 2 && currentStep >= 2) {
      const river = document.getElementById('murky-river');
      if (river) {
        river.setAttribute('animation', 'property: components.material.material.color; type: color; to: #00f0ff; dur: 2000; easing: easeInOutQuad');
      }
    }
  }, [level, currentStep]);

  const getSkyColor = () => {
    if (level === 1) return "#1e3a8a"; // Brighter blue so it doesn't look empty
    if (level === 2) return "#1a1a1a";
    if (level === 3) return "#2b2823";
    if (level === 4) return currentStep < 4 ? "#001e36" : "#00aaff";
    if (level === 5) return currentStep < 3 ? "#8B4513" : "#87CEEB";
    if (level === 6) return currentStep < 3 ? "#0f172a" : "#38bdf8";
    return "#000000";
  };
  
  const getFog = () => {
    if (level === 3) return "type: exponential; color: #3a352f; density: 0.15";
    if (level === 4) return currentStep < 4 ? "type: exponential; color: #001e36; density: 0.05" : "type: exponential; color: #00aaff; density: 0.02";
    if (level === 5) return currentStep < 3 ? "type: exponential; color: #8B4513; density: 0.05" : undefined;
    if (level === 6) return currentStep < 3 ? "type: exponential; color: #0f172a; density: 0.05" : undefined;
    return undefined;
  };

  return (
    <div className="absolute inset-0 z-0">
      <a-scene embedded renderer="antialias: true" vr-mode-ui="enabled: false" fog={getFog()} loading-screen="enabled: false">


        <a-sky color={getSkyColor()}></a-sky>

        <a-camera ref={cameraRef} position="0 1.6 0" look-controls="pointerLockEnabled: false" dpad-controls="">
        </a-camera>

        {level === 1 && (
          <>
            {/* City Floor */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color="#112240"></a-plane>

            {/* Monas Monument Background */}
            <a-entity position="0 0 -30">
              <a-box width="4" height="2" depth="4" color="#cbd5e1" position="0 1 0"></a-box>
              <a-box width="2" height="20" depth="2" color="#f8fafc" position="0 12 0"></a-box>
              <a-box width="3" height="1" depth="3" color="#cbd5e1" position="0 22.5 0"></a-box>
              <a-cone radius-bottom="1.5" radius-top="0" height="3" color="#fbbf24" position="0 24.5 0" material="emissive: #fbbf24; emissiveIntensity: 0.8"></a-cone>
            </a-entity>

            {/* Trash Items */}
            <a-entity id="trash1" className="trash-item" data-type="organic" data-name="Leaf" position="-3 1 -4" scale="0.8 0.8 0.8">
              <a-plane width="0.8" height="0.5" color="#5a6b31" rotation="-90 0 0" roughness="1"></a-plane>
            </a-entity>

            <a-entity id="trash2" className="trash-item" data-type="recycle" data-name="Paper Box" position="0 1 -5" scale="0.8 0.8 0.8">
              <a-entity geometry="primitive: tetrahedron; radius: 0.3" material="color: #cbd5e1; roughness: 0.9" rotation="45 45 0"></a-entity>
            </a-entity>
            
            <a-entity id="trash3" className="trash-item" data-type="recycle" data-name="Plastic Bottle" position="3 1 -4" scale="0.8 0.8 0.8">
               <a-cylinder radius="0.1" height="0.5" material="color: #3b82f6; opacity: 0.7; transparent: true" rotation="90 45 0"></a-cylinder>
            </a-entity>

            {/* Smart Bins */}
            <a-entity position="-3 0 -8">
              <a-text value="ORGANIC\n(Leaves, Food)" align="center" position="0 2.5 0" scale="1 1 1" color="#4ade80"></a-text>
              <a-cylinder id="bin-organic" position="0 1 0" radius="0.6" height="1.5" color="#4ade80" opacity="0.4">
                <a-cylinder radius="0.4" height="1.4" color="#4ade80" wireframe="true"></a-cylinder>
              </a-cylinder>
            </a-entity>

            <a-entity position="3 0 -8">
              <a-text value="RECYCLE\n(Paper, Plastic)" align="center" position="0 2.5 0" scale="1 1 1" color="#3b82f6"></a-text>
              <a-cylinder id="bin-recycle" position="0 1 0" radius="0.6" height="1.5" color="#3b82f6" opacity="0.4">
                <a-cylinder radius="0.4" height="1.4" color="#3b82f6" wireframe="true"></a-cylinder>
              </a-cylinder>
            </a-entity>
          </>
        )}

        {level === 2 && (
          <>
            {/* Level 2: Andalas Environment */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color="#3e2723" roughness="1"></a-plane>
            
            {/* Sun & Additive Light Rays */}
            <a-entity position="0 15 -15" visible={currentStep >= 3}>
              <a-sphere radius="2" color="#fbbf24" material="emissive: #fbbf24; emissiveIntensity: 1"></a-sphere>
              <a-cone radius-bottom="20" radius-top="2" height="30" color="#ffeb3b" position="0 -10 0" opacity="0.1" transparent="true" material="blending: additive"></a-cone>
            </a-entity>

            {/* Murky River */}
            <a-plane id="murky-river" position="0 0.1 -6" rotation="-90 0 0" width="100" height="6" color="#5d4037" opacity="0.8">
              <a-cylinder radius="0.2" height="3" color="#2b1a16" position="-2 0 1" rotation="90 30 0" visible={currentStep === 1}></a-cylinder>
              <a-cylinder radius="0.2" height="2" color="#3e2723" position="2 0 -1" rotation="90 -20 0" visible={currentStep === 1}></a-cylinder>
            </a-plane>

            {/* Tree Area 1 (Moved inland to z=-2) */}
            <a-entity position="-4 0 -2">
              <a-cylinder radius="0.3" height="0.5" color="#4e342e" position="0 0.25 0"></a-cylinder>
              <a-cylinder radius="0.2" height="2" color="#3e2723" position="1.5 0.2 0" rotation="90 45 0" visible={currentStep === 1}></a-cylinder>
              
              {/* Falling Seed */}
              <a-sphere radius="0.1" color="#8b5a2b" position="0 0.1 0.5" visible={currentStep === 2} animation="property: position; from: 0 4 0.5; to: 0 0.1 0.5; dur: 1000; easing: easeOutBounce"></a-sphere>

              {/* Sapling -> Tree Wrapper */}
              <a-entity position="0 0.5 0" scale={currentStep < 2 ? "0 0 0" : currentStep === 2 ? "0.2 0.2 0.2" : "2 2 2"} visible={currentStep >= 2} animation={currentStep === 3 ? "property: scale; from: 0.2 0.2 0.2; to: 2 2 2; dur: 2000; easing: easeOutElastic" : undefined}>
                <a-cone radius-bottom="1" radius-top="0" height="2" color="#4ade80" position="0 1 0" scale="0.3 0.5 0.3"></a-cone>
              </a-entity>
            </a-entity>

            {/* Tree Area 2 (Moved inland to z=-1) */}
            <a-entity position="5 0 -1">
              <a-cylinder radius="0.4" height="0.5" color="#3e2723" position="0 0.25 0"></a-cylinder>
              <a-cylinder radius="0.3" height="3" color="#2b1a16" position="-2 0.3 1" rotation="90 -30 0" visible={currentStep === 1}></a-cylinder>

              {/* Falling Seed */}
              <a-sphere radius="0.1" color="#8b5a2b" position="0 0.1 0.5" visible={currentStep === 2} animation="property: position; from: 0 4.5 0.5; to: 0 0.1 0.5; dur: 1100; easing: easeOutBounce; delay: 200"></a-sphere>
              
              {/* Sapling -> Tree Wrapper */}
              <a-entity position="0 0.5 0" scale={currentStep < 2 ? "0 0 0" : currentStep === 2 ? "0.25 0.25 0.25" : "2.5 2.5 2.5"} visible={currentStep >= 2} animation={currentStep === 3 ? "property: scale; from: 0.25 0.25 0.25; to: 2.5 2.5 2.5; dur: 2200; easing: easeOutElastic; delay: 200" : undefined}>
                <a-cone radius-bottom="1.2" radius-top="0" height="2.5" color="#4ade80" position="0 1.25 0" scale="0.3 0.5 0.3"></a-cone>
              </a-entity>
            </a-entity>

            {/* Watering Can Animation in Step 3 */}
            <a-entity visible={currentStep >= 3} position="-3 3 -1" animation="property: rotation; from: 0 0 0; to: 0 0 45; dur: 1000; dir: alternate; loop: true">
              <a-cylinder radius="0.4" height="1" color="#94a3b8" rotation="0 0 0"></a-cylinder>
              <a-cylinder radius="0.1" height="1.5" color="#cbd5e1" position="-0.5 0.5 0" rotation="0 0 60"></a-cylinder>
              <a-sphere radius="0.1" color="#3b82f6" position="-1.2 0.8 0" animation="property: position; to: -1.2 -3 0; loop: true; dur: 800"></a-sphere>
              <a-sphere radius="0.08" color="#3b82f6" position="-1.0 0.9 0.2" animation="property: position; to: -1.0 -3 0.2; loop: true; dur: 700; delay: 100"></a-sphere>
            </a-entity>
          </>
        )}

        {level === 3 && (
          <>
            {/* Level 3: Borneo Peatland Environment */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color="#2e1d14" roughness="1"></a-plane>
            
            {/* Smog & Fog is handled in scene props, but let's add some dark clouds */}
            <a-sphere position="0 10 -15" radius="8" color="#403c37" opacity="0.8"></a-sphere>
            <a-sphere position="-10 12 -20" radius="10" color="#403c37" opacity="0.8"></a-sphere>
            <a-sphere position="10 11 -18" radius="9" color="#403c37" opacity="0.8"></a-sphere>

            {/* Fire Spots (Moved further back) */}
            <a-entity position="-10 0 -14">
              {currentStep < 3 && (
                <>
                  <a-sphere radius="1.2" color="#ff4500" position="0 0.5 0" material="emissive: #ff4500; emissiveIntensity: 0.8" animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 500"></a-sphere>
                  <a-text value="Peatland Fire" color="#ff4500" align="center" position="0 2.5 0" scale="2 2 2" animation="property: position; to: 0 2.8 0; dir: alternate; loop: true; dur: 800"></a-text>
                </>
              )}
              {/* Burnt stumps */}
              <a-cylinder radius="0.5" height="1.5" color="#1a110b" position="1 0.7 1"></a-cylinder>
            </a-entity>

            <a-entity position="9 0 -12">
              {currentStep < 3 && (
                <>
                  <a-sphere radius="1" color="#ff4500" position="0 0.5 0" material="emissive: #ff4500; emissiveIntensity: 0.8" animation="property: scale; to: 1.3 1.3 1.3; dir: alternate; loop: true; dur: 600"></a-sphere>
                  <a-text value="Peatland Fire" color="#ff4500" align="center" position="0 2 0" scale="2 2 2" animation="property: position; to: 0 2.3 0; dir: alternate; loop: true; dur: 800"></a-text>
                </>
              )}
              <a-cylinder radius="0.3" height="2" color="#1a110b" position="-1 1 0" rotation="30 0 0"></a-cylinder>
            </a-entity>

            <a-entity position="0 0 -18">
              {currentStep < 3 && (
                <>
                  <a-sphere radius="1.5" color="#ff4500" position="0 1 0" material="emissive: #ff4500; emissiveIntensity: 0.8" animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 450"></a-sphere>
                  <a-text value="Peatland Fire" color="#ff4500" align="center" position="0 3.5 0" scale="2.5 2.5 2.5" animation="property: position; to: 0 3.8 0; dir: alternate; loop: true; dur: 800"></a-text>
                </>
              )}
            </a-entity>

            {/* Crying Orangutan (Moved back to z=-7) */}
            <a-entity id="orangutan" position="-1 0 -7" animation={currentStep >= 3 ? "property: position; to: -1 0.5 -7; dir: alternate; loop: true; dur: 300" : undefined}>
              <a-text value="Trapped Orangutan" color="#fbbf24" align="center" position="0 3 0" scale="2 2 2"></a-text>
              {/* Body */}
              <a-cylinder radius="0.7" height="1.5" color="#c96b1e" position="0 0.75 0"></a-cylinder>
              {/* Head */}
              <a-sphere radius="0.6" color="#c96b1e" position="0 1.8 0"></a-sphere>
              {/* Tears */}
              {currentStep < 3 && (
                <>
                  <a-sphere radius="0.08" color="#00f0ff" position="-0.25 1.7 0.5" animation="property: position; to: -0.25 0.5 0.6; loop: true; dur: 800"></a-sphere>
                  <a-sphere radius="0.08" color="#00f0ff" position="0.25 1.7 0.5" animation="property: position; to: 0.25 0.5 0.6; loop: true; dur: 900; delay: 200"></a-sphere>
                </>
              )}
              {/* Happiness */}
              {currentStep >= 3 && (
                <>
                  <a-text value="I'm free!" color="#ffffff" align="center" position="0 4 0" scale="2.5 2.5 2.5"></a-text>
                  <a-text value="❤️" color="#ef4444" align="center" position="0 3.3 0" scale="3 3 3" animation="property: scale; to: 4 4 4; dir: alternate; loop: true; dur: 500"></a-text>
                </>
              )}
            </a-entity>

            {/* The Drone (Ready to deploy) */}
            <a-entity id="borneo-drone" position="3 2 -2" scale="0.5 0.5 0.5" animation={currentStep >= 2 ? "property: position; to: 0 7 -12; dur: 2000; easing: easeOutQuad" : "property: position; to: 3 2.5 -2; dir: alternate; loop: true; dur: 1500"}>
              {/* Drone Body */}
              <a-box width="1.2" height="0.3" depth="1.2" color="#e2e8f0"></a-box>
              <a-cylinder radius="0.15" height="0.15" color="#94a3b8" position="-0.6 0.15 -0.6"></a-cylinder>
              <a-cylinder radius="0.15" height="0.15" color="#94a3b8" position="0.6 0.15 -0.6"></a-cylinder>
              <a-cylinder radius="0.15" height="0.15" color="#94a3b8" position="-0.6 0.15 0.6"></a-cylinder>
              <a-cylinder radius="0.15" height="0.15" color="#94a3b8" position="0.6 0.15 0.6"></a-cylinder>
              
              <a-text value="RESCUE DRONE" color="#00f0ff" align="center" position="0 1 0" scale="2 2 2" look-at="[camera]"></a-text>
              
              {/* Water Spray when flying to extinguish */}
              {currentStep >= 3 && (
                <a-cone radius-bottom="4" radius-top="0" height="8" color="#00f0ff" position="0 -4 0" opacity="0.4" transparent="true" material="blending: additive"></a-cone>
              )}
            </a-entity>
          </>
        )}

        {level === 4 && (
          <>
            {/* Level 4: Celebes Underwater Environment */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color="#c2b280" roughness="0.8"></a-plane>

            {/* Bubbles */}
            <a-entity position="0 -2 -10">
               <a-sphere radius="0.1" color="#ffffff" opacity="0.4" position="-2 0 0" animation="property: position; to: -2 20 0; dur: 8000; loop: true"></a-sphere>
               <a-sphere radius="0.15" color="#ffffff" opacity="0.4" position="3 2 2" animation="property: position; to: 3 22 2; dur: 10000; loop: true; delay: 1000"></a-sphere>
               <a-sphere radius="0.08" color="#ffffff" opacity="0.4" position="-4 1 -3" animation="property: position; to: -4 21 -3; dur: 7000; loop: true; delay: 500"></a-sphere>
            </a-entity>

            {/* Coral Reef Area */}
            <a-entity position="0 0 -8">
              {/* Base dead rock */}
              <a-sphere radius="3" position="0 0 0" scale="1 0.3 1" color={currentStep < 4 ? "#475569" : "#8b5a2b"}></a-sphere>
              
              {/* Dead Corals (Become colorful when planted) */}
              <a-cylinder radius="0.2" height="2" position="-1 0.5 0" color={currentStep < 4 ? "#64748b" : "#ff1493"} rotation="15 -20 0" animation={currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.2 1.5 1.2; dur: 2000; easing: easeOutElastic" : undefined}></a-cylinder>
              <a-cylinder radius="0.15" height="1.5" position="1 0.3 1" color={currentStep < 4 ? "#64748b" : "#00fa9a"} rotation="-10 40 0" animation={currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 2 1.5; dur: 2200; easing: easeOutElastic" : undefined}></a-cylinder>
              <a-cylinder radius="0.25" height="1" position="0.5 0.5 -1" color={currentStep < 4 ? "#94a3b8" : "#ff4500"} rotation="20 10 0" animation={currentStep === 4 ? "property: scale; from: 1 1 1; to: 2 1.5 2; dur: 1800; easing: easeOutElastic" : undefined}></a-cylinder>
            </a-entity>

            {/* Marine Waste */}
            {currentStep < 3 && (
              <a-entity position="-3 0 -5">
                <a-text value="Marine Waste" color="#ef4444" align="center" position="0 1.5 0" scale="1.5 1.5 1.5"></a-text>
                <a-box width="0.8" height="0.4" depth="0.6" color="#333" position="0 0.2 0" rotation="10 45 0"></a-box>
                <a-cylinder radius="0.1" height="0.4" color="#3b82f6" position="0.5 0.1 0.3" rotation="90 20 0"></a-cylinder>
                <a-cylinder radius="0.1" height="0.4" color="#3b82f6" position="-0.4 0.1 0.5" rotation="90 -30 0"></a-cylinder>
              </a-entity>
            )}

            {/* IoT Rover */}
            <a-entity id="iot-rover" position="4 1 -3" animation={currentStep === 2 ? "property: position; to: -1.5 1 -5; dur: 2000" : currentStep === 3 ? "property: position; to: 0 2 -8; dur: 2000" : "property: position; to: 4 1.2 -3; dir: alternate; loop: true; dur: 2000"}>
              <a-text value="IoT ROVER" color="#fbbf24" align="center" position="0 1.5 0" scale="2 2 2" look-at="[camera]"></a-text>
              {/* Rover Body */}
              <a-cylinder radius="0.5" height="1.2" color="#fbbf24" rotation="0 0 90"></a-cylinder>
              {/* Cockpit / Glass */}
              <a-sphere radius="0.4" position="-0.4 0 0" color="#00f0ff" opacity="0.6"></a-sphere>
              {/* Propeller back */}
              <a-cylinder radius="0.2" height="0.2" position="0.6 0 0" color="#333" rotation="0 0 90">
                <a-box width="0.1" height="0.6" depth="0.1" color="#cbd5e1" animation="property: rotation; to: 0 360 0; loop: true; dur: 200; easing: linear"></a-box>
              </a-cylinder>

              {/* Cleaning Laser / Action */}
              {currentStep === 2 && (
                <a-cylinder radius="0.05" height="3" position="-1.5 0 0" color="#ef4444" rotation="0 0 90" opacity="0.6" material="blending: additive"></a-cylinder>
              )}

              {/* Planting Bio-Coral */}
              {currentStep === 3 && (
                <a-sphere radius="0.3" position="0 -1 0" color="#00fa9a" material="emissive: #00fa9a; emissiveIntensity: 1" animation="property: position; to: 0 -3 0; dur: 1000"></a-sphere>
              )}
            </a-entity>

            {/* Tropical Fishes (Level Complete) */}
            {currentStep === 4 && (
              <a-entity position="0 1 -8" animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear">
                <a-cone radius-bottom="0.2" radius-top="0" height="0.6" color="#ff00ff" position="2 1 0" rotation="90 0 0" animation="property: position; to: 2 1.5 0; dir: alternate; loop: true; dur: 1500"></a-cone>
                <a-cone radius-bottom="0.15" radius-top="0" height="0.4" color="#00ff00" position="-2 0.5 1" rotation="90 45 0" animation="property: position; to: -2 0.8 1; dir: alternate; loop: true; dur: 1200"></a-cone>
                <a-cone radius-bottom="0.2" radius-top="0" height="0.5" color="#ffff00" position="0 1.2 2" rotation="90 -30 0" animation="property: position; to: 0 1.6 2; dir: alternate; loop: true; dur: 1800"></a-cone>
                <a-cone radius-bottom="0.1" radius-top="0" height="0.3" color="#ff7700" position="1.5 0.3 -1.5" rotation="90 20 0" animation="property: position; to: 1.5 0.6 -1.5; dir: alternate; loop: true; dur: 1000"></a-cone>
              </a-entity>
            )}
          </>
        )}

        {level === 5 && (
          <>
            {/* Level 5: Nusa Environment */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color={currentStep < 3 ? "#d2b48c" : "#228b22"} roughness="1" animation={currentStep === 3 ? "property: components.material.material.color; type: color; to: #228b22; dur: 2000; easing: easeInOutQuad" : undefined}></a-plane>

            {/* Farm Area */}
            <a-entity position="0 0 -8">
              {/* Dry Plants */}
              <a-entity position="-3 0 0">
                 <a-cone radius-bottom="0.5" radius-top="0" height={currentStep < 4 ? "0.5" : "2"} color={currentStep < 4 ? "#8b5a2b" : "#32cd32"} position="0 0.25 0" animation={currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 3 1.5; dur: 2000; easing: easeOutElastic" : undefined}></a-cone>
              </a-entity>
              <a-entity position="0 0 0">
                 <a-cone radius-bottom="0.5" radius-top="0" height={currentStep < 4 ? "0.5" : "2.2"} color={currentStep < 4 ? "#8b5a2b" : "#32cd32"} position="0 0.25 0" animation={currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 3 1.5; dur: 2200; easing: easeOutElastic" : undefined}></a-cone>
              </a-entity>
              <a-entity position="3 0 0">
                 <a-cone radius-bottom="0.5" radius-top="0" height={currentStep < 4 ? "0.5" : "1.8"} color={currentStep < 4 ? "#8b5a2b" : "#32cd32"} position="0 0.25 0" animation={currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 3 1.5; dur: 1800; easing: easeOutElastic" : undefined}></a-cone>
              </a-entity>
              
              {/* Soil Scanner Hologram */}
              {currentStep === 1 && (
                <a-entity position="0 0.5 2">
                  <a-cylinder radius="2" height="0.1" color="#00f0ff" opacity="0.3" material="blending: additive" animation="property: scale; to: 1.5 1 1.5; dir: alternate; loop: true; dur: 1000"></a-cylinder>
                  <a-text value="SCANNING SOIL..." color="#00f0ff" align="center" position="0 1 0" scale="1.5 1.5 1.5" look-at="[camera]"></a-text>
                </a-entity>
              )}

              {/* Smart Pipes */}
              {currentStep >= 2 && (
                <a-entity position="0 0.1 2">
                   {/* Main Pipe */}
                   <a-cylinder radius="0.15" height="8" color="#64748b" rotation="0 0 90"></a-cylinder>
                   {/* Branches */}
                   <a-cylinder radius="0.1" height="3" color="#64748b" position="-3 0 -1.5" rotation="90 0 0"></a-cylinder>
                   <a-cylinder radius="0.1" height="3" color="#64748b" position="0 0 -1.5" rotation="90 0 0"></a-cylinder>
                   <a-cylinder radius="0.1" height="3" color="#64748b" position="3 0 -1.5" rotation="90 0 0"></a-cylinder>
                   
                   {/* Water flowing effect */}
                   {currentStep >= 3 && (
                     <>
                        <a-cylinder radius="0.16" height="8" color="#00f0ff" opacity="0.5" rotation="0 0 90" material="blending: additive" animation="property: scale; to: 1.1 1 1.1; dir: alternate; loop: true; dur: 500"></a-cylinder>
                        
                        {/* Sprinklers */}
                        <a-entity position="-3 0.5 -3">
                          <a-sphere radius="0.1" color="#94a3b8"></a-sphere>
                          <a-cone radius-bottom="1.5" radius-top="0" height="2" color="#00f0ff" position="0 1 0" opacity="0.4" rotation="180 0 0" material="blending: additive" animation="property: rotation; to: 180 360 0; loop: true; dur: 2000"></a-cone>
                        </a-entity>
                        <a-entity position="0 0.5 -3">
                          <a-sphere radius="0.1" color="#94a3b8"></a-sphere>
                          <a-cone radius-bottom="1.5" radius-top="0" height="2" color="#00f0ff" position="0 1 0" opacity="0.4" rotation="180 0 0" material="blending: additive" animation="property: rotation; to: 180 360 0; loop: true; dur: 2000"></a-cone>
                        </a-entity>
                        <a-entity position="3 0.5 -3">
                          <a-sphere radius="0.1" color="#94a3b8"></a-sphere>
                          <a-cone radius-bottom="1.5" radius-top="0" height="2" color="#00f0ff" position="0 1 0" opacity="0.4" rotation="180 0 0" material="blending: additive" animation="property: rotation; to: 180 360 0; loop: true; dur: 2000"></a-cone>
                        </a-entity>
                     </>
                   )}
                </a-entity>
              )}
            </a-entity>
          </>
        )}

        {level === 6 && (
          <>
            {/* Level 6: Papua Environment */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color={currentStep < 3 ? "#1e293b" : "#4ade80"} roughness="1" animation={currentStep === 3 ? "property: components.material.material.color; type: color; to: #4ade80; dur: 2000; easing: easeInOutQuad" : undefined}></a-plane>

            {/* Sun */}
            <a-sphere radius="3" position="-15 -5 -30" color="#fbbf24" material="emissive: #fbbf24; emissiveIntensity: 1" animation={currentStep >= 2 ? "property: position; to: -10 15 -30; dur: 3000; easing: easeOutQuad" : undefined}></a-sphere>
            
            {/* Sun Rays */}
            {currentStep >= 3 && (
              <a-cone radius-bottom="40" radius-top="2" height="60" color="#fef08a" position="-10 5 -20" rotation="-30 0 0" opacity="0.1" transparent="true" material="blending: additive"></a-cone>
            )}

            {/* Remote Village */}
            <a-entity position="0 0 -10">
              {/* House 1 */}
              <a-entity position="-4 0 0">
                <a-box width="3" height="2" depth="3" color={currentStep < 3 ? "#334155" : "#d4d4d8"}></a-box>
                <a-cone radius-bottom="2.5" radius-top="0" height="1.5" color={currentStep < 3 ? "#1e293b" : "#8b5a2b"} position="0 1.75 0"></a-cone>
                <a-plane width="0.8" height="1" color={currentStep < 3 ? "#0f172a" : "#fbbf24"} position="0 0 1.51" material={currentStep >= 3 ? "emissive: #fbbf24; emissiveIntensity: 1" : ""}></a-plane>
              </a-entity>
              
              {/* House 2 */}
              <a-entity position="4 0 0" rotation="0 -20 0">
                <a-box width="3" height="2" depth="3" color={currentStep < 3 ? "#334155" : "#d4d4d8"}></a-box>
                <a-cone radius-bottom="2.5" radius-top="0" height="1.5" color={currentStep < 3 ? "#1e293b" : "#8b5a2b"} position="0 1.75 0"></a-cone>
                <a-plane width="0.8" height="1" color={currentStep < 3 ? "#0f172a" : "#fbbf24"} position="0 0 1.51" material={currentStep >= 3 ? "emissive: #fbbf24; emissiveIntensity: 1" : ""}></a-plane>
              </a-entity>

              {/* Surrounding Trees */}
              <a-entity position="-8 0 2">
                <a-cylinder radius="0.3" height="2" color="#3e2723" position="0 1 0"></a-cylinder>
                <a-sphere radius="1.5" color={currentStep < 3 ? "#064e3b" : "#22c55e"} position="0 2.5 0"></a-sphere>
              </a-entity>
              <a-entity position="7 0 -3">
                <a-cylinder radius="0.3" height="2" color="#3e2723" position="0 1 0"></a-cylinder>
                <a-sphere radius="2" color={currentStep < 3 ? "#064e3b" : "#22c55e"} position="0 3 0"></a-sphere>
              </a-entity>

              {/* Renewable Energy Microgrid */}
              {currentStep >= 2 && (
                <a-entity position="0 0 4">
                  {/* Grid Station Base */}
                  <a-box width="2" height="0.5" depth="2" color="#94a3b8" position="0 0.25 0"></a-box>
                  <a-box width="1" height="1" depth="1" color="#cbd5e1" position="0 1 0"></a-box>
                  
                  {/* Energy Battery Light */}
                  <a-box width="0.8" height="0.2" depth="0.8" color={currentStep >= 3 ? "#4ade80" : "#ef4444"} position="0 1.6 0" material={currentStep >= 3 ? "emissive: #4ade80; emissiveIntensity: 1" : ""}></a-box>

                  {/* Solar Panels Array */}
                  <a-entity position="-2 0 0">
                    <a-cylinder radius="0.1" height="1" color="#64748b" position="0 0.5 0"></a-cylinder>
                    <a-plane width="1.5" height="1" color="#1e3a8a" position="0 1 0" rotation={currentStep >= 3 ? "-60 0 0" : "-90 0 0"} animation={currentStep === 3 ? "property: rotation; to: -60 -30 0; dur: 2000" : undefined}></a-plane>
                  </a-entity>

                  <a-entity position="2 0 0">
                    <a-cylinder radius="0.1" height="1" color="#64748b" position="0 0.5 0"></a-cylinder>
                    <a-plane width="1.5" height="1" color="#1e3a8a" position="0 1 0" rotation={currentStep >= 3 ? "-60 0 0" : "-90 0 0"} animation={currentStep === 3 ? "property: rotation; to: -60 30 0; dur: 2000" : undefined}></a-plane>
                  </a-entity>

                  {/* Smart Grid Energy Lines to Houses */}
                  {currentStep >= 3 && (
                    <>
                      <a-cylinder radius="0.05" height="4.5" color="#00f0ff" position="-2 0.5 -2.5" rotation="90 -30 0" opacity="0.6" material="blending: additive"></a-cylinder>
                      <a-cylinder radius="0.05" height="4.5" color="#00f0ff" position="2 0.5 -2.5" rotation="90 30 0" opacity="0.6" material="blending: additive"></a-cylinder>
                      
                      {/* Energy Orbs Flowing */}
                      <a-sphere radius="0.1" color="#fbbf24" position="0 0.5 0" material="emissive: #fbbf24; emissiveIntensity: 1" animation="property: position; to: -4 1 -3.5; dur: 1500; loop: true"></a-sphere>
                      <a-sphere radius="0.1" color="#fbbf24" position="0 0.5 0" material="emissive: #fbbf24; emissiveIntensity: 1" animation="property: position; to: 4 1 -3.5; dur: 1500; loop: true; delay: 500"></a-sphere>
                    </>
                  )}
                </a-entity>
              )}
            </a-entity>
          </>
        )}

      </a-scene>
    </div>
  );
}
