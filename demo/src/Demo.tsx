'use client'

import React from 'react'
import { PredictiveTextarea } from 'predictive-textarea'
import './textarea-styles.css'
import { ComponentShowcase } from './components/ui/component-showcase'
import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'
import { predictInput } from './app/actions/predict-input'


function Demo(): React.ReactElement {
  const mockPrediction = async (text: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return just the text string as required by the type
    return ` Suggested completion for: ${text}`
  }

  // Code examples for each showcase
  const defaultCode = `
  
import { PredictiveTextarea } from 'predictive-textarea'

async function fetchPrediction(text: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3001/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch prediction')
    }

    const data = await response.json()
    return data.prediction
  } catch (error) {
    console.error('Error fetching prediction:', error)
    return ''
  }
}

function Example() {
  return (
    <PredictiveTextarea
      getContentPredictionFn={fetchPrediction}
      debounceTime={300}
      placeholder="Start typing to see predictions..."
    />
  )
}`

  const disabledCode = `import { PredictiveTextarea } from 'predictive-textarea'

function Example() {
  const getContentPrediction = async (text: string) => {
    // Your implementation to get AI predictions
    return \`Suggested completion for: \${text}\`
  }

  return (
    <PredictiveTextarea
      placeholder="This textarea is disabled"
      getContentPredictionFn={getContentPrediction}
      rows={2}
      disabled
    />
  )
}`

  const prefilledCode = `import { PredictiveTextarea } from 'predictive-textarea'

function Example() {
  const getContentPrediction = async (text: string) => {
    // Your implementation to get AI predictions
    return \`Suggested completion for: \${text}\`
  }

  return (
    <PredictiveTextarea
      placeholder="Start typing..."
      getContentPredictionFn={getContentPrediction}
      rows={3}
      value="This is some initial text"
    />
  )
}`

  const indigoStyleCode = `import { PredictiveTextarea } from 'predictive-textarea'

function Example() {
  const getContentPrediction = async (text: string) => {
    // Your implementation to get AI predictions
    return \`Suggested completion for: \${text}\`
  }

  return (
    <PredictiveTextarea
      getContentPredictionFn={getContentPrediction}
      debounceTime={300}
      placeholder="Start typing to see indigo predictions..."
      predictionClassName="prediction-indigo"
    />
  )
}

// Add these styles to your CSS
\`\`\`css
.prediction-indigo {
  color: rgb(99 102 241); /* indigo-500 */
  opacity: 0.8;
}
\`\`\``

  const subtleStyleCode = `import { PredictiveTextarea } from 'predictive-textarea'

function Example() {
  const getContentPrediction = async (text: string) => {
    // Your implementation to get AI predictions
    return \`Suggested completion for: \${text}\`
  }

  return (
    <PredictiveTextarea
      getContentPredictionFn={getContentPrediction}
      debounceTime={300}
      placeholder="Start typing to see subtle predictions..."
      predictionClassName="prediction-subtle"
    />
  )
}

// Add these styles to your CSS
\`\`\`css
.prediction-subtle {
  color: rgba(156, 163, 175, 0.7); /* gray-400 with opacity */
  font-style: italic;
}
\`\`\``

  const fancyStyleCode = `import { PredictiveTextarea } from 'predictive-textarea'

function Example() {
  const getContentPrediction = async (text: string) => {
    // Your implementation to get AI predictions
    return \`Suggested completion for: \${text}\`
  }

  return (
    <PredictiveTextarea
      getContentPredictionFn={getContentPrediction}
      debounceTime={300}
      placeholder="Start typing to see fancy predictions..."
      predictionClassName="prediction-fancy"
    />
  )
}

// Add these styles to your CSS
\`\`\`css
.prediction-fancy {
  background: linear-gradient(to right, #3182ce, #805ad5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.8;
}
\`\`\``

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">PredictiveTextarea</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="px-4 py-2 text-sm text-muted-foreground">
              <a href="https://github.com/JensAstrup/predictive-textarea" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="max-w-3xl mx-auto space-y-12 min-h-[200px] h-full">
          {/* Installation Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Installation</h2>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm">
              <code>npm install predictive-textarea</code>
            </div>
          </section>

          {/* Default Example */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Usage</h2>
            <p className="text-muted-foreground">
              A rich textarea component with AI-powered content prediction. Press <kbd className="px-2 py-1 text-xs rounded bg-secondary">Tab</kbd> to accept suggestions.
            </p>
            <ComponentShowcase
              title="Default"
              description="Uses the default prediction styling (text-muted-foreground) with OpenAI integration"
              preview={
                <PredictiveTextarea
                  getContentPredictionFn={predictInput}
                  debounceTime={500}
                  placeholder="Start typing to see predictions..."
                  className="custom-textarea"
                  disabled={false}
                  predictionClassName="text-muted-foreground"
                />
              }
              code={defaultCode}
              variant="default"
            />
          </section>

          {/* Disabled Example */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Variants</h2>
            <ComponentShowcase
              title="Disabled"
              description="Disabled textarea doesn't allow content input or show predictions"
              preview={
                <PredictiveTextarea
                  placeholder="This textarea is disabled"
                  getContentPredictionFn={mockPrediction}
                  debounceTime={300}
                  rows={2}
                  disabled
                  className="custom-textarea"
                  predictionClassName="text-muted-foreground"
                />
              }
              code={disabledCode}
              variant="card"
            />

            {/* With Initial Value */}
            <ComponentShowcase
              title="Pre-filled"
              description="Textarea with initial value"
              preview={
                <PredictiveTextarea
                  getContentPredictionFn={mockPrediction}
                  debounceTime={300}
                  rows={3}
                  value="This is some initial text"
                  className="custom-textarea"
                  disabled={false}
                  predictionClassName="text-muted-foreground"
                />
              }
              code={prefilledCode}
              variant="card"
            />
          </section>

          {/* Custom Styling Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Custom Prediction Styling</h2>
            <p className="text-muted-foreground">
              Customize the appearance of prediction text with custom classes.
            </p>

            {/* Indigo Style */}
            <ComponentShowcase
              title="Indigo Style"
              description="Predictions with indigo color"
              preview={
                <PredictiveTextarea
                  getContentPredictionFn={mockPrediction}
                  debounceTime={300}
                  placeholder="Start typing to see indigo predictions..."
                  className="custom-textarea"
                  disabled={false}
                  predictionClassName="prediction-indigo"
                />
              }
              code={indigoStyleCode}
              variant="card"
            />

            {/* Subtle Style */}
            <ComponentShowcase
              title="Subtle Style"
              description="Predictions with subtle gray styling"
              preview={
                <PredictiveTextarea
                  getContentPredictionFn={mockPrediction}
                  debounceTime={300}
                  placeholder="Start typing to see subtle predictions..."
                  className="custom-textarea"
                  disabled={false}
                  predictionClassName="prediction-subtle"
                />
              }
              code={subtleStyleCode}
              variant="card"
            />

            {/* Fancy Style */}
            <ComponentShowcase
              title="Fancy Style"
              description="Predictions with gradient styling"
              preview={
                <PredictiveTextarea
                  getContentPredictionFn={mockPrediction}
                  debounceTime={300}
                  placeholder="Start typing to see fancy predictions..."
                  className="custom-textarea"
                  disabled={false}
                  predictionClassName="prediction-fancy"
                />
              }
              code={fancyStyleCode}
              variant="card"
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export { Demo }
