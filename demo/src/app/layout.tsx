import '../index.css'
import '../textarea-styles.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 
