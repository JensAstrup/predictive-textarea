import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'predictive-textarea': path.resolve(__dirname, '../predictive-textarea/src')
    },
  },
  server: {
    port: 5173,
    hmr: true
  },
  optimizeDeps: {
    include: ['predictive-textarea'],
  },
}) 
