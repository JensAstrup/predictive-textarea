import { isCaretAtLineEnd } from '@/utils/is-caret-at-line-end'

import { getTextUpUntilCaretInElement } from '@/utils/get-text-up-until-caret-in-element'


describe('Autocomplete Utils', () => {
  describe('getTextUptilCaretInElement', () => {
    let mockElement: HTMLElement
    let mockSelection: Selection
    let mockRange: Range

    beforeEach(() => {
      mockElement = document.createElement('div')
      mockRange = {
        cloneRange: jest.fn().mockReturnThis(),
        selectNodeContents: jest.fn(),
        setEnd: jest.fn(),
        toString: jest.fn().mockReturnValue('text before caret'),
        endContainer: document.createTextNode(''),
        endOffset: 0
      } as unknown as Range

      mockSelection = {
        isCollapsed: true,
        getRangeAt: jest.fn().mockReturnValue(mockRange)
      } as unknown as Selection

      jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return empty string if no selection', () => {
      jest.spyOn(window, 'getSelection').mockReturnValue(null)
      expect(getTextUpUntilCaretInElement(mockElement)).toBe('')
    })

    it('should return empty string if selection is not collapsed', () => {
      mockSelection.isCollapsed = false
      expect(getTextUpUntilCaretInElement(mockElement)).toBe('')
    })

    it('should return text before caret', () => {
      expect(getTextUpUntilCaretInElement(mockElement)).toBe('text before caret')
      expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockElement)
    })
  })

  describe('isCaretAtLineEnd', () => {
    let mockSelection: Selection

    beforeEach(() => {
      mockSelection = {
        focusNode: {
          textContent: 'line of text',
          nextSibling: null
        },
        focusOffset: 0
      } as unknown as Selection
    })

    it('should return false if not at end of line', () => {
      mockSelection.focusOffset = 5
      expect(isCaretAtLineEnd(mockSelection)).toBe(false)
    })

    it('should return true if at end of line with no next line', () => {
      const mockFocusNode = {
        textContent: 'line of text',
        nextSibling: null
      }
      mockSelection = {
        focusNode: mockFocusNode,
        focusOffset: mockFocusNode.textContent.length
      } as unknown as Selection

      expect(isCaretAtLineEnd(mockSelection)).toBe(true)
    })

    it('should return false if at end of line but next line has content', () => {
      const mockFocusNode = {
        textContent: 'line of text',
        nextSibling: {
          textContent: 'next line'
        }
      }
      mockSelection = {
        focusNode: mockFocusNode,
        focusOffset: mockFocusNode.textContent.length
      } as unknown as Selection

      expect(isCaretAtLineEnd(mockSelection)).toBe(false)
    })

    it('should return true if at end of line and next line is empty', () => {
      const mockFocusNode = {
        textContent: 'line of text',
        nextSibling: {
          textContent: '   '
        }
      }
      mockSelection = {
        focusNode: mockFocusNode,
        focusOffset: mockFocusNode.textContent.length
      } as unknown as Selection

      expect(isCaretAtLineEnd(mockSelection)).toBe(true)
    })

    it('should handle null focusNode', () => {
      mockSelection = {
        focusNode: null,
        focusOffset: 0
      } as unknown as Selection

      expect(isCaretAtLineEnd(mockSelection)).toBe(false)
    })
  })
})
