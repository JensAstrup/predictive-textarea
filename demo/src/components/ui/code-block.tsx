import React from 'react'
import { cn } from '../../../../src/utils'
import { Highlight, themes } from 'prism-react-renderer'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
  showLineNumbers?: boolean
}

function CodeBlock({ 
  code, 
  language = 'tsx', 
  className,
  showLineNumbers = true
}: CodeBlockProps): React.ReactElement {
  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      <Highlight
        theme={themes.palenight}
        code={code}
        language={language as any}
      >
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn('overflow-x-auto p-4 text-sm', highlightClassName)}
            style={{
              ...style,
              overflowX: 'auto',
              padding: '1rem'
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {showLineNumbers && (
                  <span className="text-muted-foreground mr-4 inline-block w-5 text-right select-none opacity-50">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

export { CodeBlock } 
