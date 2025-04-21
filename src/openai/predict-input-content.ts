'use server'

import 'openai/shims/node'
import OpenAI from 'openai'
import 'server-only'

const INSTRUCTIONS = `System prompt:
- You are an autocomplete system that predicts the most likely next input
- The input text is the preceding text in a comment form
- Predict the most likely next input (at most 8 new words OR the necessary suffix to finish the current word) based on the text provided.
- If the next input is more likely to be short, do not err on the side of longer predictions. ("In france they speak" -> " French.")
- Respond in json format. 
"type" should be one of "prediction" if you are predicting next input, or "error" if you are unable to predict input.
"content" should be at most 8 new words OR the necessary suffix to finish the current word if "type" is "prediction", or an error message if "type" is "error".

Examples:
Example 1 Input:
"This is a comment on a "
Example 1 JSON response:
{
  "type": "prediction",
  "content": "Linear issue.",
}

Example 2 Input:
"New York is a city in the"
Example 2 JSON response:
{
  "type": "prediction",
  "content": " United States.",
}

Example 3 Input:
"This is a comment on a Lin"
Example 3 JSON response:
{
  "type": "prediction",
  "content": "ear issue.",
}
`

type PredictInputContentResponse = {
  type: 'prediction' | 'error'
  content: string
}

class PredictiveTextareaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PredictiveTextareaError'
  }
}

class PredictInputContentError extends PredictiveTextareaError {
  constructor(message: string) {
    super(message)
    this.name = 'PredictInputContentError'
  }
}

let client: OpenAI | null = null

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new PredictiveTextareaError('OPENAI_API_KEY is not set')
  }
  if (!client) {
    client = new OpenAI({
      apiKey,
    })
  }
  return client
}

async function predictInputContent(text: string): Promise<string> {
  const client = getClient()
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    instructions: INSTRUCTIONS,
    input: `Respond in json format. Content: "${text}"`,
    text: {
      format: {
        type: 'json_object'
      }
    }
  })

  let output: PredictInputContentResponse

  try {
    output = JSON.parse(response.output_text || '{}') as PredictInputContentResponse
  }
  catch (error) {
    throw new PredictInputContentError(error as string)
  }

  if (output.type === 'prediction') {
    return Promise.resolve(output.content)
  }
  else {
    return Promise.reject(new PredictInputContentError(output.content || 'Unknown error'))
  }
}

export { predictInputContent }
