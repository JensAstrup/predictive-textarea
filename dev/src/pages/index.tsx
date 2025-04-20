import { useState } from 'react';
import { fetchPrediction } from '../utils/api-client';
import '../styles/dev.css';

function DevPage() {
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = event.target.value;
    setInputText(text);

    if (text.trim()) {
      setIsLoading(true);
      try {
        const result = await fetchPrediction(text);
        setPrediction(result);
      } catch (error) {
        console.error('Error fetching prediction:', error);
        setPrediction('');
      } finally {
        setIsLoading(false);
      }
    } else {
      setPrediction('');
    }
  }

  return (
    <div className="dev-container">
      <header className="dev-header">
        <h1 className="dev-title">Predictive Textarea Development</h1>
        <p className="dev-description">
          Test the predictive text functionality in real-time
        </p>
      </header>

      <main className="dev-main">
        <div>
          <label htmlFor="input-text">Input Text:</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type something to see predictions..."
            rows={5}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="prediction">Prediction:</label>
          <div
            id="prediction"
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '2rem',
              backgroundColor: '#f9f9f9'
            }}
          >
            {isLoading ? 'Loading...' : prediction}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DevPage; 
