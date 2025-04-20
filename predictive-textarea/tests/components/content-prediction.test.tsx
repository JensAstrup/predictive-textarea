import { render, screen } from '@testing-library/react'

import { ContentPrediction, predictionIdAttribute } from '../../package/src/components/content-prediction'


describe('ContentPrediction', () => {
  it('should render the prediction text', () => {
    const text = 'Test prediction'
    render(<ContentPrediction text={text} predictionId="test-id" />)

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('should apply the prediction ID as a data attribute', () => {
    const predictionId = 'test-id'
    render(<ContentPrediction text="Test" predictionId={predictionId} />)

    const element = screen.getByText('Test')
    expect(element).toHaveAttribute(predictionIdAttribute, predictionId)
  })

  it('should apply custom className when provided', () => {
    const customClass = 'custom-class'
    render(<ContentPrediction text="Test" predictionId="test-id" className={customClass} />)

    const element = screen.getByText('Test')
    expect(element).toHaveClass(customClass)
  })

  it('should apply custom style when provided', () => {
    const customStyle = { color: 'red' }
    render(<ContentPrediction text="Test" predictionId="test-id" style={customStyle} />)

    const element = screen.getByText('Test')
    expect(element).toHaveStyle({ color: 'red' })
  })

  it('should have correct ARIA attributes', () => {
    const text = 'Test prediction'
    render(<ContentPrediction text={text} predictionId="test-id" />)

    const element = screen.getByText(text)
    expect(element).toHaveAttribute('role', 'option')
    expect(element).toHaveAttribute('aria-selected', 'false')
    expect(element).toHaveAttribute('aria-label', `Suggestion: ${text.trim()}`)
  })

  it('should have correct contentEditable and dir attributes', () => {
    render(<ContentPrediction text="Test" predictionId="test-id" />)

    const element = screen.getByText('Test')
    expect(element).toHaveAttribute('contentEditable', 'false')
    expect(element).toHaveAttribute('dir', 'ltr')
  })
})
