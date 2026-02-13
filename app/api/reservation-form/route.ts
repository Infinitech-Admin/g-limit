import { NextRequest, NextResponse } from 'next/server'
import { sendNewBookingAdminEmail } from '@/lib/email-reservation'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    // Forward the form data to Laravel backend
    const response = await fetch(`${apiUrl}/reservations`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to submit reservation',
          errors: data.errors || null
        },
        { status: response.status }
      )
    }

    // Send admin notification email for new booking
    let adminEmailSent = false
    try {
      const reservation = data.data || data.reservation
      
      if (reservation) {
        console.log('Sending admin notification for new reservation ID:', reservation.id)
        const emailResult = await sendNewBookingAdminEmail(reservation)
        adminEmailSent = emailResult.success
        
        if (adminEmailSent) {
          console.log('✅ Admin notification email sent successfully to:', process.env.ADMIN_EMAIL)
        } else {
          console.error('❌ Failed to send admin notification email')
        }
      } else {
        console.warn('⚠️ No reservation data found in response, skipping email notification')
      }
    } catch (emailError) {
      console.error('❌ Error sending admin notification email:', emailError)
      // Don't fail the request if email fails - reservation was still created
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation submitted successfully!',
      data: data,
      adminEmailSent // Include this so frontend knows if notification was sent
    })

  } catch (error) {
    console.error('Reservation submission error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while submitting the reservation. Please try again.' 
      },
      { status: 500 }
    )
  }
}
