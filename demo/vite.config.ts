import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/predictive-textarea/',
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: 'react'
  })],
  resolve: {
    alias: {
      '@': '/src',
      'predictive-textarea': '../dist/index.es.js'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'predictive-textarea']
  },
  build: {
    commonjsOptions: {
      include: [/predictive-textarea/, /node_modules/]
    }
  }
}) 
