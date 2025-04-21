'use server'

import { predictInputContent } from 'predictive-textarea'


export async function predictInput(text: string) {
  return predictInputContent(text)
}
