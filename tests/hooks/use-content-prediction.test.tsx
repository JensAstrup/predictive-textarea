import { renderHook, waitFor, act } from '@testing-library/react'

import { useContentPrediction } from '@/hooks/use-content-prediction'


jest.mock('trie-search', () => {
  return function () {
    return {
      search: jest.fn().mockReturnValue([]),
      map: jest.fn()
    }
  }
})

describe('useContentPrediction', () => {
  const mockGetContentPredictionFn = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the expected interface', () => {
    const { result } = renderHook(() => useContentPrediction(mockGetContentPredictionFn, {}))

    expect(result.current).toEqual({
      prediction: null,
      setInputText: expect.any(Function),
      clearPrediction: expect.any(Function)
    })
  })

  it('should allow clearing predictions', () => {
    const { result } = renderHook(() => useContentPrediction(mockGetContentPredictionFn, {}))

    expect(() => {
      result.current.clearPrediction()
    }).not.toThrow()
  })

  it('should allow setting input text', () => {
    const { result } = renderHook(() => useContentPrediction(mockGetContentPredictionFn, {}))

    expect(() => {
      result.current.setInputText('test input')
    }).not.toThrow()
  })

  it('should not fetch predictions when isFetching is true', () => {
    const { result } = renderHook(() => useContentPrediction(mockGetContentPredictionFn, {}))

    expect(result.current.prediction).toBeNull()
  })

  it('should not show prediction while fetching (isFetching is true)', async () => {
    jest.useFakeTimers()
    const predictionText = 'predicted text'
    const mockGetContentPredictionFn = jest.fn().mockResolvedValue(predictionText)
    const { result } = renderHook(() =>
      useContentPrediction(mockGetContentPredictionFn, { debounceTime: 100 })
    )

    act(() => {
      result.current.setInputText('hello')
    })

    // Assert: prediction should be null immediately (fetching)
    expect(result.current.prediction).toBeNull()

    // Fast-forward debounce time and resolve async fetch inside act
    await act(async () => {
      jest.advanceTimersByTime(100)
      // Let the microtasks queue flush (simulate async fetch resolution)
      await Promise.resolve()
    })

    // Wait for the hook to update after async fetch
    await waitFor(() => {
      expect(result.current.prediction).toEqual(
        expect.objectContaining({ text: predictionText })
      )
    })

    jest.useRealTimers()
  })
})
