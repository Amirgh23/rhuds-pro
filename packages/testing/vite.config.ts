import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RHUDSTesting',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@testing-library/react', '@testing-library/jest-dom', 'fast-check', 'vitest'],
    },
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
