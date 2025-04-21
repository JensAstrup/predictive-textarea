'use server'
import { predictInputContent } from 'predictive-textarea'


export async function predictInput(text: string): Promise<string> {
  return predictInputContent(text)
}
