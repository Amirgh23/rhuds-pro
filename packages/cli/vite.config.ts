import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['commander', 'inquirer', 'chalk', 'ora', 'fs-extra', 'path', 'fs'],
    },
    sourcemap: true,
  },
  test: {
    globals: true,
  },
});
