import type { NextApiRequest, NextApiResponse } from 'next';

type PredictionResponse = {
  prediction: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PredictionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ prediction: '' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ prediction: '' });
    }

    // TODO: Implement actual prediction logic here
    // For now, return a mock prediction
    const mockPrediction = `Mock prediction for: ${text}`;
    
    return res.status(200).json({ prediction: mockPrediction });
  } catch (error) {
    console.error('Error processing prediction request:', error);
    return res.status(500).json({ prediction: '' });
  }
} 
