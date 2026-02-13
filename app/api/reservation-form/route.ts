import { NextRequest, NextResponse } from 'next/server'
import { sendNewBookingAdminEmail } from '@/lib/email-reservation'

export async function POST(request: NextRequest) {
  console.log('🎯 ========================================')
  console.log('🎯 NEW RESERVATION FORM SUBMISSION')
  console.log('🎯 ========================================')
  
  try {
    const formData = await request.formData()
    
    // Log form data (without file)
    console.log('📝 Form data received:')
    for (const [key, value] of formData.entries()) {
      if (key !== 'payment_proof') {
        console.log(`  ${key}:`, value)
      } else {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value)
      }
    }
    
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    console.log('🌐 Laravel API URL:', apiUrl)
    
    // Forward the form data to Laravel backend
    console.log('📤 Sending to Laravel...')
    const response = await fetch(`${apiUrl}/reservations`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    })

    console.log('📥 Laravel response status:', response.status, response.statusText)
    
    const data = await response.json()
    console.log('📦 Laravel response data:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('❌ Laravel API returned error')
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to submit reservation',
          errors: data.errors || null
        },
        { status: response.status }
      )
    }

    console.log('✅ Reservation saved to Laravel successfully')
    
    // Send admin notification email for new booking
    let adminEmailSent = false
    let emailError = null
    
    try {
      console.log('📧 ========================================')
      console.log('📧 ATTEMPTING TO SEND ADMIN EMAIL')
      console.log('📧 ========================================')
      
      // Check environment variables
      console.log('🔧 Email Configuration Check:')
      console.log('  SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET')
      console.log('  SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET')
      console.log('  SMTP_USER:', process.env.SMTP_USER ? '✅ SET' : '❌ NOT SET')
      console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET' : '❌ NOT SET')
      console.log('  SMTP_FROM:', process.env.SMTP_FROM || '❌ NOT SET')
      console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ NOT SET')
      
      // Try multiple possible locations for reservation data
      const reservation = data.data || data.reservation || data
      
      console.log('🔍 Extracting reservation data...')
      console.log('  Available keys in response:', Object.keys(data))
      
      // Check if we have the minimum required fields
      const hasName = !!reservation?.name
      const hasEmail = !!reservation?.email
      const hasPhone = !!reservation?.phone
      
      console.log('✓ Validation:')
      console.log('  Has name:', hasName, hasName ? `(${reservation.name})` : '')
      console.log('  Has email:', hasEmail, hasEmail ? `(${reservation.email})` : '')
      console.log('  Has phone:', hasPhone, hasPhone ? `(${reservation.phone})` : '')
      
      if (hasName && hasEmail && hasPhone) {
        console.log('✅ All required fields present')
        console.log('📧 Sending email to:', process.env.ADMIN_EMAIL)
        
        const emailResult = await sendNewBookingAdminEmail(reservation)
        adminEmailSent = emailResult.success
        
        if (adminEmailSent) {
          console.log('✅✅✅ ADMIN EMAIL SENT SUCCESSFULLY! ✅✅✅')
          console.log('📬 Check inbox:', process.env.ADMIN_EMAIL)
        } else {
          console.error('❌❌❌ FAILED TO SEND ADMIN EMAIL ❌❌❌')
          console.error('📧 Email result:', emailResult)
          emailError = emailResult.error
        }
      } else {
        console.warn('⚠️ Missing required reservation fields!')
        console.warn('Available reservation data:', JSON.stringify(reservation, null, 2))
        emailError = 'Missing required fields (name, email, or phone)'
      }
    } catch (error) {
      console.error('❌❌❌ EXCEPTION WHILE SENDING EMAIL ❌❌❌')
      console.error('Error:', error)
      if (error instanceof Error) {
        console.error('Message:', error.message)
        console.error('Stack:', error.stack)
      }
      emailError = error instanceof Error ? error.message : 'Unknown error'
      // Don't fail the request if email fails - reservation was still created
    }

    console.log('🎯 ========================================')
    console.log('🎯 SUBMISSION COMPLETE')
    console.log('🎯 Reservation saved:', '✅')
    console.log('🎯 Admin email sent:', adminEmailSent ? '✅' : '❌')
    if (emailError) {
      console.log('🎯 Email error:', emailError)
    }
    console.log('🎯 ========================================')

    return NextResponse.json({
      success: true,
      message: adminEmailSent 
        ? 'Reservation submitted successfully! Admin has been notified via email.'
        : 'Reservation submitted successfully! (Note: Email notification failed, but your reservation was saved)',
      data: data,
      adminEmailSent,
      emailError: emailError || undefined
    })

  } catch (error) {
    console.error('❌❌❌ CRITICAL ERROR IN RESERVATION SUBMISSION ❌❌❌')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while submitting the reservation. Please try again.' 
      },
      { status: 500 }
    )
  }
}
