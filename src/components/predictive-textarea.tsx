import React, { useRef, SyntheticEvent, KeyboardEvent, FocusEvent, useState, useEffect, CSSProperties } from 'react'

import { useCaretPosition } from '@/hooks/use-caret-position'
import { useContentPrediction } from '@/hooks/use-content-prediction'
import { PredictiveTextareaProps } from '@/types'
import { cn } from '@/utils/cn'

import { ContentPrediction } from './content-prediction'

const DEFAULT_LINE_HEIGHT_PX = 30

// Screen reader only styles
const srOnlyStyles: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0
}

/**
 * A rich text input with AI-powered autocomplete content predictions.
 *
 * Uses contentEditable instead of a traditional textarea to enable
 * content prediction display inline with text.
 */
function PredictiveTextarea({
  getContentPredictionFn,
  debounceTime,
  disabled,
  disableAutocomplete = false,
  placeholder = '',
  value: controlledValue = '',
  rows = 1,
  className,
  predictionClassName,
  ...props
}: PredictiveTextareaProps): React.ReactElement {
  const textareaRef = useRef<HTMLDivElement>(null)
  const [hasFocus, setHasFocus] = useState(false)
  const [internalValue, setInternalValue] = useState(controlledValue)

  const { getTextAtCaret, isAtLineEnd, insertTextAtCaret } = useCaretPosition({ textareaRef })

  const { prediction, setInputText, clearPrediction } = useContentPrediction(getContentPredictionFn, { debounceTime })

  // Update internal value and textarea content when controlled value changes
  useEffect(() => {
    setInternalValue(controlledValue)
    if (textareaRef.current) {
      textareaRef.current.textContent = controlledValue
    }
  }, [controlledValue])

  function handleInput(event: SyntheticEvent<HTMLDivElement>): void {
    const target = event.target as HTMLDivElement
    const newContent = target.innerText || ''
    setInternalValue(newContent)

    if (isAtLineEnd()) {
      const currentText = getTextAtCaret()
      if (currentText) {
        setInputText(currentText)
      }
      else {
        clearPrediction()
      }
    }
    else {
      clearPrediction()
    }
  }

  function acceptContentPrediction(): void {
    if (!prediction?.text || !textareaRef.current) return

    setInternalValue(textareaRef.current.innerText || '')
    insertTextAtCaret(prediction.text)
    clearPrediction()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape' && prediction) {
      event.preventDefault()
      clearPrediction()
      return
    }

    if (disableAutocomplete) return

    if ((event.key === 'Tab' || event.key === 'ArrowRight') && prediction) {
      event.preventDefault()
      acceptContentPrediction()
      return
    }
  }

  function handleFocus(_event: FocusEvent<HTMLDivElement>): void {
    setHasFocus(true)
    if (textareaRef.current && !internalValue) {
      textareaRef.current.textContent = ''
    }
  }

  function handleBlur(_event: FocusEvent<HTMLDivElement>): void {
    setHasFocus(false)
    clearPrediction()
    if (textareaRef.current && !internalValue) {
      textareaRef.current.textContent = placeholder || ''
      textareaRef.current.style.color = 'var(--muted-foreground, #6b7280)'
    }
  }

  const mainClassName = `min-h-[${DEFAULT_LINE_HEIGHT_PX * rows}px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary relative`
  const disabledClassName = disabled && 'opacity-50'
  const placeholderClassName = placeholder && 'placeholder:text-muted-foreground'

  const textareaClassName = cn(mainClassName, disabledClassName, className)
  const predictionId = prediction?.id || ''

  // Set placeholder text when empty and not focused
  useEffect(() => {
    if (textareaRef.current) {
      if (!hasFocus && !internalValue.trim()) {
        textareaRef.current.innerText = placeholder || ''
        textareaRef.current.style.color = 'var(--muted-foreground, #6b7280)'
      } else if (!internalValue) {
        textareaRef.current.innerText = ''
        textareaRef.current.style.color = ''
      }
    }
  }, [placeholder, internalValue])

  return (
    <>
      <div className="relative">
        <div
          ref={textareaRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          spellCheck={true}
          role="textbox"
          className={textareaClassName}
          style={disabled ? { cursor: 'not-allowed' } : undefined}
          aria-multiline="true"
          aria-disabled={disabled ? 'true' : 'false'}
          aria-placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={!!prediction}
          aria-activedescendant={prediction ? predictionId : undefined}
          aria-label={props['aria-label'] || 'Text input with predictive suggestions'}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onSelect={clearPrediction}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {prediction && (
            <ContentPrediction
              text={prediction.text}
              predictionId={prediction.id}
              className={predictionClassName}
            />
          )}
        </div>
      </div>
      {prediction && (
        <div aria-live="polite" style={srOnlyStyles}>
          Suggestion available:
          {prediction.text.trim()}
          . Press Tab or Right Arrow to accept.
        </div>
      )}
      <input
        type="hidden"
        name={props.name}
        value={internalValue}
      />
    </>
  )
}

export { PredictiveTextarea }
