/**
 * Check if the caret is at the end of a line in a contenteditable element.
 *
 * @param selection - The current selection object
 * @returns True if the caret is at the end of a line, false otherwise
 */

export function isCaretAtLineEnd(selection: Selection): boolean {
  if (!selection.focusNode) return false

  const nodeContent = selection.focusNode.textContent || ''
  const isAtEndofLine = nodeContent.length === selection.focusOffset
  const nextLine = selection.focusNode.nextSibling?.textContent
  return isAtEndofLine && !nextLine?.trim()
}
