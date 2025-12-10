import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 🔹 importante para Electron
  build: {
    outDir: "dist",      // donde se genera el frontend
    assetsDir: "assets", // carpeta de js/css/img
  },
});
