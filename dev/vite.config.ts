import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    hmr: true
  },
  resolve: {
    alias: {
      'predictive-textarea': resolve(__dirname, '../dist')
    }
  }
}) 
