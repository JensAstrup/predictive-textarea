import React from 'react'
import { PredictiveTextarea } from '@/components/predictive-textarea'
import './textarea-styles.css'
import { fetchPrediction } from './utils/api-client'

function Dev(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">PredictiveTextarea - Development</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="max-w-3xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Development Environment</h2>
            <p className="text-muted-foreground">
              Testing environment for the PredictiveTextarea component.
            </p>
            <PredictiveTextarea
              getContentPredictionFn={fetchPrediction}
              debounceTime={500}
              placeholder="Start typing to see predictions..."
              className="custom-textarea"
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export { Dev } 
