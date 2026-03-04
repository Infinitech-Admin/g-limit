import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '10'
    const search = searchParams.get('search') || ''

    const query = new URLSearchParams({ page, perPage })
    if (search.trim()) query.append('search', search.trim())

    const url = `${API_URL}/categories?${query.toString()}`
    console.log('[API] Fetching:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Don't cache — always fresh
      cache: 'no-store',
    })

    // Read as text first so we can detect HTML error pages
    const text = await response.text()

    // If Laravel returned HTML (e.g. 404/500 page), surface a clear error
    if (text.trim().startsWith('<')) {
      console.error('[API] Laravel returned HTML instead of JSON. Status:', response.status)
      console.error('[API] URL was:', url)
      return NextResponse.json(
        {
          error: `Laravel API returned HTML (status ${response.status}). Check that NEXT_PUBLIC_API_URL is correct and Laravel is running.`,
          url,
        },
        { status: 502 }
      )
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[API] Invalid JSON from Laravel:', text.slice(0, 200))
      return NextResponse.json(
        { error: 'Laravel API returned invalid JSON', raw: text.slice(0, 200) },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || `Laravel error ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // Network-level failure (Laravel not running, wrong host, etc.)
    console.error('[API] Categories GET network error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to reach Laravel API',
        hint: `Make sure NEXT_PUBLIC_API_URL is set correctly. Current value: "${API_URL}"`,
      },
      { status: 503 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type — browser/fetch sets multipart boundary automatically
    })

    const text = await response.text()

    if (text.trim().startsWith('<')) {
      console.error('[API] Laravel returned HTML on POST. Status:', response.status)
      return NextResponse.json(
        { error: `Laravel API returned HTML (status ${response.status}). Check your API URL and Laravel route.` },
        { status: 502 }
      )
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Laravel API returned invalid JSON', raw: text.slice(0, 200) },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || `Laravel error ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[API] Categories POST network error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to reach Laravel API',
        hint: `Make sure NEXT_PUBLIC_API_URL is set correctly. Current value: "${API_URL}"`,
      },
      { status: 503 }
    )
  }
}
