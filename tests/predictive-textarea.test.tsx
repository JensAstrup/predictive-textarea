import { render, screen, fireEvent, act } from '@testing-library/react'

import { PredictiveTextarea } from '@/components/predictive-textarea'
import { useCaretPosition } from '@/hooks/use-caret-position'
import { useContentPrediction } from '@/hooks/use-content-prediction'


jest.mock('@/hooks/use-content-prediction', () => ({
  useContentPrediction: jest.fn()
}))

jest.mock('@/hooks/use-caret-position', () => ({
  useCaretPosition: jest.fn()
}))

jest.mock('@/components/content-prediction', () => ({
  ContentPrediction: ({ text, predictionId }: { text: string, predictionId: string }) => (
    <span data-testid="content-prediction" data-predictionid={predictionId}>{text}</span>
  )
}))

describe('PredictiveTextarea', () => {
  const mockGetContentPredictionFn = jest.fn()
  const mockSetInputText = jest.fn()
  const mockClearPrediction = jest.fn()
  const mockGetTextAtCaret = jest.fn()
  const mockIsAtLineEnd = jest.fn()
  const mockInsertTextAtCaret = jest.fn()
  const mockUseContentPrediction = jest.mocked(useContentPrediction)

  beforeEach(() => {
    jest.clearAllMocks()

    const mockUseContentPrediction = useContentPrediction as jest.Mock
    mockUseContentPrediction.mockReturnValue({
      prediction: null,
      setInputText: mockSetInputText,
      clearPrediction: mockClearPrediction
    })

    const mockUseCaretPosition = useCaretPosition as jest.Mock
    mockUseCaretPosition.mockReturnValue({
      getTextAtCaret: mockGetTextAtCaret,
      isAtLineEnd: mockIsAtLineEnd,
      insertTextAtCaret: mockInsertTextAtCaret,
      getCurrentSelection: jest.fn()
    })
  })

  it('should render with default props', () => {
    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')
    expect(textareaElement).toBeInTheDocument()
  })

  it('should render with placeholder when provided', () => {
    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
        placeholder="Type something..."
      />
    )

    const textareaElement = screen.getByRole('textbox')
    expect(textareaElement).toHaveAttribute('data-placeholder', 'Type something...')
  })

  it('should render with initial value when provided', () => {
    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
        value="Initial text"
      />
    )

    const textareaElement = screen.getByRole('textbox')
    expect(textareaElement.textContent).toBe('Initial text')
  })

  it('should handle input changes', () => {
    mockIsAtLineEnd.mockReturnValue(false)

    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')

    act(() => {
      textareaElement.textContent = 'New text'
      fireEvent.input(textareaElement, { target: { innerText: 'New text' } })
    })

    expect(mockClearPrediction).toHaveBeenCalled()

    const hiddenInput = screen.getByDisplayValue('New text')
    expect(hiddenInput).toHaveValue('New text')
  })

  it('should request predictions when typing at line end', () => {
    mockIsAtLineEnd.mockReturnValue(true)
    mockGetTextAtCaret.mockReturnValue('text at caret')

    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')

    act(() => {
      textareaElement.textContent = 'Some text'
      fireEvent.input(textareaElement)
    })

    expect(mockSetInputText).toHaveBeenCalledWith('text at caret')
  })

  it('should display prediction when available and focused', () => {
    mockUseContentPrediction.mockReturnValue({
      prediction: { id: 'pred-123', text: ' predicted text' },
      setInputText: mockSetInputText,
      clearPrediction: mockClearPrediction
    })

    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')

    act(() => {
      fireEvent.focus(textareaElement)
    })

    const prediction = screen.getByTestId('content-prediction')
    expect(prediction).toBeInTheDocument()
    expect(prediction.textContent).toBe(' predicted text')
  })

  it('should accept prediction when Tab key is pressed', () => {
    const mockUseContentPrediction = useContentPrediction as jest.Mock
    mockUseContentPrediction.mockReturnValue({
      prediction: { id: 'pred-123', text: ' predicted text' },
      setInputText: mockSetInputText,
      clearPrediction: mockClearPrediction
    })

    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')

    act(() => {
      fireEvent.focus(textareaElement)
    })

    act(() => {
      fireEvent.keyDown(textareaElement, { key: 'Tab' })
    })

    expect(mockInsertTextAtCaret).toHaveBeenCalledWith(' predicted text')
    expect(mockClearPrediction).toHaveBeenCalled()
  })

  it('should clear prediction when Escape key is pressed', () => {
    const mockUseContentPrediction = useContentPrediction as jest.Mock
    mockUseContentPrediction.mockReturnValue({
      prediction: { id: 'pred-123', text: ' predicted text' },
      setInputText: mockSetInputText,
      clearPrediction: mockClearPrediction
    })

    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')

    act(() => {
      fireEvent.focus(textareaElement)
    })

    act(() => {
      fireEvent.keyDown(textareaElement, { key: 'Escape' })
    })

    expect(mockClearPrediction).toHaveBeenCalled()
  })

  it('should clear prediction on blur', () => {
    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
      />
    )

    const textareaElement = screen.getByRole('textbox')

    act(() => {
      fireEvent.focus(textareaElement)
      fireEvent.blur(textareaElement)
    })

    expect(mockClearPrediction).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(
      <PredictiveTextarea
        getContentPredictionFn={mockGetContentPredictionFn}
        disabled={true}
      />
    )

    const textareaElement = screen.getByRole('textbox')
    expect(textareaElement).toHaveAttribute('contentEditable', 'false')
  })
})
