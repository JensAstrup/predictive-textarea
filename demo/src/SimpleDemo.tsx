import React from 'react'
import { PredictiveTextarea } from 'predictive-textarea'
import './textarea-styles.css'

function SimpleDemo(): React.ReactElement {
  // Simplified mock prediction function
  const mockPrediction = async (text: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return ` Suggested completion for: ${text}`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Test</h1>
      <div className="border rounded-lg p-4">
        <PredictiveTextarea
          getContentPredictionFn={mockPrediction}
          debounceTime={300}
          placeholder="Start typing to see predictions..."
          className="custom-textarea"
        />
      </div>
    </div>
  )
}

export { SimpleDemo } 
