'use client'

// Re-export client components with explicit 'use client' directive
export { PredictiveTextarea } from './components/predictive-textarea'
export { ContentPrediction } from './components/content-prediction'
export { useContentPrediction } from './hooks/use-content-prediction'

// Types
export type {
  GetCompletionContentPredictionFn,
  CompletionPrediction,
  PredictiveTextareaProps
} from './types'
