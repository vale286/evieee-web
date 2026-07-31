import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        level1: resolve(__dirname, 'level-1.html'),
        level2: resolve(__dirname, 'level-2.html'),
        level3: resolve(__dirname, 'level-3.html'),
        level4: resolve(__dirname, 'level-4.html'),
        level5: resolve(__dirname, 'level-5.html'),
        level6: resolve(__dirname, 'level-6.html'),
      }
    }
  }
});
