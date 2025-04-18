const { build } = require('tsup')
const path = require('path')

build({
  entry: [path.resolve(__dirname, '../src/index.ts')],
  format: ['iife'],
  globalName: 'PredictiveTextarea',
  outDir: './dist',
  clean: true,
  minify: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.bundle = true
    options.platform = 'browser'
    options.jsx = 'automatic'
    options.jsxImportSource = 'react'
    options.inject = [path.resolve(__dirname, './react-import.js')]
    options.resolveExtensions = ['.tsx', '.ts', '.jsx', '.js', '.json']
    options.nodePaths = [path.resolve(__dirname, 'node_modules')]
    return options
  }
}).catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
}) 
