import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.post('/api/predict', (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ prediction: '' });
    }

    // Mock prediction logic
    const mockPrediction = `Mock prediction for: ${text}`;
    
    return res.status(200).json({ prediction: mockPrediction });
  } catch (error) {
    console.error('Error processing prediction request:', error);
    return res.status(500).json({ prediction: '' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 
