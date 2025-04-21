import { defineConfig } from 'tsup'
import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives'

export default defineConfig({
  entry: [
    'src/index.ts', 
    'src/client.ts',
    'src/hooks/use-content-prediction.ts',
    'src/components/predictive-textarea.tsx',
    'src/openai/index.ts',
    'src/openai/predict-input-content.ts'
  ],
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  external: ['server-only'],
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use server'],
      include: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
    })
  ]
}) 
