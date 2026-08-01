const fs = require('fs');
let code = fs.readFileSync('src/components/AFrameScene.jsx', 'utf8');
code = code.replace(/animation=\{([^}]+)\s\?\s"([^"]+)"\s:\s""\}/g, 'animation={$1 ? "$2" : undefined}');
fs.writeFileSync('src/components/AFrameScene.jsx', code);
