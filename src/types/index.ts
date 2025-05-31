/**
 * Represents the props for the PredictiveTextarea component.
 */
export interface PredictiveTextareaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onInput'> {
  /**
   * A function that retrieves content predictions based on user input.
   * Usually, this will be some sort of API call to a language model.
   */
  getContentPredictionFn: GetCompletionContentPredictionFn

  /**
   * The time to wait after the user stops typing before fetching a content prediction (in ms).
   */
  debounceTime?: number

  /**
   * Whether to disable autocomplete functionality.
   */
  disableAutocomplete?: boolean

  /**
   * Disable the textbox from being edited.
   */
  disabled?: boolean

  /**
   * The placeholder text for the textbox.
   */
  placeholder?: string

  /**
   * The CSS class name for the autocomplete textbox.
   */
  className?: string

  /**
   * The name of the textbox, used to identify the textbox input in form data.
   */
  name?: string

  /**
   * The initial content of the textbox.
   */
  value?: string

  /**
   * The minimum height of the textbox. Can be a Tailwind size class like 'h-15' or a specific value.
   * @default 1
   */
  rows?: number

  /**
   * Custom class name for the content prediction text.
   * Use this to style the prediction text with your own classes.
   */
  predictionClassName?: string

  /**
   * A function that is called on all input events.
   */
  onInput?: (event: { target: { value: string } }) => void
}

/**
 * A function that retrieves content predictions based on user input.
 */
export type GetCompletionContentPredictionFn = (text: string, abortSignal?: AbortSignal) => string | Promise<string>

export type CompletionPrediction = {
  id: string
  text: string
}
