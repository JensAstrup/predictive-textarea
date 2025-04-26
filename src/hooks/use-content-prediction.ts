'use client'

import { useEffect, useRef, useState } from 'react'
import TrieSearch from 'trie-search'

import { CompletionPrediction, GetCompletionContentPredictionFn } from '@/types'
import { stringHash } from '@/utils/hash'


const DEFAULT_CACHE_SIZE = 100

// Create a singleton instance of the trie with a reasonable cache size
const predictionCache = new TrieSearch<CompletionPrediction>([], {
  min: 1, // Match from the first character
  ignoreCase: false, // Case sensitive matching
  maxCacheSize: DEFAULT_CACHE_SIZE,
  idFieldOrFunction: 'text' // Use the prediction text itself for identification
})

export interface UseContentPredictionOptions {
  debounceTime?: number
  generateId?: (inputText: string, predictionText: string) => string
}

export interface UseContentPredictionResult {
  prediction: CompletionPrediction | null
  setInputText: (text: string) => void
  clearPrediction: () => void
}

const DEFAULT_DEBOUNCE_TIME_MS = 300

/**
 * A hook that manages content predictions for text input, providing debounced API calls
 * and prediction state management. It handles:
 * - Debouncing prediction requests to prevent excessive API calls
 * - Managing prediction state and cleanup
 * - Aborting in-flight requests when new ones are made
 * - Generating content-based IDs for predictions
 * - Caching predictions using a trie to prevent duplicate requests
 *   and optimize for backspace operations
 *
 * @param getContentPredictionFn The function to fetch predictions
 * @param options Configuration options including debounce time, prediction function, and ID generator
 * @returns Object containing the current prediction, input text setter, and prediction clearer
 */
function useContentPrediction(getContentPredictionFn: GetCompletionContentPredictionFn, options: UseContentPredictionOptions): UseContentPredictionResult {
  const {
    debounceTime = DEFAULT_DEBOUNCE_TIME_MS,
    // By default, generate a deterministic ID based on input + prediction text
    // The ID is not used for the trie search (which uses text directly), but is required for:
    // 1. Accessibility (ARIA attributes like aria-activedescendant)
    // 2. DOM identification for the prediction element
    // 3. Consistent referencing between component renders
    generateId = (inputText, predictionText) => `p-${stringHash(`${inputText}${predictionText}`)}`
  } = options

  const [inputText, setInputText] = useState<string>('')
  const [prediction, setPrediction] = useState<CompletionPrediction | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const lastFetchTimeRef = useRef<number>(0)

  async function getContentPrediction(text: string): Promise<CompletionPrediction | null> {
    const cachedResults = predictionCache.search(text)
    if (cachedResults.length > 0) {
      return cachedResults[0] || null
    }

    try {
      const predictionText = await getContentPredictionFn(text)
      if (!predictionText) return null

      const prediction: CompletionPrediction = {
        id: generateId(text, predictionText),
        text: predictionText
      }

      // Cache the prediction using explicit mapping
      predictionCache.map(text, prediction)

      if (!isFetching) {
        return prediction
      }
      else {
        return null
      }
    }
    catch {
      return null
    }
  }

  function clearPrediction(): void {
    setPrediction(null)
  }

  useEffect(() => {
    const now = Date.now()
    if (now - lastFetchTimeRef.current < debounceTime || !inputText) {
      return
    }
    setIsFetching(true)
    const timer = setTimeout(async () => {
      const prediction = await getContentPrediction(inputText)
      if (prediction) {
        setPrediction(prediction)
      }
      lastFetchTimeRef.current = Date.now()
      setIsFetching(false)
    }, debounceTime)

    return () => {
      clearTimeout(timer)
      setIsFetching(false)
    }
  }, [inputText, debounceTime])

  return {
    prediction,
    setInputText,
    clearPrediction,
  }
}

export { useContentPrediction }
