import React from 'react'
import { cn } from '../../utils/cn'
import { Tabs, TabsList, Tab, TabsContent } from './tabs'
import { CodeBlock } from './code-block'

interface ComponentShowcaseProps {
  title?: string
  description?: string
  preview: React.ReactNode
  code: string
  variant?: 'default' | 'card'
  className?: string
}

function ComponentShowcase({
  title,
  description,
  preview,
  code,
  variant = 'default',
  className
}: ComponentShowcaseProps): React.ReactElement {
  return (
    <div className={cn('space-y-4', className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <Tabs defaultValue="preview" className="w-full">
        <div className={cn(
          'flex justify-between items-center',
          variant === 'card' && 'border-b border-border px-4 py-3'
        )}>
          <TabsList className="border-b-0">
            <Tab value="preview">Preview</Tab>
            <Tab value="code">Code</Tab>
          </TabsList>

          {variant === 'card' && (
            <div className="text-xs text-muted-foreground rounded-full bg-secondary px-2 py-1">
              {title}
            </div>
          )}
        </div>

        <div className={cn(
          variant === 'card' && 'p-4',
          'rounded-b-lg'
        )}>
          <TabsContent value="preview" className={cn(
            'flex items-center justify-center p-6 min-h-[300px] h-full w-full',
            variant === 'card' ? 'border border-border rounded-md bg-card/25' : 'border border-border rounded-md'
          )}>
            <div className="w-full h-full">
              {preview}
            </div>
          </TabsContent>

          <TabsContent value="code">
            <CodeBlock code={code} language="tsx" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export { ComponentShowcase } 
