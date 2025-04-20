import { act, renderHook } from '@testing-library/react'

import { useContentPrediction } from '../../package/src/hooks/use-content-prediction'

// Create a mock for the trie-search library
jest.mock('trie-search', () => {
  const mockSearch = jest.fn().mockReturnValue([])
  const mockMap = jest.fn()

  return function () {
    return {
      search: mockSearch,
      map: mockMap
    }
  }
})

describe('useContentPrediction', () => {
  const mockGetContentPredictionFn = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide a prediction and clear function', () => {
    const { result } = renderHook(() => useContentPrediction(mockGetContentPredictionFn, {}))

    expect(result.current.prediction).toBeNull()
    expect(typeof result.current.setInputText).toBe('function')
    expect(typeof result.current.clearPrediction).toBe('function')
  })

  it('should expose a clearPrediction function', () => {
    const { result } = renderHook(() => useContentPrediction(mockGetContentPredictionFn, {}))

    // Just verify the function exists
    expect(typeof result.current.clearPrediction).toBe('function')

    // Call it to ensure it doesn't throw
    act(() => {
      result.current.clearPrediction()
    })

    expect(result.current.prediction).toBeNull()
  })
})
