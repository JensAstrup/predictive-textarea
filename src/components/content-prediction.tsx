import React from 'react'

import { cn } from '@/utils/cn'


interface ContentPredictionProps {
  text: string
  predictionId: string
  style?: React.CSSProperties
  className?: string
}

export const predictionIdAttribute = 'data-predictionid'

function ContentPrediction({ text, predictionId, style, className }: ContentPredictionProps): React.ReactElement {
  const propFromVariable = { [predictionIdAttribute]: predictionId }
  return (
    <span
      className={cn(
        'text-muted-foreground isolate whitespace-normal break-words inline',
        className
      )}
      suppressContentEditableWarning={true}
      contentEditable="false"
      dir="ltr"
      style={style}
      role="option"
      aria-selected="false"
      aria-label={`Suggestion: ${text.trim()}`}
      id={predictionId}
      {...propFromVariable}
    >
      {text}
    </span>
  )
}

export { ContentPrediction }
