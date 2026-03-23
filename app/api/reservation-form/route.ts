import { NextRequest, NextResponse } from 'next/server'
import { sendNewBookingAdminEmail } from '@/lib/email-reservation'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // ── Extract ALL values BEFORE forwarding to Laravel ──────────────────────
    // Once formData is passed to fetch(), the stream may be consumed.
    // Read every field here first so we always have the data for the email.
    let serviceType: string[] = []
    let addons: string[] = []
    try { serviceType = JSON.parse((formData.get('service_type') as string) || '[]') } catch { serviceType = [] }
    try { addons = JSON.parse((formData.get('addons') as string) || '[]') } catch { addons = [] }

    const snapshot = {
      name:             (formData.get('name')             as string) || '',
      email:            (formData.get('email')            as string) || '',
      phone:            (formData.get('phone')            as string) || '',
      facebook:         (formData.get('facebook')         as string) || '',
      referred_by:      (formData.get('referred_by')      as string) || null,
      preferred_date:   (formData.get('date')             as string) || '',
      preferred_time:   (formData.get('time')             as string) || '',
      package:          (formData.get('package')          as string) || '',
      service_type:     serviceType,
      shoot_type:       (formData.get('shoot_type')       as string) || '',
      shoot_type_other: (formData.get('shoot_type_other') as string) || '',
      location:         (formData.get('location')         as string) || '',
      location_address: (formData.get('location_address') as string) || '',
      message:          (formData.get('message')          as string) || '',
      addons,
      addons_other:     (formData.get('addons_other')     as string) || '',
      payment_method:   (formData.get('payment_method')   as string) || '',
    }

    console.log('📋 Snapshot before forwarding:', JSON.stringify(snapshot, null, 2))

    // ── Forward to Laravel ────────────────────────────────────────────────────
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const response = await fetch(`${apiUrl}/reservations`, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to submit reservation',
          errors: data.errors || null,
        },
        { status: response.status }
      )
    }

    // ── Send emails using the snapshot we captured above ─────────────────────
    const adminEmailsSent: Record<string, boolean> = {}
    const adminEmailErrors: Record<string, string> = {}

    try {
      const laravelData = data.data || data.reservation

      const fullReservation = {
        id:     laravelData?.reservation_id ?? laravelData?.id ?? 0,
        status: laravelData?.status || 'pending',
        ...snapshot,
      }

      const adminRecipients = [
        'infinitech.justin2024@gmail.com',
        'infinitech.eirene@gmail.com',
      ]

      const results = await Promise.allSettled(
        adminRecipients.map((email) =>
          sendNewBookingAdminEmail({ ...fullReservation, _overrideAdminEmail: email })
        )
      )

      results.forEach((result, idx) => {
        const email = adminRecipients[idx]
        if (result.status === 'fulfilled' && result.value.success) {
          adminEmailsSent[email] = true
          console.log(`✅ Notification sent to: ${email}`)
        } else {
          adminEmailsSent[email] = false
          const reason =
            result.status === 'rejected'
              ? String(result.reason)
              : String((result.value as any).error ?? 'unknown error')
          adminEmailErrors[email] = reason
          console.error(`❌ Failed to notify ${email}:`, reason)
        }
      })
    } catch (emailError) {
      console.error('❌ Unexpected error during email dispatch:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation submitted successfully!',
      data,
      adminEmailsSent,
      ...(Object.keys(adminEmailErrors).length && { adminEmailErrors }),
    })

  } catch (error) {
    console.error('Reservation submission error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while submitting the reservation. Please try again.',
      },
      { status: 500 }
    )
  }
}
