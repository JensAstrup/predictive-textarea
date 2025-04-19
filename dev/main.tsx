import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

import { PredictiveTextarea } from '../src'


function DevPlayground(): React.ReactElement {
  const [predictionDelay, setPredictionDelay] = useState(500)
  const [debounceTime, setDebounceTime] = useState(300)
  const [predictionStyle, setPredictionStyle] = useState('default')
  const [initialValue, setInitialValue] = useState('')
  const [placeholder, setPlaceholder] = useState('Start typing to see predictions...')
  const [rows, setRows] = useState(1)
  const [disabled, setDisabled] = useState(false)

  // Mock prediction function for development
  const mockPrediction = async (text: string) => {
    await new Promise(resolve => setTimeout(resolve, predictionDelay))
    return ` Suggested completion for: ${text}`
  }

  // Get the prediction class name based on selected style
  function getPredictionClassName() {
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
    <div>
      <h1>Development Playground</h1>

      <div className="grid">
        <div className="card space-y-4">
          <div className="form-group">
            <label>Prediction Delay (ms)</label>
            <input
              type="number"
              value={predictionDelay}
              onChange={(e) => {
                setPredictionDelay(Number(e.target.value))
              }}
            />
          </div>

          <div className="form-group">
            <label>Debounce Time (ms)</label>
            <input
              type="number"
              value={debounceTime}
              onChange={(e) => {
                setDebounceTime(Number(e.target.value))
              }}
            />
          </div>

          <div className="form-group">
            <label>Prediction Style</label>
            <select
              value={predictionStyle}
              onChange={(e) => {
                setPredictionStyle(e.target.value)
              }}
            >
              <option value="default">Default</option>
              <option value="indigo">Indigo</option>
              <option value="subtle">Subtle</option>
              <option value="fancy">Fancy</option>
            </select>
          </div>

          <div className="form-group">
            <label>Initial Value</label>
            <input
              type="text"
              value={initialValue}
              onChange={(e) => {
                setInitialValue(e.target.value)
              }}
              placeholder="Enter initial text..."
            />
          </div>

          <div className="form-group">
            <label>Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => {
                setPlaceholder(e.target.value)
              }}
              placeholder="Enter placeholder text..."
            />
          </div>

          <div className="form-group">
            <label>Rows</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => {
                setRows(Number(e.target.value))
              }}
              min="1"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="disabled"
              checked={disabled}
              onChange={(e) => {
                setDisabled(e.target.checked)
              }}
            />
            <label htmlFor="disabled">Disabled</label>
          </div>
        </div>

        <div className="card">
          <PredictiveTextarea
            getContentPredictionFn={mockPrediction}
            debounceTime={debounceTime}
            placeholder={placeholder}
            value={initialValue}
            rows={rows}
            disabled={disabled}
            predictionClassName={getPredictionClassName()}
            className="custom-textarea"
          />
        </div>
      </div>
    </div>
  )
}

// Render the playground
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevPlayground />
  </React.StrictMode>
)
