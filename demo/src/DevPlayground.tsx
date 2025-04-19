import React, { useState } from 'react'
import { PredictiveTextarea } from 'predictive-textarea'
import './textarea-styles.css'
import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'

function DevPlayground(): React.ReactElement {
  const [predictionDelay, setPredictionDelay] = useState(500)
  const [debounceTime, setDebounceTime] = useState(300)
  const [predictionStyle, setPredictionStyle] = useState('default')
  const [initialValue, setInitialValue] = useState('')
  const [placeholder, setPlaceholder] = useState('Start typing to see predictions...')
  const [rows, setRows] = useState(1)
  const [disabled, setDisabled] = useState(false)

  const mockPrediction = async (text: string) => {
    await new Promise(resolve => setTimeout(resolve, predictionDelay))
    return ` Suggested completion for: ${text}`
  }

  const getPredictionClassName = () => {
    switch (predictionStyle) {
      case 'indigo':
        return 'prediction-indigo'
      case 'subtle':
        return 'prediction-subtle'
      case 'fancy':
        return 'prediction-fancy'
      default:
        return ''
    }
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="predictive-textarea-theme">
      <div className="p-6 max-w-4xl mx-auto bg-background text-foreground">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Development Playground</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Prediction Delay (ms)
              </label>
              <input
                type="number"
                value={predictionDelay}
                onChange={(e) => setPredictionDelay(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Debounce Time (ms)
              </label>
              <input
                type="number"
                value={debounceTime}
                onChange={(e) => setDebounceTime(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Prediction Style
              </label>
              <select
                value={predictionStyle}
                onChange={(e) => setPredictionStyle(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="default">Default</option>
                <option value="indigo">Indigo</option>
                <option value="subtle">Subtle</option>
                <option value="fancy">Fancy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Initial Value
              </label>
              <input
                type="text"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter initial text..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Placeholder
              </label>
              <input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter placeholder text..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Rows
              </label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="disabled"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="disabled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Disabled
              </label>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <PredictiveTextarea
              getContentPredictionFn={mockPrediction}
              debounceTime={debounceTime}
              placeholder={placeholder}
              value={initialValue}
              rows={rows}
              disabled={disabled}
              predictionClassName={getPredictionClassName()}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export { DevPlayground } 
