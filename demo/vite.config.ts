import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/predictive-textarea/',
  plugins: [react()],
  resolve: {
    alias: {
      '@aces': path.resolve(__dirname, '../src')
    }
  }
}) 
