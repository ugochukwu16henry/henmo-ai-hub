import { NextResponse } from 'next/server'

const cache = new Map()
const CACHE_TTL = 60000

export async function GET() {
  const cacheKey = 'memory-stats'
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  const stats = { total: 89, pinned: 12, categories: 8, growth: 15 }
  cache.set(cacheKey, { data: stats, timestamp: Date.now() })
  
  return NextResponse.json(stats)
}