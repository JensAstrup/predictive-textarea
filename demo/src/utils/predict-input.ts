'use server'

import OpenAI from 'openai'

const INSTRUCTIONS = `The input text is the preceding text in a comment form.

Predict the most likely next input (2-8 words) based on the text provided. This is in a business context.

Respond in json format. 
"type" should be one of "prediction" if you are predicting next input, or "error" if you are unable to predict input.
"content" should be the next input (2-4 words) or an explanation of why you are unable to predict input.
"newWord" should be true if the prediction starts with a new full word, or false if it is a continuation of the last word.

Example JSON response:
{
  "type": "prediction",
  "content": "This is a prediction",
  "newWord": true
}
`

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return client
}

type PredictInputContentResponse = {
  type: 'prediction' | 'error'
  content: string
  error?: string
  newWord: boolean
}

async function predictInputContent(text: string): Promise<string> {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: INSTRUCTIONS
      },
      {
        role: 'user',
        content: `Respond in json format. Content: "${text}"`
      }
    ],
    response_format: { type: 'json_object' }
  })

  let output: PredictInputContentResponse

  console.log('Response:', response.choices[0].message)

  try {
    output = JSON.parse(response.choices[0].message.content || '{}') as PredictInputContentResponse
  }
  catch (error) {
    return ''
  }

  if (output.type === 'prediction') {
    if (output.newWord) {
      return ' ' + output.content
    }
    return output.content
  }
  else {
    return ''
  }
}

export { predictInputContent }
