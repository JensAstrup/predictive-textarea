import { renderHook } from '@testing-library/react'

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
})
