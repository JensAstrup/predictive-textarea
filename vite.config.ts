import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    hmr: true
  },
  resolve: {
    alias: {
      'predictive-textarea': path.resolve(__dirname, '../predictive-textarea/dist/index.js')
    }
  },
  build: {
    commonjsOptions: {
      include: [/predictive-textarea/, /node_modules/]
    },
    sourcemap: true
  }
}) 
