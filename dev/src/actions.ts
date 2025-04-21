'use server'

import { predictInputContent } from 'predictive-textarea'

export async function getPrediction(text: string): Promise<string> {
  try {
    return await predictInputContent(text)
  } catch (error) {
    console.error('Error getting prediction:', error)
    return ''
  }
} 
