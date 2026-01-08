
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // On définit uniquement la clé nécessaire pour le SDK Google GenAI
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // Fournit un objet global minimal pour éviter "process is not defined"
    'process.env': '{}'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react', 'recharts'],
        },
      },
    },
  },
});
