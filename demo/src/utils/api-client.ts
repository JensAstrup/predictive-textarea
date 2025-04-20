import { API_URL } from '../config/api'

async function fetchPrediction(text: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      // Use simple mode for CORS
      mode: 'cors',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch prediction')
    }

    const data = await response.json()
    console.log('Prediction data:', data)
    return data.prediction
  } catch (error) {
    console.error('Error fetching prediction:', error)
    return ''
  }
}

export { fetchPrediction } 
