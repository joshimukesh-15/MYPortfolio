import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // Target modern browsers for smaller, faster output
    target: 'es2020',
    // Raise warning threshold — GSAP is intentionally large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Vite 8 (rolldown) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Vite 8 uses OXC (oxc-minifier) by default — do not specify 'esbuild'
    // minify: 'oxc' is the default and fastest option in Vite 8
    sourcemap: false,
  },
});
