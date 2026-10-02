import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  define: {
    // dragula's dependencies reference Node's `global`
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        bundle: resolve(import.meta.dirname, 'ts/main.ts'),
        help: resolve(import.meta.dirname, 'ts/help.ts'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].iife.js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'ts'),
    },
  },
});
