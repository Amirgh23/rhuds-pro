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
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.tsx'),
        'service-worker': resolve(__dirname, 'src/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker') {
            return 'service-worker.js';
          }
          return '[name].[hash].js';
        },
        chunkFileNames: '[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg|webp|avif/.test(ext)) {
            return `images/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
      },
      manualChunks: {
        // Vendor chunks
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-rhuds': [
          '@rhuds/core',
          '@rhuds/components',
          '@rhuds/hooks',
          '@rhuds/backgrounds',
          '@rhuds/frames',
        ],
        'vendor-utils': ['gsap', 'framer-motion'],

        // Route chunks
        'route-showcase': ['./src/pages/ShowcasePage.tsx'],
        'route-playground': ['./src/pages/InteractivePlayground.tsx'],
        'route-docs': ['./src/pages/DocsPage.tsx'],
        'route-coldwar': ['./src/pages/ColdWarShowcase.tsx'],
        'route-charts': ['./src/pages/ChartsShowcase.tsx'],
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
