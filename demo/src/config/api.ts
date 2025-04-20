// API configuration
const API_CONFIG = {
  // Local development
  local: 'http://localhost:3001/api/predict',
  // GitHub Pages deployment
  production: 'https://jensastrup.github.io/predictive-textarea/api/predict',
  // Vercel deployment (if you deploy the API separately)
  vercel: 'https://predictive-textarea-api.vercel.app/api/predict',
}

// Extend Window interface to include our environment variables
declare global {
  interface Window {
    ENV?: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}

// Determine which API URL to use
function getApiUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return API_CONFIG.local
    }
    
    // GitHub Pages
    if (hostname.includes('github.io')) {
      return API_CONFIG.production
    }
    
    // Default to Vercel deployment
    return API_CONFIG.vercel
  }
  
  // Server-side default
  return API_CONFIG.vercel
}

export const API_URL = getApiUrl() 
