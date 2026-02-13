import { NextRequest, NextResponse } from 'next/server'
import { sendStatusUpdateEmail } from '@/lib/email-reservation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Forward all query parameters to Laravel
    const query = new URLSearchParams()
    searchParams.forEach((value, key) => {
      query.append(key, value)
    })

    const response = await fetch(`${API_URL}/reservations?${query.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to fetch reservations',
          errors: data.errors || null
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Admin reservations fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching reservations.' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Reservation ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to delete reservation',
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Reservation deletion error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while deleting the reservation.' 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status')
    const sendEmail = searchParams.get('sendEmail') === 'true'

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Reservation ID and status are required' },
        { status: 400 }
      )
    }

    // Update status in Laravel backend
    const response = await fetch(`${API_URL}/reservations/${id}/status/${status}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to update status',
        },
        { status: response.status }
      )
    }

    // Send customer email notification if requested and status is confirmed, cancelled, or completed
    let emailSent = false
    if (sendEmail && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      try {
        const reservation = data.data || data.reservation
        
        if (reservation) {
          console.log(`📧 Sending ${status} email to customer: ${reservation.email}`)
          const emailResult = await sendStatusUpdateEmail(reservation, status)
          emailSent = emailResult.success
          
          if (emailSent) {
            console.log(`✅ ${status.toUpperCase()} email sent successfully to: ${reservation.email}`)
          } else {
            console.error(`❌ Failed to send ${status} email to customer`)
          }
        } else {
          console.warn('⚠️ No reservation data found in response, skipping email notification')
        }
      } catch (emailError) {
        console.error('❌ Error sending status update email:', emailError)
        // Don't fail the request if email fails - status was still updated
      }
    }

    return NextResponse.json({
      ...data,
      emailSent // Include this so frontend knows if notification was sent
    })

  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while updating status.' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Reservation ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to update reservation',
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Reservation update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while updating the reservation.' 
      },
      { status: 500 }
    )
  }
}
