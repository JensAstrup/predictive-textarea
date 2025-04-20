import { renderHook } from '@testing-library/react'

import { useCaretPosition } from '@/hooks/use-caret-position'
import { getTextUpUntilCaretInElement } from '@/utils/get-text-up-until-caret-in-element'
import { isCaretAtLineEnd } from '@/utils/is-caret-at-line-end'


jest.mock('@/utils/get-text-up-until-caret-in-element', () => ({
  getTextUpUntilCaretInElement: jest.fn()
}))

jest.mock('@/utils/is-caret-at-line-end', () => ({
  isCaretAtLineEnd: jest.fn()
}))

describe('useCaretPosition', () => {
  const mockGetTextUpUntilCaretInElement = getTextUpUntilCaretInElement as jest.Mock
  const mockIsCaretAtLineEnd = isCaretAtLineEnd as jest.Mock
  const mockTextareaRef = { current: document.createElement('div') }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return empty string for getTextAtCaret when ref is null', () => {
    const { result } = renderHook(() => useCaretPosition({ textareaRef: { current: null } }))
    expect(result.current.getTextAtCaret()).toBe('')
  })

  it('should call getTextUpUntilCaretInElement for getTextAtCaret', () => {
    mockGetTextUpUntilCaretInElement.mockReturnValue('text at caret')

    const { result } = renderHook(() => useCaretPosition({ textareaRef: mockTextareaRef }))
    const text = result.current.getTextAtCaret()

    expect(mockGetTextUpUntilCaretInElement).toHaveBeenCalledWith(mockTextareaRef.current)
    expect(text).toBe('text at caret')
  })

  it('should return false for isAtLineEnd when no selection', () => {
    jest.spyOn(window, 'getSelection').mockReturnValue(null)

    const { result } = renderHook(() => useCaretPosition({ textareaRef: mockTextareaRef }))
    expect(result.current.isAtLineEnd()).toBe(false)
  })

  it('should call isCaretAtLineEnd for isAtLineEnd', () => {
    const mockSelection = {} as Selection
    jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection)
    mockIsCaretAtLineEnd.mockReturnValue(true)

    const { result } = renderHook(() => useCaretPosition({ textareaRef: mockTextareaRef }))
    const isAtEnd = result.current.isAtLineEnd()

    expect(mockIsCaretAtLineEnd).toHaveBeenCalledWith(mockSelection)
    expect(isAtEnd).toBe(true)
  })

  it('should not insert text when ref is null', () => {
    const { result } = renderHook(() => useCaretPosition({ textareaRef: { current: null } }))
    result.current.insertTextAtCaret('test')
    // No error should be thrown
  })

  it('should not insert text when no selection range', () => {
    const mockSelection = { rangeCount: 0 } as Selection
    jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

    const { result } = renderHook(() => useCaretPosition({ textareaRef: mockTextareaRef }))
    result.current.insertTextAtCaret('test')
    // No error should be thrown
  })

  it('should insert text at caret position', () => {
    const mockRange = {
      insertNode: jest.fn(),
      collapse: jest.fn()
    }

    const mockSelection = {
      rangeCount: 1,
      getRangeAt: jest.fn().mockReturnValue(mockRange)
    } as unknown as Selection

    jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection)
    jest.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

    const mockDispatchEvent = jest.fn()
    mockTextareaRef.current.dispatchEvent = mockDispatchEvent

    const { result } = renderHook(() => useCaretPosition({ textareaRef: mockTextareaRef }))
    result.current.insertTextAtCaret('test')

    expect(mockRange.insertNode).toHaveBeenCalled()
    expect(mockRange.collapse).toHaveBeenCalledWith(false)
    expect(mockDispatchEvent).toHaveBeenCalledWith(expect.any(Event))
  })
})
