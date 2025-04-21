// Export client components from client.ts
export * from './client';

// Export the OpenAI functionality
export { predictInputContent } from './openai/predict-input-content';

// Default export
export { PredictiveTextarea as default } from './components/predictive-textarea'

// Main component
export { PredictiveTextarea } from './components/predictive-textarea'

// Additional exports for advanced usage
export { ContentPrediction } from './components/content-prediction'
export { useContentPrediction } from './hooks/use-content-prediction'

// Types
export type {
  GetCompletionContentPredictionFn,
  CompletionPrediction,
  PredictiveTextareaProps
} from './types'
