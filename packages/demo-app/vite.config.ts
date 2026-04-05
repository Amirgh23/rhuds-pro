import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            if (req.url && !req.url.includes('.') && req.method === 'GET') {
              req.url = '/index.html';
            }
            next();
          });
        };
      },
    },
  ],
  resolve: {
    alias: {
      '@rhuds/core': resolve(__dirname, '../core/src'),
      '@rhuds/components': resolve(__dirname, '../components/src'),
      '@rhuds/hooks': resolve(__dirname, '../hooks/src'),
      '@rhuds/sfx': resolve(__dirname, '../sfx/src'),
      '@rhuds/backgrounds': resolve(__dirname, '../backgrounds/src'),
      '@rhuds/frames': resolve(__dirname, '../frames/src'),
      '@rhuds/webgl': resolve(__dirname, '../webgl/src'),
    },
  },
  server: {
    port: 3001,
    strictPort: false,
    host: '0.0.0.0',
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
