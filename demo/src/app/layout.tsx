import '../index.css'
import '../textarea-styles.css'
import { ThemeProvider } from '../components/theme-provider'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'PredictiveTextarea Demo',
  description: 'A rich text input with AI-powered autocomplete content predictions for React',
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
        <Analytics />
      </body>
    </html>
  )
} 
