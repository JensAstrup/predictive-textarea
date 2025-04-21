import type { Metadata } from 'next'
import { ThemeProvider } from '../components/theme-provider'
import '../styles/globals.css'
import '../styles/textarea-styles.css'

export const metadata: Metadata = {
  title: 'Predictive Textarea Dev',
  description: 'Development environment for Predictive Textarea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="predictive-textarea-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 
