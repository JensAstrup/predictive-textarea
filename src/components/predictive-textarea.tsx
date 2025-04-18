'use client'

import { useRef, SyntheticEvent, KeyboardEvent, FocusEvent, useState, CSSProperties, useEffect } from 'react'

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
  placeholder = '',
  value: initialValue = '',
  rows = 1,
  className,
  predictionClassName,
  ...props
}: PredictiveTextareaProps): React.ReactElement {
  const textareaRef = useRef<HTMLDivElement>(null)
  const [hasFocus, setHasFocus] = useState(false)
  const [value, setValue] = useState(initialValue)

  const showPlaceholder = !hasFocus && !value.trim()

  const { getTextAtCaret, isAtLineEnd, insertTextAtCaret } = useCaretPosition({ textareaRef })

  const { prediction, setInputText, clearPrediction } = useContentPrediction(getContentPredictionFn, { debounceTime })

  // Set initial value in the contentEditable div
  useEffect(() => {
    if (textareaRef.current && initialValue) {
      textareaRef.current.textContent = initialValue
    }
  }, [initialValue])

  function handleInput(event: SyntheticEvent<HTMLDivElement>): void {
    const target = event.target as HTMLDivElement
    const newContent = target.innerText || ''
    setValue(newContent)

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

    setValue(textareaRef.current.innerText || '')
    insertTextAtCaret(prediction.text)
    clearPrediction()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if ((event.key === 'Tab' || event.key === 'ArrowRight') && prediction) {
      event.preventDefault()
      acceptContentPrediction()
      return
    }

    if (event.key === 'Escape' && prediction) {
      event.preventDefault()
      clearPrediction()
      return
    }
  }

  function handleFocus(_event: FocusEvent<HTMLDivElement>): void {
    setHasFocus(true)
  }

  function handleBlur(_event: FocusEvent<HTMLDivElement>): void {
    setHasFocus(false)
    clearPrediction()

    if (!value) {
      setValue(initialValue)
    }
  }

  const mainClassName = `min-h-[${DEFAULT_LINE_HEIGHT_PX * rows}px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary`
  const placeholderClassName = showPlaceholder && 'before:content-[attr(data-placeholder)] before:text-muted-foreground before:absolute before:pointer-events-none before:select-none'
  const disabledClassName = disabled && 'opacity-50'

  const textareaClassName = cn(mainClassName, placeholderClassName, disabledClassName, className)
  const predictionId = prediction?.id || ''

  return (
    <>
      <div
        ref={textareaRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        spellCheck={true}
        role="textbox"
        className={textareaClassName}
        // Using tailwind to set the cursor doesn't work because we're not using a textarea
        style={disabled ? { cursor: 'not-allowed' } : undefined}

        aria-multiline="true"
        aria-disabled={disabled ? 'true' : 'false'}
        aria-placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={!!prediction}
        aria-activedescendant={prediction ? predictionId : undefined}
        aria-label={props['aria-label'] || 'Text input with predictive suggestions'}

        data-placeholder={placeholder}

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
        value={value}
      />
    </>
  )
}

export { PredictiveTextarea }
