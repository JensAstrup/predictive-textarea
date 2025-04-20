'use server'

import { NextResponse } from 'next/server'
import { predictInputContent } from '../../../utils/predict-input'

// CORS headers for different environments
function getCorsHeaders(origin: string | null) {
  // Allow localhost and GitHub Pages
  const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Next.js dev server
    'https://jensastrup.github.io',
  ]
  
  // Check if the origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.some(allowed => 
    origin === allowed || origin.startsWith(allowed)
  )
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function POST(request: Request) {
  // Get the origin from the request
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { 
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    const prediction = await predictInputContent(text)

    console.log('Prediction:', prediction)
    
    if (!prediction) {
      return NextResponse.json(
        { error: 'Failed to generate prediction' },
        { 
          status: 500,
          headers: corsHeaders,
        }
      )
    }

    return NextResponse.json(
      { prediction },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
} 
