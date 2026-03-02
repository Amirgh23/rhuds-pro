import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        panel: resolve(__dirname, 'src/panel.html'),
        devtools: resolve(__dirname, 'src/devtools.html'),
      },
    },
  },
});
