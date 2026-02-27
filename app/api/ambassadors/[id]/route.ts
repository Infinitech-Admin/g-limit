import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const response = await fetch(`${API_URL}/ambassadors/${id}`, {
      headers: { 'Accept': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Not found' }))
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Ambassador GET [id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const formData = await request.formData()
    formData.append('_method', 'PUT')

    const response = await fetch(`${API_URL}/ambassadors/${id}`, {
      method: 'POST', // Laravel _method spoofing
      body: formData,
      headers: { 'Accept': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }))
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Ambassador PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const response = await fetch(`${API_URL}/ambassadors/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Delete failed' }))
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Ambassador DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
