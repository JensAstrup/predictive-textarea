'use client'

import React, { useState, createContext, useContext } from 'react'
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '../../utils/cn'

interface TabsContextValue {
  selectedValue: string
  onSelect: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

interface TabProps {
  children: React.ReactNode
  value: string
  className?: string
}

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

function Tabs({ defaultValue, children, className }: TabsProps): React.ReactElement {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ selectedValue: value, onSelect: setValue }}>
      <div className={cn('w-full', className)} data-value={value}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }: TabsListProps): React.ReactElement {
  return (
    <div className={cn('flex border-b border-border', className)}>
      {children}
    </div>
  )
}

function Tab({ children, value, className }: TabProps): React.ReactElement {
  const { selectedValue, onSelect } = useTabsContext()

  return (
    <button
      value={value}
      data-state={selectedValue === value ? 'active' : 'inactive'}
      onClick={() => onSelect(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground',
        className
      )}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children, className }: TabsContentProps): React.ReactElement | null {
  const { selectedValue } = useTabsContext()

  if (selectedValue !== value) return null

  return (
    <div
      data-state={selectedValue === value ? 'active' : 'inactive'}
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, Tab, TabsContent } 
