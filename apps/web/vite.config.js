import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@roomia/shared': path.resolve(__dirname, '../../packages/shared/index.js')
    }
  }
});
