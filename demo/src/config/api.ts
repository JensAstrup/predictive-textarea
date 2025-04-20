// API configuration
const API_CONFIG = {
  // Local development
  local: '/api/predict',
  // Vercel deployment (if you deploy the API separately)
  vercel: process.env.NEXT_PUBLIC_API_URL || '/api/predict',
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
    // If the environment variable is set, use it
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Local development
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return API_CONFIG.local;
    }
  }
  
  // Default to local API since we now have API routes in the Next.js app
  return API_CONFIG.local;
}

export const API_URL = getApiUrl(); 
