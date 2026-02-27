import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page    = searchParams.get('page')    || '1'
    const perPage = searchParams.get('perPage') || '10'
    const search  = searchParams.get('search')  || ''

    const query = new URLSearchParams({ page, perPage })
    if (search) query.append('search', search)

    const response = await fetch(`${API_URL}/ambassadors?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ambassadors GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${API_URL}/ambassadors`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Do NOT set Content-Type here — browser sets it with boundary for multipart
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Ambassadors POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
