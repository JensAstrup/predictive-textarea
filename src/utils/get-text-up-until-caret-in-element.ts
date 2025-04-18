/**
 * Get the text content up until the caret position in a contenteditable element.
 *
 * @param element - The contenteditable element to get text from
 * @returns The text content up until the caret position
 */
export function getTextUpUntilCaretInElement(element: HTMLElement): string {
  const selection = window.getSelection()
  if (!selection || !selection.isCollapsed) return ''

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  return preCaretRange.toString()
}
