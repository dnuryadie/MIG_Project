import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@workspace/supplier-catalog': path.resolve(__dirname, 'src/supplier-catalog'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
