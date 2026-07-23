import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The dev server (npm run dev) finds admin.html automatically at
// /admin.html with no config. Production builds (npm run build) don't —
// Rollup needs every HTML entry point listed explicitly, or it only
// builds index.html and admin.html gets silently dropped from /dist.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
