import { NextResponse } from 'next/server'

const CRITICAL_ROUTES = [
  '/api/auth/session',
  '/api/user/profile',
  '/api/conversations',
  '/api/memory'
]

export async function GET() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'

    const warmPromises = CRITICAL_ROUTES.map(async (route) => {
      try {
        const response = await fetch(`${baseUrl}${route}`, {
          headers: { 'Cache-Control': 'max-age=3600' }
        })
        return { route, status: response.status }
      } catch (error) {
        return { route, error: error.message }
      }
    })

    const results = await Promise.all(warmPromises)
    
    return NextResponse.json({ 
      success: true, 
      warmed: results.length,
      results 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}