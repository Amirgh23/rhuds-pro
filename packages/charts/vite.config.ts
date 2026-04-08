import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'RHUDSCharts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@rhuds/core', '@rhuds/hooks'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@rhuds/core': 'RHUDSCore',
          '@rhuds/hooks': 'RHUDSHooks',
        },
      },
    },
  },
});
