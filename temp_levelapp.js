var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/LevelApp.jsx
var LevelApp_exports = {};
__export(LevelApp_exports, {
  default: () => LevelApp_default
});
module.exports = __toCommonJS(LevelApp_exports);
var import_react3 = require("react");

// src/components/AFrameScene.jsx
var import_react = require("react");
var import_aframe = require("aframe");
if (typeof AFRAME !== "undefined") {
  if (!AFRAME.components["dpad-controls"]) {
    AFRAME.registerComponent("dpad-controls", {
      schema: {
        forward: { type: "boolean", default: false },
        backward: { type: "boolean", default: false },
        left: { type: "boolean", default: false },
        right: { type: "boolean", default: false },
        speed: { type: "number", default: 0.15 }
      },
      tick: function() {
        if (!this.el) return;
        const data = this.data;
        const el = this.el;
        const THREE = AFRAME.THREE;
        const velocity = new THREE.Vector3();
        const rotation = el.getAttribute("rotation");
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
          const pos = el.getAttribute("position");
          el.setAttribute("position", {
            x: pos.x + velocity.x,
            y: pos.y,
            z: pos.z + velocity.z
          });
        }
      }
    });
  }
}
function AFrameScene({ movementState, level = 1, currentStep = 1 }) {
  const cameraRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (cameraRef.current) {
      cameraRef.current.setAttribute("dpad-controls", {
        forward: movementState.forward,
        backward: movementState.backward,
        left: movementState.left,
        right: movementState.right
      });
    }
  }, [movementState]);
  (0, import_react.useEffect)(() => {
    if (level === 2 && currentStep >= 2) {
      const river = document.getElementById("murky-river");
      if (river) {
        river.setAttribute("animation", "property: components.material.material.color; type: color; to: #00f0ff; dur: 2000; easing: easeInOutQuad");
      }
    }
  }, [level, currentStep]);
  const getSkyColor = () => {
    if (level === 1) return "#0B132B";
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
    if (level === 5) return currentStep < 3 ? "type: exponential; color: #8B4513; density: 0.05" : "";
    if (level === 6) return currentStep < 3 ? "type: exponential; color: #0f172a; density: 0.05" : "";
    return "";
  };
  return /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 z-0" }, /* @__PURE__ */ React.createElement("a-scene", { embedded: true, background: `color: ${getSkyColor()}`, renderer: "antialias: true", "vr-mode-ui": "enabled: false", fog: getFog() }, /* @__PURE__ */ React.createElement("a-assets", null, /* @__PURE__ */ React.createElement("img", { id: "batik-texture", src: "https://www.transparenttextures.com/patterns/black-thread-light.png", alt: "Batik Placeholder" })), /* @__PURE__ */ React.createElement("a-sky", { color: getSkyColor() }), /* @__PURE__ */ React.createElement("a-camera", { ref: cameraRef, position: "0 1.6 0", "look-controls": "pointerLockEnabled: false", "dpad-controls": "" }), level === 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-plane", { position: "0 0 0", rotation: "-90 0 0", width: "100", height: "100", color: "#112240", material: "src: #batik-texture; repeat: 50 50" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 -30" }, /* @__PURE__ */ React.createElement("a-box", { width: "4", height: "2", depth: "4", color: "#cbd5e1", position: "0 1 0" }), /* @__PURE__ */ React.createElement("a-box", { width: "2", height: "20", depth: "2", color: "#f8fafc", position: "0 12 0" }), /* @__PURE__ */ React.createElement("a-box", { width: "3", height: "1", depth: "3", color: "#cbd5e1", position: "0 22.5 0" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "1.5", "radius-top": "0", height: "3", color: "#fbbf24", position: "0 24.5 0", material: "emissive: #fbbf24; emissiveIntensity: 0.8" })), /* @__PURE__ */ React.createElement("a-entity", { id: "trash1", className: "trash-item", "data-type": "organic", "data-name": "Leaf", position: "-3 0 -4", scale: "0.2 0.2 0.2" }, /* @__PURE__ */ React.createElement("a-plane", { width: "0.8", height: "0.5", color: "#5a6b31", rotation: "-90 0 0", roughness: "1" })), /* @__PURE__ */ React.createElement("a-entity", { id: "trash2", className: "trash-item", "data-type": "recycle", "data-name": "Paper Box", position: "0 0 -5", scale: "0.2 0.2 0.2" }, /* @__PURE__ */ React.createElement("a-entity", { geometry: "primitive: tetrahedron; radius: 0.3", material: "color: #cbd5e1; roughness: 0.9", rotation: "45 45 0" })), /* @__PURE__ */ React.createElement("a-entity", { id: "trash3", className: "trash-item", "data-type": "recycle", "data-name": "Plastic Bottle", position: "3 0 -4", scale: "0.2 0.2 0.2" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "0.5", material: "color: #3b82f6; opacity: 0.7; transparent: true", rotation: "90 45 0" })), /* @__PURE__ */ React.createElement("a-entity", { position: "-3 0 -8" }, /* @__PURE__ */ React.createElement("a-text", { value: "ORGANIC\\n(Leaves, Food)", align: "center", position: "0 2.5 0", scale: "1 1 1", color: "#4ade80" }), /* @__PURE__ */ React.createElement("a-cylinder", { id: "bin-organic", position: "0 1 0", radius: "0.6", height: "1.5", color: "#4ade80", opacity: "0.4" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.4", height: "1.4", color: "#4ade80", wireframe: "true" }))), /* @__PURE__ */ React.createElement("a-entity", { position: "3 0 -8" }, /* @__PURE__ */ React.createElement("a-text", { value: "RECYCLE\\n(Paper, Plastic)", align: "center", position: "0 2.5 0", scale: "1 1 1", color: "#3b82f6" }), /* @__PURE__ */ React.createElement("a-cylinder", { id: "bin-recycle", position: "0 1 0", radius: "0.6", height: "1.5", color: "#3b82f6", opacity: "0.4" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.4", height: "1.4", color: "#3b82f6", wireframe: "true" })))), level === 2 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-plane", { position: "0 0 0", rotation: "-90 0 0", width: "100", height: "100", color: "#3e2723", roughness: "1" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 15 -15", visible: currentStep >= 3 }, /* @__PURE__ */ React.createElement("a-sphere", { radius: "2", color: "#fbbf24", material: "emissive: #fbbf24; emissiveIntensity: 1" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "20", "radius-top": "2", height: "30", color: "#ffeb3b", position: "0 -10 0", opacity: "0.1", transparent: "true", material: "blending: additive" })), /* @__PURE__ */ React.createElement("a-plane", { id: "murky-river", position: "0 0.1 -6", rotation: "-90 0 0", width: "100", height: "6", color: "#5d4037", opacity: "0.8" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.2", height: "3", color: "#2b1a16", position: "-2 0 1", rotation: "90 30 0", visible: currentStep === 1 }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.2", height: "2", color: "#3e2723", position: "2 0 -1", rotation: "90 -20 0", visible: currentStep === 1 })), /* @__PURE__ */ React.createElement("a-entity", { position: "-4 0 -2" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.3", height: "0.5", color: "#4e342e", position: "0 0.25 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.2", height: "2", color: "#3e2723", position: "1.5 0.2 0", rotation: "90 45 0", visible: currentStep === 1 }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#8b5a2b", position: "0 0.1 0.5", visible: currentStep === 2, animation: "property: position; from: 0 4 0.5; to: 0 0.1 0.5; dur: 1000; easing: easeOutBounce" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0.5 0", scale: currentStep < 2 ? "0 0 0" : currentStep === 2 ? "0.2 0.2 0.2" : "2 2 2", visible: currentStep >= 2, animation: currentStep === 3 ? "property: scale; from: 0.2 0.2 0.2; to: 2 2 2; dur: 2000; easing: easeOutElastic" : "" }, /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "1", "radius-top": "0", height: "2", color: "#4ade80", position: "0 1 0", scale: "0.3 0.5 0.3" }))), /* @__PURE__ */ React.createElement("a-entity", { position: "5 0 -1" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.4", height: "0.5", color: "#3e2723", position: "0 0.25 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.3", height: "3", color: "#2b1a16", position: "-2 0.3 1", rotation: "90 -30 0", visible: currentStep === 1 }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#8b5a2b", position: "0 0.1 0.5", visible: currentStep === 2, animation: "property: position; from: 0 4.5 0.5; to: 0 0.1 0.5; dur: 1100; easing: easeOutBounce; delay: 200" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0.5 0", scale: currentStep < 2 ? "0 0 0" : currentStep === 2 ? "0.25 0.25 0.25" : "2.5 2.5 2.5", visible: currentStep >= 2, animation: currentStep === 3 ? "property: scale; from: 0.25 0.25 0.25; to: 2.5 2.5 2.5; dur: 2200; easing: easeOutElastic; delay: 200" : "" }, /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "1.2", "radius-top": "0", height: "2.5", color: "#4ade80", position: "0 1.25 0", scale: "0.3 0.5 0.3" }))), /* @__PURE__ */ React.createElement("a-entity", { visible: currentStep >= 3, position: "-3 3 -1", animation: "property: rotation; from: 0 0 0; to: 0 0 45; dur: 1000; dir: alternate; loop: true" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.4", height: "1", color: "#94a3b8", rotation: "0 0 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "1.5", color: "#cbd5e1", position: "-0.5 0.5 0", rotation: "0 0 60" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#3b82f6", position: "-1.2 0.8 0", animation: "property: position; to: -1.2 -3 0; loop: true; dur: 800" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.08", color: "#3b82f6", position: "-1.0 0.9 0.2", animation: "property: position; to: -1.0 -3 0.2; loop: true; dur: 700; delay: 100" }))), level === 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-plane", { position: "0 0 0", rotation: "-90 0 0", width: "100", height: "100", color: "#2e1d14", roughness: "1" }), /* @__PURE__ */ React.createElement("a-sphere", { position: "0 10 -15", radius: "8", color: "#403c37", opacity: "0.8" }), /* @__PURE__ */ React.createElement("a-sphere", { position: "-10 12 -20", radius: "10", color: "#403c37", opacity: "0.8" }), /* @__PURE__ */ React.createElement("a-sphere", { position: "10 11 -18", radius: "9", color: "#403c37", opacity: "0.8" }), /* @__PURE__ */ React.createElement("a-entity", { position: "-10 0 -14" }, currentStep < 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-sphere", { radius: "1.2", color: "#ff4500", position: "0 0.5 0", material: "emissive: #ff4500; emissiveIntensity: 0.8", animation: "property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 500" }), /* @__PURE__ */ React.createElement("a-text", { value: "Peatland Fire", color: "#ff4500", align: "center", position: "0 2.5 0", scale: "2 2 2", animation: "property: position; to: 0 2.8 0; dir: alternate; loop: true; dur: 800" })), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.5", height: "1.5", color: "#1a110b", position: "1 0.7 1" })), /* @__PURE__ */ React.createElement("a-entity", { position: "9 0 -12" }, currentStep < 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-sphere", { radius: "1", color: "#ff4500", position: "0 0.5 0", material: "emissive: #ff4500; emissiveIntensity: 0.8", animation: "property: scale; to: 1.3 1.3 1.3; dir: alternate; loop: true; dur: 600" }), /* @__PURE__ */ React.createElement("a-text", { value: "Peatland Fire", color: "#ff4500", align: "center", position: "0 2 0", scale: "2 2 2", animation: "property: position; to: 0 2.3 0; dir: alternate; loop: true; dur: 800" })), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.3", height: "2", color: "#1a110b", position: "-1 1 0", rotation: "30 0 0" })), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 -18" }, currentStep < 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-sphere", { radius: "1.5", color: "#ff4500", position: "0 1 0", material: "emissive: #ff4500; emissiveIntensity: 0.8", animation: "property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 450" }), /* @__PURE__ */ React.createElement("a-text", { value: "Peatland Fire", color: "#ff4500", align: "center", position: "0 3.5 0", scale: "2.5 2.5 2.5", animation: "property: position; to: 0 3.8 0; dir: alternate; loop: true; dur: 800" }))), /* @__PURE__ */ React.createElement("a-entity", { id: "orangutan", position: "-1 0 -7", animation: currentStep >= 3 ? "property: position; to: -1 0.5 -7; dir: alternate; loop: true; dur: 300" : "" }, /* @__PURE__ */ React.createElement("a-text", { value: "Trapped Orangutan", color: "#fbbf24", align: "center", position: "0 3 0", scale: "2 2 2" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.7", height: "1.5", color: "#c96b1e", position: "0 0.75 0" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.6", color: "#c96b1e", position: "0 1.8 0" }), currentStep < 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.08", color: "#00f0ff", position: "-0.25 1.7 0.5", animation: "property: position; to: -0.25 0.5 0.6; loop: true; dur: 800" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.08", color: "#00f0ff", position: "0.25 1.7 0.5", animation: "property: position; to: 0.25 0.5 0.6; loop: true; dur: 900; delay: 200" })), currentStep >= 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-text", { value: "I'm free!", color: "#ffffff", align: "center", position: "0 4 0", scale: "2.5 2.5 2.5" }), /* @__PURE__ */ React.createElement("a-text", { value: "\u2764\uFE0F", color: "#ef4444", align: "center", position: "0 3.3 0", scale: "3 3 3", animation: "property: scale; to: 4 4 4; dir: alternate; loop: true; dur: 500" }))), /* @__PURE__ */ React.createElement("a-entity", { id: "borneo-drone", position: "3 2 -2", scale: "0.5 0.5 0.5", animation: currentStep >= 2 ? "property: position; to: 0 7 -12; dur: 2000; easing: easeOutQuad" : "property: position; to: 3 2.5 -2; dir: alternate; loop: true; dur: 1500" }, /* @__PURE__ */ React.createElement("a-box", { width: "1.2", height: "0.3", depth: "1.2", color: "#e2e8f0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.15", height: "0.15", color: "#94a3b8", position: "-0.6 0.15 -0.6" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.15", height: "0.15", color: "#94a3b8", position: "0.6 0.15 -0.6" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.15", height: "0.15", color: "#94a3b8", position: "-0.6 0.15 0.6" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.15", height: "0.15", color: "#94a3b8", position: "0.6 0.15 0.6" }), /* @__PURE__ */ React.createElement("a-text", { value: "RESCUE DRONE", color: "#00f0ff", align: "center", position: "0 1 0", scale: "2 2 2", "look-at": "[camera]" }), currentStep >= 3 && /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "4", "radius-top": "0", height: "8", color: "#00f0ff", position: "0 -4 0", opacity: "0.4", transparent: "true", material: "blending: additive" }))), level === 4 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-plane", { position: "0 0 0", rotation: "-90 0 0", width: "100", height: "100", color: "#c2b280", roughness: "0.8" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 -2 -10" }, /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#ffffff", opacity: "0.4", position: "-2 0 0", animation: "property: position; to: -2 20 0; dur: 8000; loop: true" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.15", color: "#ffffff", opacity: "0.4", position: "3 2 2", animation: "property: position; to: 3 22 2; dur: 10000; loop: true; delay: 1000" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.08", color: "#ffffff", opacity: "0.4", position: "-4 1 -3", animation: "property: position; to: -4 21 -3; dur: 7000; loop: true; delay: 500" })), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 -8" }, /* @__PURE__ */ React.createElement("a-sphere", { radius: "3", position: "0 0 0", scale: "1 0.3 1", color: currentStep < 4 ? "#475569" : "#8b5a2b" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.2", height: "2", position: "-1 0.5 0", color: currentStep < 4 ? "#64748b" : "#ff1493", rotation: "15 -20 0", animation: currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.2 1.5 1.2; dur: 2000; easing: easeOutElastic" : "" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.15", height: "1.5", position: "1 0.3 1", color: currentStep < 4 ? "#64748b" : "#00fa9a", rotation: "-10 40 0", animation: currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 2 1.5; dur: 2200; easing: easeOutElastic" : "" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.25", height: "1", position: "0.5 0.5 -1", color: currentStep < 4 ? "#94a3b8" : "#ff4500", rotation: "20 10 0", animation: currentStep === 4 ? "property: scale; from: 1 1 1; to: 2 1.5 2; dur: 1800; easing: easeOutElastic" : "" })), currentStep < 3 && /* @__PURE__ */ React.createElement("a-entity", { position: "-3 0 -5" }, /* @__PURE__ */ React.createElement("a-text", { value: "Marine Waste", color: "#ef4444", align: "center", position: "0 1.5 0", scale: "1.5 1.5 1.5" }), /* @__PURE__ */ React.createElement("a-box", { width: "0.8", height: "0.4", depth: "0.6", color: "#333", position: "0 0.2 0", rotation: "10 45 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "0.4", color: "#3b82f6", position: "0.5 0.1 0.3", rotation: "90 20 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "0.4", color: "#3b82f6", position: "-0.4 0.1 0.5", rotation: "90 -30 0" })), /* @__PURE__ */ React.createElement("a-entity", { id: "iot-rover", position: "4 1 -3", animation: currentStep === 2 ? "property: position; to: -1.5 1 -5; dur: 2000" : currentStep === 3 ? "property: position; to: 0 2 -8; dur: 2000" : "property: position; to: 4 1.2 -3; dir: alternate; loop: true; dur: 2000" }, /* @__PURE__ */ React.createElement("a-text", { value: "IoT ROVER", color: "#fbbf24", align: "center", position: "0 1.5 0", scale: "2 2 2", "look-at": "[camera]" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.5", height: "1.2", color: "#fbbf24", rotation: "0 0 90" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.4", position: "-0.4 0 0", color: "#00f0ff", opacity: "0.6" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.2", height: "0.2", position: "0.6 0 0", color: "#333", rotation: "0 0 90" }, /* @__PURE__ */ React.createElement("a-box", { width: "0.1", height: "0.6", depth: "0.1", color: "#cbd5e1", animation: "property: rotation; to: 0 360 0; loop: true; dur: 200; easing: linear" })), currentStep === 2 && /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.05", height: "3", position: "-1.5 0 0", color: "#ef4444", rotation: "0 0 90", opacity: "0.6", material: "blending: additive" }), currentStep === 3 && /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.3", position: "0 -1 0", color: "#00fa9a", material: "emissive: #00fa9a; emissiveIntensity: 1", animation: "property: position; to: 0 -3 0; dur: 1000" })), currentStep === 4 && /* @__PURE__ */ React.createElement("a-entity", { position: "0 1 -8", animation: "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear" }, /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.2", "radius-top": "0", height: "0.6", color: "#ff00ff", position: "2 1 0", rotation: "90 0 0", animation: "property: position; to: 2 1.5 0; dir: alternate; loop: true; dur: 1500" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.15", "radius-top": "0", height: "0.4", color: "#00ff00", position: "-2 0.5 1", rotation: "90 45 0", animation: "property: position; to: -2 0.8 1; dir: alternate; loop: true; dur: 1200" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.2", "radius-top": "0", height: "0.5", color: "#ffff00", position: "0 1.2 2", rotation: "90 -30 0", animation: "property: position; to: 0 1.6 2; dir: alternate; loop: true; dur: 1800" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.1", "radius-top": "0", height: "0.3", color: "#ff7700", position: "1.5 0.3 -1.5", rotation: "90 20 0", animation: "property: position; to: 1.5 0.6 -1.5; dir: alternate; loop: true; dur: 1000" }))), level === 5 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-plane", { position: "0 0 0", rotation: "-90 0 0", width: "100", height: "100", color: currentStep < 3 ? "#d2b48c" : "#228b22", roughness: "1", animation: currentStep === 3 ? "property: components.material.material.color; type: color; to: #228b22; dur: 2000; easing: easeInOutQuad" : "" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 -8" }, /* @__PURE__ */ React.createElement("a-entity", { position: "-3 0 0" }, /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.5", "radius-top": "0", height: currentStep < 4 ? "0.5" : "2", color: currentStep < 4 ? "#8b5a2b" : "#32cd32", position: "0 0.25 0", animation: currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 3 1.5; dur: 2000; easing: easeOutElastic" : "" })), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 0" }, /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.5", "radius-top": "0", height: currentStep < 4 ? "0.5" : "2.2", color: currentStep < 4 ? "#8b5a2b" : "#32cd32", position: "0 0.25 0", animation: currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 3 1.5; dur: 2200; easing: easeOutElastic" : "" })), /* @__PURE__ */ React.createElement("a-entity", { position: "3 0 0" }, /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "0.5", "radius-top": "0", height: currentStep < 4 ? "0.5" : "1.8", color: currentStep < 4 ? "#8b5a2b" : "#32cd32", position: "0 0.25 0", animation: currentStep === 4 ? "property: scale; from: 1 1 1; to: 1.5 3 1.5; dur: 1800; easing: easeOutElastic" : "" })), currentStep === 1 && /* @__PURE__ */ React.createElement("a-entity", { position: "0 0.5 2" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "2", height: "0.1", color: "#00f0ff", opacity: "0.3", material: "blending: additive", animation: "property: scale; to: 1.5 1 1.5; dir: alternate; loop: true; dur: 1000" }), /* @__PURE__ */ React.createElement("a-text", { value: "SCANNING SOIL...", color: "#00f0ff", align: "center", position: "0 1 0", scale: "1.5 1.5 1.5", "look-at": "[camera]" })), currentStep >= 2 && /* @__PURE__ */ React.createElement("a-entity", { position: "0 0.1 2" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.15", height: "8", color: "#64748b", rotation: "0 0 90" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "3", color: "#64748b", position: "-3 0 -1.5", rotation: "90 0 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "3", color: "#64748b", position: "0 0 -1.5", rotation: "90 0 0" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "3", color: "#64748b", position: "3 0 -1.5", rotation: "90 0 0" }), currentStep >= 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.16", height: "8", color: "#00f0ff", opacity: "0.5", rotation: "0 0 90", material: "blending: additive", animation: "property: scale; to: 1.1 1 1.1; dir: alternate; loop: true; dur: 500" }), /* @__PURE__ */ React.createElement("a-entity", { position: "-3 0.5 -3" }, /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#94a3b8" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "1.5", "radius-top": "0", height: "2", color: "#00f0ff", position: "0 1 0", opacity: "0.4", rotation: "180 0 0", material: "blending: additive", animation: "property: rotation; to: 180 360 0; loop: true; dur: 2000" })), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0.5 -3" }, /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#94a3b8" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "1.5", "radius-top": "0", height: "2", color: "#00f0ff", position: "0 1 0", opacity: "0.4", rotation: "180 0 0", material: "blending: additive", animation: "property: rotation; to: 180 360 0; loop: true; dur: 2000" })), /* @__PURE__ */ React.createElement("a-entity", { position: "3 0.5 -3" }, /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#94a3b8" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "1.5", "radius-top": "0", height: "2", color: "#00f0ff", position: "0 1 0", opacity: "0.4", rotation: "180 0 0", material: "blending: additive", animation: "property: rotation; to: 180 360 0; loop: true; dur: 2000" })))))), level === 6 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-plane", { position: "0 0 0", rotation: "-90 0 0", width: "100", height: "100", color: currentStep < 3 ? "#1e293b" : "#4ade80", roughness: "1", animation: currentStep === 3 ? "property: components.material.material.color; type: color; to: #4ade80; dur: 2000; easing: easeInOutQuad" : "" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "3", position: "-15 -5 -30", color: "#fbbf24", material: "emissive: #fbbf24; emissiveIntensity: 1", animation: currentStep >= 2 ? "property: position; to: -10 15 -30; dur: 3000; easing: easeOutQuad" : "" }), currentStep >= 3 && /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "40", "radius-top": "2", height: "60", color: "#fef08a", position: "-10 5 -20", rotation: "-30 0 0", opacity: "0.1", transparent: "true", material: "blending: additive" }), /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 -10" }, /* @__PURE__ */ React.createElement("a-entity", { position: "-4 0 0" }, /* @__PURE__ */ React.createElement("a-box", { width: "3", height: "2", depth: "3", color: currentStep < 3 ? "#334155" : "#d4d4d8" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "2.5", "radius-top": "0", height: "1.5", color: currentStep < 3 ? "#1e293b" : "#8b5a2b", position: "0 1.75 0" }), /* @__PURE__ */ React.createElement("a-plane", { width: "0.8", height: "1", color: currentStep < 3 ? "#0f172a" : "#fbbf24", position: "0 0 1.51", material: currentStep >= 3 ? "emissive: #fbbf24; emissiveIntensity: 1" : "" })), /* @__PURE__ */ React.createElement("a-entity", { position: "4 0 0", rotation: "0 -20 0" }, /* @__PURE__ */ React.createElement("a-box", { width: "3", height: "2", depth: "3", color: currentStep < 3 ? "#334155" : "#d4d4d8" }), /* @__PURE__ */ React.createElement("a-cone", { "radius-bottom": "2.5", "radius-top": "0", height: "1.5", color: currentStep < 3 ? "#1e293b" : "#8b5a2b", position: "0 1.75 0" }), /* @__PURE__ */ React.createElement("a-plane", { width: "0.8", height: "1", color: currentStep < 3 ? "#0f172a" : "#fbbf24", position: "0 0 1.51", material: currentStep >= 3 ? "emissive: #fbbf24; emissiveIntensity: 1" : "" })), /* @__PURE__ */ React.createElement("a-entity", { position: "-8 0 2" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.3", height: "2", color: "#3e2723", position: "0 1 0" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "1.5", color: currentStep < 3 ? "#064e3b" : "#22c55e", position: "0 2.5 0" })), /* @__PURE__ */ React.createElement("a-entity", { position: "7 0 -3" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.3", height: "2", color: "#3e2723", position: "0 1 0" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "2", color: currentStep < 3 ? "#064e3b" : "#22c55e", position: "0 3 0" })), currentStep >= 2 && /* @__PURE__ */ React.createElement("a-entity", { position: "0 0 4" }, /* @__PURE__ */ React.createElement("a-box", { width: "2", height: "0.5", depth: "2", color: "#94a3b8", position: "0 0.25 0" }), /* @__PURE__ */ React.createElement("a-box", { width: "1", height: "1", depth: "1", color: "#cbd5e1", position: "0 1 0" }), /* @__PURE__ */ React.createElement("a-box", { width: "0.8", height: "0.2", depth: "0.8", color: currentStep >= 3 ? "#4ade80" : "#ef4444", position: "0 1.6 0", material: currentStep >= 3 ? "emissive: #4ade80; emissiveIntensity: 1" : "" }), /* @__PURE__ */ React.createElement("a-entity", { position: "-2 0 0" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "1", color: "#64748b", position: "0 0.5 0" }), /* @__PURE__ */ React.createElement("a-plane", { width: "1.5", height: "1", color: "#1e3a8a", position: "0 1 0", rotation: currentStep >= 3 ? "-60 0 0" : "-90 0 0", animation: currentStep === 3 ? "property: rotation; to: -60 -30 0; dur: 2000" : "" })), /* @__PURE__ */ React.createElement("a-entity", { position: "2 0 0" }, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.1", height: "1", color: "#64748b", position: "0 0.5 0" }), /* @__PURE__ */ React.createElement("a-plane", { width: "1.5", height: "1", color: "#1e3a8a", position: "0 1 0", rotation: currentStep >= 3 ? "-60 0 0" : "-90 0 0", animation: currentStep === 3 ? "property: rotation; to: -60 30 0; dur: 2000" : "" })), currentStep >= 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.05", height: "4.5", color: "#00f0ff", position: "-2 0.5 -2.5", rotation: "90 -30 0", opacity: "0.6", material: "blending: additive" }), /* @__PURE__ */ React.createElement("a-cylinder", { radius: "0.05", height: "4.5", color: "#00f0ff", position: "2 0.5 -2.5", rotation: "90 30 0", opacity: "0.6", material: "blending: additive" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#fbbf24", position: "0 0.5 0", material: "emissive: #fbbf24; emissiveIntensity: 1", animation: "property: position; to: -4 1 -3.5; dur: 1500; loop: true" }), /* @__PURE__ */ React.createElement("a-sphere", { radius: "0.1", color: "#fbbf24", position: "0 0.5 0", material: "emissive: #fbbf24; emissiveIntensity: 1", animation: "property: position; to: 4 1 -3.5; dur: 1500; loop: true; delay: 500" })))))));
}

// src/components/DPadOverlay.jsx
var import_framer_motion = require("framer-motion");
var import_lucide_react = require("lucide-react");
function DPadOverlay({ setMovement }) {
  const handleStart = (dir) => (e) => {
    e.preventDefault();
    setMovement(dir, true);
  };
  const handleEnd = (dir) => (e) => {
    e.preventDefault();
    setMovement(dir, false);
  };
  const btnClass = "w-12 h-12 md:w-16 md:h-16 glass rounded-xl flex items-center justify-center text-cyan hover:bg-cyan/20 active:bg-cyan/40 transition-colors select-none touch-none";
  return /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[1000] flex flex-col items-center pointer-events-auto" }, /* @__PURE__ */ React.createElement("div", { className: "mb-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: btnClass,
      onPointerDown: handleStart("forward"),
      onPointerUp: handleEnd("forward"),
      onPointerLeave: handleEnd("forward"),
      onTouchStart: handleStart("forward"),
      onTouchEnd: handleEnd("forward"),
      onContextMenu: (e) => e.preventDefault()
    },
    /* @__PURE__ */ React.createElement(import_lucide_react.ArrowUp, { size: 32 })
  )), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: btnClass,
      onPointerDown: handleStart("left"),
      onPointerUp: handleEnd("left"),
      onPointerLeave: handleEnd("left"),
      onTouchStart: handleStart("left"),
      onTouchEnd: handleEnd("left"),
      onContextMenu: (e) => e.preventDefault()
    },
    /* @__PURE__ */ React.createElement(import_lucide_react.ArrowLeft, { size: 32 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: btnClass,
      onPointerDown: handleStart("backward"),
      onPointerUp: handleEnd("backward"),
      onPointerLeave: handleEnd("backward"),
      onTouchStart: handleStart("backward"),
      onTouchEnd: handleEnd("backward"),
      onContextMenu: (e) => e.preventDefault()
    },
    /* @__PURE__ */ React.createElement(import_lucide_react.ArrowDown, { size: 32 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: btnClass,
      onPointerDown: handleStart("right"),
      onPointerUp: handleEnd("right"),
      onPointerLeave: handleEnd("right"),
      onTouchStart: handleStart("right"),
      onTouchEnd: handleEnd("right"),
      onContextMenu: (e) => e.preventDefault()
    },
    /* @__PURE__ */ React.createElement(import_lucide_react.ArrowRight, { size: 32 })
  )));
}

// src/components/MissionCompleteOverlay.jsx
var import_framer_motion2 = require("framer-motion");
function MissionCompleteOverlay({ onReturn }) {
  return /* @__PURE__ */ React.createElement(
    import_framer_motion2.motion.div,
    {
      id: "mission-complete-screen",
      className: "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 pointer-events-auto backdrop-blur-sm",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 1 }
    },
    /* @__PURE__ */ React.createElement(
      import_framer_motion2.motion.div,
      {
        className: "glass-cyan p-12 rounded-3xl flex flex-col items-center text-center max-w-xl mx-4 shadow-[0_0_50px_rgba(0,240,255,0.2)] border border-cyan/50 relative overflow-hidden",
        initial: { scale: 0.9, y: 50 },
        animate: { scale: 1, y: 0 },
        transition: { type: "spring", bounce: 0.4, duration: 1.2 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "absolute -top-32 -left-32 w-64 h-64 bg-cyan/20 rounded-full blur-[100px] pointer-events-none" }),
      /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none" }),
      /* @__PURE__ */ React.createElement(
        import_framer_motion2.motion.h1,
        {
          className: "text-4xl md:text-5xl font-bold text-cyan mb-4 tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]",
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.5 }
        },
        "MISSION ACCOMPLISHED!"
      ),
      /* @__PURE__ */ React.createElement(
        import_framer_motion2.motion.p,
        {
          className: "text-xl text-white/90 mb-10 tracking-wide font-light",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 1 }
        },
        "You have successfully restored the ecosystem."
      ),
      /* @__PURE__ */ React.createElement(
        import_framer_motion2.motion.button,
        {
          id: "btn-return-menu",
          onClick: onReturn,
          className: "glass px-8 py-4 rounded-full text-white font-bold tracking-widest text-lg hover:bg-white/10 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center space-x-3 border-white/20",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 1.5 }
        },
        /* @__PURE__ */ React.createElement("span", { className: "text-2xl" }, "\u{1F5FA}\uFE0F"),
        /* @__PURE__ */ React.createElement("span", null, "Return to Nusantara Map")
      )
    )
  );
}

// src/components/CertificateOverlay.jsx
var import_react2 = require("react");
var import_framer_motion3 = require("framer-motion");
function CertificateOverlay({ onDownload, defaultName }) {
  const [heroName, setHeroName] = (0, import_react2.useState)(defaultName || "");
  const [heroLocation, setHeroLocation] = (0, import_react2.useState)("");
  const handleDownload = () => {
    onDownload(heroName.trim() || "Eco-Hero", heroLocation.trim() || "your community");
  };
  return /* @__PURE__ */ React.createElement(
    import_framer_motion3.motion.div,
    {
      id: "certificate-modal",
      className: "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 pointer-events-auto backdrop-blur-sm",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 1 }
    },
    /* @__PURE__ */ React.createElement(
      import_framer_motion3.motion.div,
      {
        className: "glass-cyan p-12 rounded-3xl flex flex-col items-center text-center max-w-xl mx-4 shadow-[0_0_50px_rgba(0,240,255,0.2)] border border-cyan/50 relative overflow-hidden",
        initial: { scale: 0.9, y: 50 },
        animate: { scale: 1, y: 0 },
        transition: { type: "spring", bounce: 0.4, duration: 1.2 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "absolute -top-32 -left-32 w-64 h-64 bg-cyan/20 rounded-full blur-[100px] pointer-events-none" }),
      /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none" }),
      /* @__PURE__ */ React.createElement(
        import_framer_motion3.motion.h1,
        {
          className: "text-4xl md:text-5xl font-bold text-cyan mb-4 tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]",
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.5 }
        },
        "\u{1F3C6} Nusantara Saved!"
      ),
      /* @__PURE__ */ React.createElement(
        import_framer_motion3.motion.p,
        {
          className: "text-xl text-white/90 mb-8 tracking-wide font-light",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 1 }
        },
        "Enter your name to claim your Eco-Hero Certificate!"
      ),
      /* @__PURE__ */ React.createElement(
        import_framer_motion3.motion.input,
        {
          type: "text",
          id: "hero-name",
          value: heroName,
          onChange: (e) => setHeroName(e.target.value),
          className: "w-full bg-transparent border border-cyan-400 text-white placeholder-white/50 rounded-xl px-6 py-4 outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all text-center text-xl mb-4",
          placeholder: "Your Name",
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 1.2 },
          autoFocus: true
        }
      ),
      /* @__PURE__ */ React.createElement(
        import_framer_motion3.motion.input,
        {
          type: "text",
          id: "hero-location",
          value: heroLocation,
          onChange: (e) => setHeroLocation(e.target.value),
          className: "w-full bg-transparent border border-cyan-400 text-white placeholder-white/50 rounded-xl px-6 py-4 outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all text-center text-xl mb-10",
          placeholder: "Your City (e.g., South Jakarta)",
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 1.3 }
        }
      ),
      /* @__PURE__ */ React.createElement(
        import_framer_motion3.motion.button,
        {
          id: "btn-download-cert",
          onClick: handleDownload,
          className: "glass px-8 py-4 rounded-full text-white font-bold tracking-widest text-lg hover:bg-white/10 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center space-x-3 border-white/20",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 1.5 }
        },
        /* @__PURE__ */ React.createElement("span", null, "\u{1F4C4} Download Certificate (PDF)")
      )
    )
  );
}

// src/LevelApp.jsx
var import_framer_motion4 = require("framer-motion");
var import_lucide_react2 = require("lucide-react");

// src/utils/audioManager.js
var bgmOverall = new Audio("/music/overall-music.mp3");
var bgmLevel1 = new Audio("/music/level-1.mp3");
var bgmLevel2 = new Audio("/music/level-2.mp3");
var bgmLevel3 = new Audio("/music/level-3.mp3");
var bgmLevel4 = new Audio("/music/level-4.mp3");
var bgmLevel5 = new Audio("/music/level-5.mp3");
var bgmLevel6 = new Audio("/music/level-6.mp3");
var bgmCongrats = new Audio("/music/congratulations.mp3");
var allTracks = [bgmOverall, bgmLevel1, bgmLevel2, bgmLevel3, bgmLevel4, bgmLevel5, bgmLevel6, bgmCongrats];
allTracks.forEach((t) => t.loop = true);
var currentTrack = null;
var isAudioMuted = localStorage.getItem("evieee_audio_muted") === "true";
var playMusic = (trackName) => {
  allTracks.forEach((t) => {
    t.pause();
  });
  let track = null;
  switch (trackName) {
    case "overall":
      track = bgmOverall;
      break;
    case "level1":
      track = bgmLevel1;
      break;
    case "level2":
      track = bgmLevel2;
      break;
    case "level3":
      track = bgmLevel3;
      break;
    case "level4":
      track = bgmLevel4;
      break;
    case "level5":
      track = bgmLevel5;
      break;
    case "level6":
      track = bgmLevel6;
      break;
    case "congrats":
      track = bgmCongrats;
      break;
  }
  currentTrack = track;
  if (track && !isAudioMuted) {
    track.play().catch((e) => console.log("Audio play blocked:", e));
  }
};
var toggleMuteGlobal = (muted) => {
  isAudioMuted = muted;
  localStorage.setItem("evieee_audio_muted", muted ? "true" : "false");
  if (muted) {
    allTracks.forEach((t) => t.pause());
  } else if (currentTrack) {
    currentTrack.play().catch((e) => console.log("Audio play blocked:", e));
  }
};
var isMuted = () => isAudioMuted;

// src/LevelApp.jsx
function LevelApp({ levelId }) {
  (0, import_react3.useEffect)(() => {
    playMusic("level" + levelId);
  }, [levelId]);
  const [phase, setPhase] = (0, import_react3.useState)(levelId * 2);
  const [userName, setUserName] = (0, import_react3.useState)("");
  const [isMutedState, setIsMutedState] = (0, import_react3.useState)(isMuted());
  const [showMissionComplete, setShowMissionComplete] = (0, import_react3.useState)(false);
  const [unlockedLevels, setUnlockedLevels] = (0, import_react3.useState)([false, false, false, false, false, false]);
  const [showCertificate, setShowCertificate] = (0, import_react3.useState)(false);
  const [trashCollected, setTrashCollected] = (0, import_react3.useState)(0);
  const [currentTrashId, setCurrentTrashId] = (0, import_react3.useState)(null);
  const [isModalOpen, setIsModalOpen] = (0, import_react3.useState)(false);
  const [currentStep, setCurrentStep] = (0, import_react3.useState)(1);
  const [dialogue, setDialogue] = (0, import_react3.useState)("");
  const [showDialogue, setShowDialogue] = (0, import_react3.useState)(false);
  const [movement, setMovement] = (0, import_react3.useState)({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  const [isFullscreen, setIsFullscreen] = (0, import_react3.useState)(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  const handleSetMovement = (dir, isPressed) => {
    setMovement((prev) => ({ ...prev, [dir]: isPressed }));
  };
  const handleToggleMute = () => {
    const newMuted = !isMutedState;
    setIsMutedState(newMuted);
    toggleMuteGlobal(newMuted);
  };
  const handleEnterSystem = () => {
    setPhase(1);
    playMusic("overall");
  };
  const handleIntroComplete = (name) => {
    setUserName(name);
  };
  const handleLevelSelect = (levelId2) => {
    if (levelId2 === 6) {
      const canPlayLevel6 = unlockedLevels.slice(0, 5).every((status) => status === true);
      if (!canPlayLevel6) {
        alert("Access Denied! You must save the other 5 islands first before unlocking Papua!");
        return;
      }
    }
    if (levelId2 === 1) {
      playMusic("level1");
      setPhase(2);
    } else if (levelId2 === 2) {
      playMusic("level2");
      setPhase(4);
    } else if (levelId2 === 3) {
      playMusic("level3");
      setPhase(6);
    } else if (levelId2 === 4) {
      playMusic("level4");
      setPhase(8);
    } else if (levelId2 === 5) {
      playMusic("level5");
      setPhase(10);
    } else if (levelId2 === 6) {
      playMusic("level6");
      setPhase(12);
    }
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
      localStorage.setItem(`evieee_unlocked_level${nextLevelId}`, "true");
    }
    localStorage.setItem("evieee_skip_intro", "true");
    window.location.href = "/";
  };
  const handleDownloadCertificate = (name, location) => {
    if (!window.jspdf) return;
    const doc = new window.jspdf.jsPDF({ orientation: "landscape" });
    doc.setFillColor(10, 25, 47);
    doc.rect(0, 0, 297, 210, "F");
    doc.setDrawColor(0, 240, 255);
    doc.setLineWidth(5);
    doc.rect(10, 10, 277, 190);
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.rect(15, 15, 267, 180);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("EvIEEE SMART CITY SIMULATION", 148, 50, { align: "center" });
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(40);
    doc.text("CERTIFICATE OF COMPLETION", 148, 80, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Proudly Presented To:", 148, 110, { align: "center" });
    doc.setTextColor(74, 222, 128);
    doc.setFontSize(50);
    doc.text(name, 148, 140, { align: "center" });
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    const closingMessage = "Hopefully, you can become a true local hero in " + location + "!";
    doc.text(closingMessage, 148, 160, { align: "center" });
    doc.setFont("helvetica", "normal");
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Date of Completion: " + today, 20, 190);
    doc.setFillColor(212, 175, 55);
    doc.circle(270, 180, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("OFFICIAL", 270, 178, { align: "center" });
    doc.text("ECO-HERO", 270, 182, { align: "center" });
    doc.setFontSize(12);
    doc.text("EvIEEE Smart City System", 250, 190, { align: "center" });
    doc.save("EvIEEE_Eco_Hero_Certificate.pdf");
  };
  (0, import_react3.useEffect)(() => {
    if (phase === 2) {
      setTimeout(() => {
        setDialogue(`Welcome to Java! The city is in danger. GUIDE: Explore the area and use the "Scan Area" button to find and sort trash!`);
        setShowDialogue(true);
        setTimeout(() => setShowDialogue(false), 5e3);
      }, 1e3);
    } else if (phase === 4) {
      setTimeout(() => {
        setDialogue(`Oh no! The forest is destroyed. We must restore it step-by-step to stop the flood!`);
        setShowDialogue(true);
        setTimeout(() => setShowDialogue(false), 12e3);
      }, 1e3);
    } else if (phase === 6) {
      setTimeout(() => {
        setDialogue(`Welcome to Borneo! Peatland fires are causing toxic smog and animals are trapped! We must act fast!`);
        setShowDialogue(true);
        setTimeout(() => setShowDialogue(false), 12e3);
      }, 1e3);
    } else if (phase === 8) {
      setTimeout(() => {
        setDialogue(`Welcome to Celebes! The coral reefs are sick. Deploy the IoT (Internet of Things) Rover\u2014a Smart Remote-Controlled Submarine\u2014to clean the waste and plant Bio-Corals!`);
        setShowDialogue(true);
        setTimeout(() => setShowDialogue(false), 12e3);
      }, 1e3);
    } else if (phase === 10) {
      setTimeout(() => {
        setDialogue(`Welcome to Nusa! The land is dry and crops are failing. Use the Soil Scanner and deploy the AI Irrigation System!`);
        setShowDialogue(true);
        setTimeout(() => setShowDialogue(false), 12e3);
      }, 1e3);
    } else if (phase === 12) {
      setTimeout(() => {
        setDialogue(`Welcome to Papua! The village is in darkness. Build a Renewable Energy Microgrid to bring clean power!`);
        setShowDialogue(true);
        setTimeout(() => setShowDialogue(false), 12e3);
      }, 1e3);
    }
  }, [phase, userName]);
  const triggerDialogue = (msg) => {
    setDialogue(msg);
    setShowDialogue(true);
    setTimeout(() => setShowDialogue(false), 5e3);
  };
  const handleScan = () => {
    if (phase === 2) {
      const trashItems = document.querySelectorAll(".trash-item");
      let found = null;
      for (let i = 0; i < trashItems.length; i++) {
        if (trashItems[i].dataset.collected !== "true") {
          found = trashItems[i];
          break;
        }
      }
      if (found) {
        setCurrentTrashId(found.id);
        let highlight = found.querySelector(".trash-highlight");
        if (!highlight) {
          highlight = document.createElement("a-box");
          highlight.setAttribute("class", "trash-highlight");
          highlight.setAttribute("wireframe", "true");
          highlight.setAttribute("color", "#00f0ff");
          highlight.setAttribute("width", "2");
          highlight.setAttribute("height", "2");
          highlight.setAttribute("depth", "2");
          highlight.setAttribute("position", "0 1 0");
          highlight.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear");
          found.appendChild(highlight);
        }
        let label = found.querySelector(".trash-label");
        if (!label) {
          label = document.createElement("a-text");
          label.setAttribute("class", "trash-label");
          label.setAttribute("value", found.dataset.name || "Trash");
          label.setAttribute("color", "#00f0ff");
          label.setAttribute("align", "center");
          label.setAttribute("position", "0 2.5 0");
          label.setAttribute("scale", "4 4 4");
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
    if (choice === "cancel") {
      const highlight = trashEl.querySelector(".trash-highlight");
      if (highlight) trashEl.removeChild(highlight);
      const label = trashEl.querySelector(".trash-label");
      if (label) trashEl.removeChild(label);
      setCurrentTrashId(null);
      return;
    }
    const actualType = trashEl.dataset.type;
    if (actualType === choice) {
      const highlight = trashEl.querySelector(".trash-highlight");
      if (highlight) trashEl.removeChild(highlight);
      const label = trashEl.querySelector(".trash-label");
      if (label) trashEl.removeChild(label);
      trashEl.dataset.collected = "true";
      setCurrentTrashId(null);
      const targetBinId = `bin-${choice}`;
      const binEl = document.getElementById(targetBinId);
      if (binEl && typeof AFRAME !== "undefined") {
        const binPos = new AFRAME.THREE.Vector3();
        binEl.object3D.getWorldPosition(binPos);
        binPos.y += 1;
        trashEl.setAttribute("animation", `property: position; to: ${binPos.x} ${binPos.y} ${binPos.z}; dur: 1000; easing: easeInOutQuad`);
        setTimeout(() => {
          trashEl.setAttribute("visible", "false");
          setTrashCollected((prev) => {
            const newVal = prev + 1;
            if (newVal === 3) {
              setDialogue("REAL WORLD IMPACT: Sorting and recycling reduces landfill waste and turns old paper into new plants!");
              setShowDialogue(true);
              setTimeout(() => {
                setShowDialogue(false);
                setShowMissionComplete(true);
              }, 8e3);
            } else {
              triggerDialogue("Great job! Processing waste... Success!");
            }
            return newVal;
          });
        }, 1e3);
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
      setTimeout(() => setShowDialogue(false), 8e3);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Seeds planted! They need water and sunlight to grow strong.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 8e3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("REAL WORLD IMPACT: Planting trees prevents deadly floods and absorbs bad pollution from the air!");
      setShowDialogue(true);
      setTimeout(() => {
        setShowDialogue(false);
        setShowMissionComplete(true);
      }, 8e3);
    }
  };
  const handleBorneoAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("Drone deployed! Positioned above the fire zones.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("REAL WORLD IMPACT: Putting out peat fires stops toxic smog and saves the homes of endangered animals!");
      setShowDialogue(true);
      setTimeout(() => {
        setShowDialogue(false);
        setShowMissionComplete(true);
      }, 8e3);
    }
  };
  const handleCelebesAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("IoT Rover deployed! Initiating marine waste cleanup protocol.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Waste cleared! Deploying Bio-Coral skeletons for fast growth.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("REAL WORLD IMPACT: Restoring coral reefs brings back fish, cleans the ocean, and protects our coastlines!");
      setShowDialogue(true);
      setTimeout(() => {
        setShowDialogue(false);
        setShowMissionComplete(true);
      }, 8e3);
    }
  };
  const handleNusaAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("Dry area scanned! Connecting AI irrigation pipes.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Pipes connected! Distributing water evenly across the fields.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("WONDERFUL! The crops are growing and the land is thriving again. You saved Nusa!");
      setShowDialogue(true);
      setTimeout(() => {
        setShowDialogue(false);
        setShowMissionComplete(true);
      }, 8e3);
    }
  };
  const handlePapuaAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setDialogue("Microgrid constructed! Now, align the solar panels to the sun.");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setDialogue("Panels aligned! Absorbing solar energy... Powering up the village!");
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 6e3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setDialogue("INCREDIBLE! The village is glowing with clean energy. You have saved Nusantara!");
      setShowDialogue(true);
      setTimeout(() => {
        setShowDialogue(false);
        setShowCertificate(true);
        playMusic("congrats");
      }, 8e3);
    }
  };
  return /* @__PURE__ */ React.createElement("main", { className: "relative w-screen h-screen overflow-hidden bg-navy-900 text-white font-sans pointer-events-none" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleToggleMute,
      className: "fixed top-4 right-4 z-[999] p-2 text-sm rounded-full glass-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan/20 active:scale-95 transition-all pointer-events-auto flex items-center justify-center border-cyan/50"
    },
    isMutedState ? /* @__PURE__ */ React.createElement(import_lucide_react2.VolumeX, { size: 20, className: "text-red-400" }) : /* @__PURE__ */ React.createElement(import_lucide_react2.Volume2, { size: 20, className: "text-cyan" })
  ), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, showMissionComplete && /* @__PURE__ */ React.createElement(MissionCompleteOverlay, { onReturn: handleReturnToMenu })), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, showCertificate && /* @__PURE__ */ React.createElement(CertificateOverlay, { onDownload: handleDownloadCertificate, defaultName: userName })), (phase === 2 || phase === 4 || phase === 6 || phase === 8 || phase === 10 || phase === 12) && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 z-0 pointer-events-auto" }, /* @__PURE__ */ React.createElement(AFrameScene, { movementState: movement, level: phase === 4 ? 2 : phase === 6 ? 3 : phase === 8 ? 4 : phase === 10 ? 5 : phase === 12 ? 6 : 1, currentStep })), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, phase === 2 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-cyan px-6 py-2 rounded-full pointer-events-none",
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm tracking-widest uppercase text-cyan" }, "Level 1: Java")
  ), /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-6 z-50 glass px-6 py-3 rounded-xl flex flex-col space-y-2 pointer-events-none",
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Recycle, { className: "text-green-400", size: 24 }), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, "Trash Recycled: ", /* @__PURE__ */ React.createElement("span", { className: trashCollected === 3 ? "text-green-400" : "text-cyan" }, trashCollected, "/3")))
  ), /* @__PURE__ */ React.createElement(DPadOverlay, { setMovement: handleSetMovement }), !isModalOpen && !currentTrashId && trashCollected < 3 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      id: "btn-scan",
      onClick: handleScan,
      className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass-cyan px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase text-cyan flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, "\u{1F50D}"),
    /* @__PURE__ */ React.createElement("span", null, "Scan Area for Trash")
  ), !isModalOpen && currentTrashId && trashCollected < 3 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      id: "btn-put-in-trash",
      onClick: () => setIsModalOpen(true),
      className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:bg-green-400/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase text-green-400 flex items-center space-x-2 border-green-400/30 w-[90%] md:w-auto justify-center whitespace-nowrap",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, "\u{1F5D1}\uFE0F"),
    /* @__PURE__ */ React.createElement("span", null, "Put in the Trash")
  ), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, isModalOpen && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm pointer-events-auto",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    /* @__PURE__ */ React.createElement(
      import_framer_motion4.motion.div,
      {
        className: "glass-cyan p-8 rounded-2xl flex flex-col items-center max-w-md w-full mx-4 shadow-[0_0_30px_rgba(0,240,255,0.2)]",
        initial: { scale: 0.9, y: 20 },
        animate: { scale: 1, y: 0 },
        exit: { scale: 0.9, y: 20 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center border border-cyan/50 mb-6" }, /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "text-cyan w-8 h-8" })),
      /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-white mb-2 text-center" }, "Trash Found!"),
      /* @__PURE__ */ React.createElement("p", { className: "text-cyan/80 mb-8 text-center" }, "Where does this belong?"),
      /* @__PURE__ */ React.createElement("div", { className: "flex flex-col w-full space-y-4" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => handleSortChoice("organic"),
          className: "w-full glass py-3 px-6 rounded-xl text-green-400 font-bold tracking-wider hover:bg-green-400/20 transition-colors flex items-center space-x-3 border-green-400/30 shadow-[0_0_15px_rgba(74,222,128,0.2)] text-left"
        },
        /* @__PURE__ */ React.createElement("span", { className: "text-3xl flex-shrink-0" }, "\u{1F33F}"),
        /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "text-lg" }, "Organic Bin"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-green-400/80 normal-case tracking-normal mt-1 leading-tight" }, "Natural waste that can decompose like leaves & food scraps! \u{1F331}"))
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => handleSortChoice("recycle"),
          className: "w-full glass py-3 px-6 rounded-xl text-blue-400 font-bold tracking-wider hover:bg-blue-400/20 transition-colors flex items-center space-x-3 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-left"
        },
        /* @__PURE__ */ React.createElement("span", { className: "text-3xl flex-shrink-0" }, "\u267B\uFE0F"),
        /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "text-lg" }, "Recycle Bin"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-blue-400/80 normal-case tracking-normal mt-1 leading-tight" }, "Recyclable waste that can be made into new items (plastic & paper)! \u267B\uFE0F"))
      )),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => handleSortChoice("cancel"),
          className: "mt-6 text-sm text-white/50 hover:text-white transition-colors uppercase tracking-widest"
        },
        "Cancel"
      )
    )
  )))), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, phase === 4 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-cyan px-6 py-2 rounded-full pointer-events-none",
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm tracking-widest uppercase text-cyan" }, "Level 2: Andalas (Mitigation)")
  ), /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none",
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Leaf, { className: "text-slate-700 w-6 h-6", fill: "#e2e8f0" })), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm" }, "Eco-Restoration", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-cyan text-xs" }, "System"))),
    /* @__PURE__ */ React.createElement("ul", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? "bg-cyan-500 border-cyan-400" : "border-white/30"}` }, currentStep > 1 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 1 ? "text-white/50 line-through" : "text-white" }, "Clean River Area")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? "bg-green-500 border-green-400" : "border-white/30"}` }, currentStep > 2 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 2 ? "text-white/50 line-through" : "text-white" }, "Plant Seeds")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? "bg-yellow-500 border-yellow-400" : "border-white/30"}` }, currentStep > 3 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 3 ? "text-white/50 line-through" : "text-white" }, "Water & Sunlight")))
  ), /* @__PURE__ */ React.createElement(DPadOverlay, { setMovement: handleSetMovement }), currentStep < 4 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      onClick: handleRestorationAction,
      className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? "text-cyan border-cyan/30" : currentStep === 2 ? "text-green-400 border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.4)]" : "text-yellow-400 border-yellow-400/30 shadow-[0_0_20px_rgba(251,191,36,0.4)]"}`,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, currentStep === 1 ? "\u{1F9F9}" : currentStep === 2 ? "\u{1F331}" : "\u2600\uFE0F"),
    /* @__PURE__ */ React.createElement("span", null, currentStep === 1 ? "Initiate Clean-Up" : currentStep === 2 ? "Plant Seeds" : "Give Water & Sunlight")
  ))), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, phase === 6 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-cyan px-6 py-2 rounded-full pointer-events-none",
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm tracking-widest uppercase text-cyan" }, "Level 3: Borneo (Peatland Fires)")
  ), /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none",
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Flame, { className: "text-red-500 w-6 h-6", fill: "#fecaca" })), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm" }, "Fire Mitigation", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-cyan text-xs" }, "System"))),
    /* @__PURE__ */ React.createElement("ul", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? "bg-cyan-500 border-cyan-400" : "border-white/30"}` }, currentStep > 1 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 1 ? "text-white/50 line-through" : "text-white" }, "Deploy Rescue Drone")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? "bg-blue-500 border-blue-400" : "border-white/30"}` }, currentStep > 2 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 2 ? "text-white/50 line-through" : "text-white" }, "Extinguish Peatland Fires")))
  ), /* @__PURE__ */ React.createElement(DPadOverlay, { setMovement: handleSetMovement }), currentStep < 3 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      onClick: handleBorneoAction,
      className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? "text-cyan border-cyan/30" : "text-blue-400 border-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.4)]"}`,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, currentStep === 1 ? "\u{1F681}" : "\u{1F4A7}"),
    /* @__PURE__ */ React.createElement("span", null, currentStep === 1 ? "Deploy Drone" : "Extinguish Fire")
  ))), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, phase === 8 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-cyan px-6 py-2 rounded-full pointer-events-none",
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm tracking-widest uppercase text-cyan" }, "Level 4: Celebes (The Ocean's Heart)")
  ), /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none",
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Droplets, { className: "text-blue-500 w-6 h-6", fill: "#bfdbfe" })), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm" }, "Marine Bio-Tech", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-cyan text-xs" }, "System"))),
    /* @__PURE__ */ React.createElement("ul", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? "bg-cyan-500 border-cyan-400" : "border-white/30"}` }, currentStep > 1 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 1 ? "text-white/50 line-through" : "text-white" }, "Deploy IoT Rover")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? "bg-yellow-500 border-yellow-400" : "border-white/30"}` }, currentStep > 2 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 2 ? "text-white/50 line-through" : "text-white" }, "Clean Marine Waste")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? "bg-pink-500 border-pink-400" : "border-white/30"}` }, currentStep > 3 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 3 ? "text-white/50 line-through" : "text-white" }, "Plant Bio-Corals")))
  ), /* @__PURE__ */ React.createElement(DPadOverlay, { setMovement: handleSetMovement }), currentStep < 4 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      onClick: handleCelebesAction,
      className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? "text-cyan border-cyan/30" : currentStep === 2 ? "text-yellow-400 border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.4)]" : "text-pink-400 border-pink-400/30 shadow-[0_0_20px_rgba(244,114,182,0.4)]"}`,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, currentStep === 1 ? "\u{1F680}" : currentStep === 2 ? "\u{1F9F9}" : "\u{1FAB8}"),
    /* @__PURE__ */ React.createElement("span", null, currentStep === 1 ? "Deploy IoT Rover" : currentStep === 2 ? "Clean Marine Waste" : "Plant Bio-Corals")
  ))), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, phase === 10 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-cyan px-6 py-2 rounded-full pointer-events-none",
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm tracking-widest uppercase text-cyan" }, "Level 5: Nusa (The Thirsty Lands)")
  ), /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none",
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Leaf, { className: "text-green-500 w-6 h-6", fill: "#bbf7d0" })), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm" }, "Smart Agriculture", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-cyan text-xs" }, "System"))),
    /* @__PURE__ */ React.createElement("ul", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? "bg-cyan-500 border-cyan-400" : "border-white/30"}` }, currentStep > 1 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 1 ? "text-white/50 line-through" : "text-white" }, "Scan Dry Soil")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? "bg-blue-500 border-blue-400" : "border-white/30"}` }, currentStep > 2 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 2 ? "text-white/50 line-through" : "text-white" }, "Connect AI Pipes")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? "bg-green-500 border-green-400" : "border-white/30"}` }, currentStep > 3 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 3 ? "text-white/50 line-through" : "text-white" }, "Distribute Water")))
  ), /* @__PURE__ */ React.createElement(DPadOverlay, { setMovement: handleSetMovement }), currentStep < 4 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      onClick: handleNusaAction,
      className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? "text-cyan border-cyan/30" : currentStep === 2 ? "text-blue-400 border-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.4)]" : "text-green-400 border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.4)]"}`,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, currentStep === 1 ? "\u{1F50D}" : currentStep === 2 ? "\u{1F527}" : "\u{1F4A7}"),
    /* @__PURE__ */ React.createElement("span", null, currentStep === 1 ? "Scan Soil" : currentStep === 2 ? "Connect Pipes" : "Distribute Water")
  ))), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, phase === 12 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-cyan px-6 py-2 rounded-full pointer-events-none",
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm tracking-widest uppercase text-cyan" }, "Level 6: Papua (The Morning Star)")
  ), /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.div,
    {
      className: "fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 z-50 glass-cyan p-3 md:p-5 rounded-2xl w-[85%] md:w-80 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none",
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 border-b border-cyan/20 pb-4 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Zap, { className: "text-yellow-500 w-6 h-6", fill: "#fef08a" })), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-white uppercase tracking-widest shadow-cyan text-shadow-sm" }, "Renewable Microgrid", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-cyan text-xs" }, "System"))),
    /* @__PURE__ */ React.createElement("ul", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 1 ? "bg-cyan-500 border-cyan-400" : "border-white/30"}` }, currentStep > 1 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 1 ? "text-white/50 line-through" : "text-white" }, "Build Smart Grid")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 2 ? "bg-yellow-500 border-yellow-400" : "border-white/30"}` }, currentStep > 2 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 2 ? "text-white/50 line-through" : "text-white" }, "Align Solar Panels")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center space-x-3 text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded flex items-center justify-center border ${currentStep > 3 ? "bg-green-500 border-green-400" : "border-white/30"}` }, currentStep > 3 && /* @__PURE__ */ React.createElement(import_lucide_react2.CheckCircle, { className: "w-3 h-3 text-white" })), /* @__PURE__ */ React.createElement("span", { className: currentStep > 3 ? "text-white/50 line-through" : "text-white" }, "Power Up Village")))
  ), /* @__PURE__ */ React.createElement(DPadOverlay, { setMovement: handleSetMovement }), currentStep < 4 && /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      onClick: handlePapuaAction,
      className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto glass px-4 py-2 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan/20 active:scale-95 transition-all font-bold tracking-widest text-xs md:text-sm uppercase flex items-center space-x-2 w-[90%] md:w-auto justify-center whitespace-nowrap ${currentStep === 1 ? "text-cyan border-cyan/30" : currentStep === 2 ? "text-yellow-400 border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.4)]" : "text-green-400 border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.4)]"}`,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, currentStep === 1 ? "\u{1F3D7}\uFE0F" : currentStep === 2 ? "\u2600\uFE0F" : "\u26A1"),
    /* @__PURE__ */ React.createElement("span", null, currentStep === 1 ? "Build Grid" : currentStep === 2 ? "Align Panels" : "Power Up")
  ))), (phase === 2 || phase === 4 || phase === 6 || phase === 8 || phase === 10 || phase === 12) && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    import_framer_motion4.motion.button,
    {
      style: { position: "fixed", bottom: "32px", left: "32px", right: "auto", zIndex: 9999 },
      className: "pointer-events-auto p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-cyan/20 transition-colors text-cyan",
      onClick: toggleFullscreen
    },
    isFullscreen ? /* @__PURE__ */ React.createElement(import_lucide_react2.Minimize, { size: 28 }) : /* @__PURE__ */ React.createElement(import_lucide_react2.Maximize, { size: 28 })
  ), /* @__PURE__ */ React.createElement(import_framer_motion4.AnimatePresence, null, showDialogue && /* @__PURE__ */ React.createElement("div", { className: "fixed top-24 right-4 md:top-28 md:right-8 z-50 w-64 md:w-80 lg:w-96 pointer-events-none" }, /* @__PURE__ */ React.createElement("div", { className: "glass-cyan p-4 rounded-xl w-full animate-unroll shadow-[0_0_20px_rgba(0,240,255,0.3)]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start space-x-3 opacity-0", style: { animation: "fadeIn 0.5s ease forwards" } }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-full bg-cyan/20 flex-shrink-0 flex items-center justify-center border border-cyan/50" }, /* @__PURE__ */ React.createElement(import_lucide_react2.Sparkles, { className: "text-cyan w-4 h-4" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-cyan uppercase tracking-widest mb-1" }, "EvIEEE"), /* @__PURE__ */ React.createElement("p", { className: "text-sm leading-relaxed" }, dialogue))))))), /* @__PURE__ */ React.createElement("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
      ` } }));
}
var LevelApp_default = LevelApp;
