// vite.config.tauri.ts
// ─────────────────────────────────────────────────────────────────────────────
// This config is used ONLY for the Tauri desktop build.
// Key difference: base is './' so assets load from local file paths,
// not from the '/Land-Convertor/' GitHub Pages sub-path.
//
// Build command: npm run tauri:build
// GitHub Pages build still uses: vite.config.ts  (npm run build)
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',   // ← local file paths for Tauri WebView
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    // Note: vite-plugin-pwa is intentionally excluded here.
    // Tauri handles offline/install functionality natively —
    // service workers are not needed in a desktop context.
  ],
  build: {
    outDir: 'dist',       // Tauri expects dist/ by default
    emptyOutDir: true,
  },
});
