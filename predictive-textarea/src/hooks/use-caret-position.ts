import { RefObject, useCallback } from 'react'

import { isCaretAtLineEnd } from '../utils/is-caret-at-line-end'

import { getTextUpUntilCaretInElement } from '../utils/get-text-up-until-caret-in-element'


export interface UseCaretPositionOptions {
  textareaRef: RefObject<HTMLDivElement | null>
}

export interface UseCaretPositionResult {
  getTextAtCaret: () => string
  isAtLineEnd: () => boolean
  getCurrentSelection: () => Selection | null
  insertTextAtCaret: (text: string) => void
}

function useCaretPosition(options: UseCaretPositionOptions): UseCaretPositionResult {
  const { textareaRef } = options

  const getTextAtCaret = useCallback((): string => {
    if (!textareaRef.current) return ''
    return getTextUpUntilCaretInElement(textareaRef.current)
  }, [textareaRef])

  const getCurrentSelection = useCallback((): Selection | null => {
    return window.getSelection()
  }, [])

  const isAtLineEnd = useCallback((): boolean => {
    const selection = getCurrentSelection()
    if (!selection) return false
    return isCaretAtLineEnd(selection)
  }, [getCurrentSelection])

  const insertTextAtCaret = useCallback((text: string): void => {
    if (!textareaRef.current) return

    const selection = getCurrentSelection()
    if (!selection?.rangeCount) return

    const range = selection.getRangeAt(0)
    const textNode = document.createTextNode(text)
    range.insertNode(textNode)
    range.collapse(false)

    // Dispatch input event to trigger any listeners
    const simulatedEvent = new Event('input', { bubbles: true })
    textareaRef.current.dispatchEvent(simulatedEvent)
  }, [getCurrentSelection, textareaRef])

  return {
    getTextAtCaret,
    isAtLineEnd,
    getCurrentSelection,
    insertTextAtCaret
  }
}

export { useCaretPosition }
