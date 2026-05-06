import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  facebook?: string;
  referred_by?: string | null;
  preferred_date?: string;
  preferred_time?: string;
  date?: string;
  time?: string;
  package: string;
  service_type: string[];
  shoot_type: string;
  shoot_type_other?: string;
  location?: string;
  location_address?: string;
  message?: string;
  addons?: string[];
  addons_other?: string;
  payment_method: string;
  status: string;
  _overrideAdminEmail?: string;
}

/* ─── helpers ────────────────────────────────────────────────────────── */

/** Human-readable location label */
const formatLocation = (location?: string, locationAddress?: string): string => {
  if (!location) return 'N/A';
  const labels: Record<string, string> = {
    studio: 'Studio',
    outdoor: 'Outdoor',
    'clients-venue': "Client's Venue",
    'studio-rental': 'Studio Rental',
  };
  const label = labels[location] ?? location;
  if ((location === 'outdoor' || location === 'clients-venue') && locationAddress) {
    return `${label} — ${locationAddress}`;
  }
  return label;
};

/* ─── shared row helpers (avoids repeating inline style blocks) ────────── */
const detailRow = (label: string, value: string) => `
  <tr>
    <td style="font-weight: bold; color: #6b7280; font-size: 14px; width: 150px; padding: 6px 8px; vertical-align: top;">${label}:</td>
    <td style="color: #1f2937; font-size: 14px; padding: 6px 8px;">${value}</td>
  </tr>
`;

const detailRowDark = (label: string, value: string) => `
  <tr>
    <td style="font-weight: 500; color: #8a6e30; font-size: 12px; width: 140px; padding: 8px 0; vertical-align: top; letter-spacing: 0.05em; text-transform: uppercase;">${label}</td>
    <td style="color: #a89878; font-size: 14px; padding: 8px 0 8px 16px; vertical-align: top;">${value}</td>
  </tr>
`;

/* ════════════════════════════════════════════════════════════════════════
   CUSTOMER EMAIL TEMPLATE  (status update: confirmed / cancelled / completed)
   ════════════════════════════════════════════════════════════════════════ */
const getCustomerEmailTemplate = (reservation: Reservation, status: string) => {
  const statusMessages = {
    confirmed: {
      subject: 'Your Reservation is Confirmed',
      heading: 'Reservation Confirmed',
      message: 'Great news! Your reservation has been confirmed. We look forward to welcoming you to G-Limit Studio.',
      badgeBg: '#edfaf4',
      badgeBorder: '#7ed9ae',
      badgeText: '#1a7a4a',
      statusLabel: 'Confirmed',
    },
    cancelled: {
      subject: 'Reservation Cancelled',
      heading: 'Reservation Cancelled',
      message: 'Your reservation has been cancelled. If you have any questions, please contact us.',
      badgeBg: '#fef2f2',
      badgeBorder: '#fca5a5',
      badgeText: '#b91c1c',
      statusLabel: 'Cancelled',
    },
    completed: {
      subject: 'Session Completed - Thank You',
      heading: 'Session Completed',
      message: 'Thank you for choosing G-Limit Studio! Your session has been completed. We hope you had a wonderful experience.',
      badgeBg: '#eff6ff',
      badgeBorder: '#93c5fd',
      badgeText: '#1d4ed8',
      statusLabel: 'Completed',
    },
  };

  const statusInfo = statusMessages[status as keyof typeof statusMessages] ?? statusMessages.confirmed;

  const locationDisplay = formatLocation(reservation.location, reservation.location_address);

  // Format time to 12-hour format with AM/PM
  const formatTime12Hour = (timeStr: string | undefined): string => {
    if (!timeStr) return 'N/A';
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return timeStr;
    const [, h, m] = match;
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const formattedTime = formatTime12Hour(reservation.preferred_time || reservation.time);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.subject}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f5f3ef;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="620" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 0.5px solid #e0dbd2; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

              <!-- Top Gold Line -->
              <tr>
                <td style="height: 3px; background: linear-gradient(to right, #ffffff, #c9a84c, #e8c96a, #c9a84c, #ffffff);"></td>
              </tr>

              <!-- Header -->
              <tr>
                <td style="background-color: #faf9f6; padding: 48px 40px 36px; text-align: center; border-bottom: 0.5px solid #e8e3da;">

                  <!-- Brand Pill -->
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px; background: rgba(201,168,76,0.06); border: 0.5px solid #c9a84c;">
                    <tr>
                      <td style="padding: 6px 16px;">
                        <span style="font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: #a07c2e;">G-LIMIT STUDIO</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Status Badge -->
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                    <tr>
                      <td style="background: ${statusInfo.badgeBg}; border: 0.5px solid ${statusInfo.badgeBorder}; padding: 8px 22px; border-radius: 2px;">
                        <span style="font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${statusInfo.badgeText};">${statusInfo.statusLabel}</span>
                      </td>
                    </tr>
                  </table>

                  <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 400; color: #1a1612; letter-spacing: 0.01em;">
                    ${statusInfo.heading}
                  </h1>
                  <p style="margin: 14px 0 0; font-size: 14px; color: #7a6e5e; line-height: 1.65;">
                    ${statusInfo.message}
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <!-- Reservation Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf9f6; border: 0.5px solid #e0dbd2; margin-bottom: 28px;">
                    <tr>
                      <td>
                        <!-- Card Header -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 20px 24px 16px; border-bottom: 0.5px solid #e0dbd2;">
                              <h2 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 17px; font-weight: 400; color: #a07c2e; letter-spacing: 0.02em;">
                                Reservation Details
                              </h2>
                            </td>
                          </tr>
                        </table>

                        <!-- Details Grid -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 4px 0;">
                          ${detailRowLight('Package', `<span style="text-transform:capitalize; color: #2a2218;">${reservation.package}</span>`)}
                          ${detailRowLight(
                            'Shoot Type',
                            `<span style="text-transform:capitalize; color: #2a2218;">${
                              reservation.shoot_type === 'other' && reservation.shoot_type_other
                                ? reservation.shoot_type_other
                                : reservation.shoot_type
                            }</span>`
                          )}
                          ${detailRowLight(
                            'Services',
                            `<span style="color: #2a2218;">${Array.isArray(reservation.service_type) ? reservation.service_type.join(', ') : reservation.service_type}</span>`
                          )}
                          ${detailRowLight('Location', `<span style="color: #2a2218;">${locationDisplay}</span>`)}
                          ${detailRowLight(
                            'Date',
                            `<strong style="color: #a07c2e; font-weight: 500;">${new Date(reservation.preferred_date || reservation.date || new Date().toISOString()).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}</strong>`
                          )}
                          ${detailRowLight('Time', `<strong style="color: #a07c2e; font-weight: 500;">${formattedTime}</strong>`)}
                          ${detailRowLight(
                            'Payment Method',
                            `<span style="text-transform:uppercase; color: #2a2218; font-size: 12px; letter-spacing: 0.05em;">${reservation.payment_method}</span>`
                          )}
                          ${reservation.addons && reservation.addons.length > 0
                            ? detailRowLight(
                                'Add-ons',
                                `<span style="color: #2a2218;">${reservation.addons.join(', ')}${reservation.addons_other ? ` — ${reservation.addons_other}` : ''}</span>`
                              )
                            : ''}
                          ${reservation.referred_by
                            ? detailRowLight('Referred By', `<span style="color: #2a2218;">${reservation.referred_by}</span>`)
                            : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${status === 'confirmed'
                    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(201,168,76,0.05); border-left: 2px solid #c9a84c; margin-bottom: 28px;">
                        <tr>
                          <td style="padding: 16px 20px;">
                            <p style="margin: 0; font-size: 13px; color: #7a6e5e; line-height: 1.7;">
                              <strong style="color: #a07c2e;">Please Note:</strong> We kindly ask that you arrive 10–15 minutes prior to your scheduled session time. Should you need to reschedule, please contact us at least 24 hours in advance.
                            </p>
                          </td>
                        </tr>
                      </table>`
                    : ''}

                  ${reservation.message
                    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf9f6; border: 0.5px solid #e0dbd2; margin-bottom: 28px;">
                        <tr>
                          <td style="padding: 20px 24px;">
                            <p style="margin: 0 0 10px; font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #c9a84c;">Additional Requests</p>
                            <p style="margin: 0; font-size: 14px; color: #7a6e5e; line-height: 1.7; font-style: italic;">${reservation.message}</p>
                          </td>
                        </tr>
                      </table>`
                    : ''}

                  <!-- Closing -->
                  <p style="margin: 0 0 8px; font-size: 14px; color: #7a6e5e; line-height: 1.7;">
                    We look forward to creating beautiful memories with you.
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #b4a898;">
                    If you have any questions, please don't hesitate to reach out.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #faf9f6; padding: 28px 40px; text-align: center; border-top: 0.5px solid #e0dbd2;">
                  <!-- Decorative Line -->
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px; width: 48px;">
                    <tr>
                      <td style="height: 1px; background: linear-gradient(to right, #faf9f6, #c9a84c, #faf9f6);"></td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 6px; font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #a07c2e; letter-spacing: 0.04em;">
                    G-Limit Studio
                  </p>
                  <p style="margin: 0 0 14px; font-size: 11px; color: #b4a898; line-height: 1.6;">
                    Capturing moments, creating memories
                  </p>

                  <!-- Contact Info -->
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td style="padding: 0 14px; border-right: 0.5px solid #d4cfc6;">
                        <span style="font-size: 11px; color: #9c8e7e;">0969 053 7370</span>
                      </td>
                      <td style="padding: 0 14px;">
                        <span style="font-size: 11px; color: #9c8e7e;">glimitphotostudio@gmail.com</span>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 0; font-size: 10px; color: #ccc4b8; letter-spacing: 0.04em;">
                    This is an automated message. Please do not reply.
                  </p>
                </td>
              </tr>

              <!-- Bottom Gold Line -->
              <tr>
                <td style="height: 3px; background: linear-gradient(to right, #ffffff, #c9a84c, #e8c96a, #c9a84c, #ffffff);"></td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/* ════════════════════════════════════════════════════════════════════════
   ADMIN EMAIL TEMPLATE  (new booking notification)
   ════════════════════════════════════════════════════════════════════════ */
const getAdminNewBookingEmailTemplate = (reservation: Reservation) => {
  const locationDisplay = formatLocation(reservation.location, reservation.location_address);

  // Format time to 12-hour format with AM/PM
  const formatTime12Hour = (timeStr: string | undefined): string => {
    if (!timeStr) return 'N/A';
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return timeStr;
    const [, h, m] = match;
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const formattedTime = formatTime12Hour(reservation.preferred_time || reservation.time);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Reservation Received</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'DM Sans', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="620" cellpadding="0" cellspacing="0"
              style=" background-color: #f5f3ef; border: 0.5px solid #e0dbd2; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

              <!-- Purple top accent -->
              <tr>
                <td style="height: 3px; background-color: #6d28d9;"></td>
              </tr>

              <!-- Header -->
              <tr>
                <td style="background-color: #f5f3ef; padding: 28px 32px 24px; border-bottom: 0.5px solid #e8e3da;">
                  <!-- Badge -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                    <tr>
                      <td style="background: #f3f0ff; border: 0.5px solid #c4b5f4; padding: 6px 14px; border-radius: 2px;">
                        <span style="font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #6d28d9;">New Reservation</span>
                      </td>
                    </tr>
                  </table>
                  <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 400; color: #1a1612;">
                    Booking Received
                  </h1>
                  <p style="margin: 0; font-size: 14px; color: #7a6e5e; line-height: 1.6;">
                    A new reservation has been submitted and requires your attention.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 28px 32px;">

                  <!-- Client Information -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 0.5px solid #e0dbd2; margin-bottom: 20px;">
                    <tr>
                      <td style="background-color: #ffffff; padding: 14px 20px; border-bottom: 0.5px solid #e0dbd2;">
                        <h2 style="margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #9c8e7e;">
                          Client Information
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; background-color: #ffffff;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${detailRow('Name', reservation.name)}
                          ${detailRow('Email', reservation.email)}
                          ${detailRow('Phone', reservation.phone)}
                          ${reservation.facebook ? detailRow('Facebook / IG', reservation.facebook) : ''}
                          ${reservation.referred_by ? detailRow('Referred By', reservation.referred_by) : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Service Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 0.5px solid #e0dbd2; margin-bottom: 20px;">
                    <tr>
                      <td style="background-color: #ffffff; padding: 14px 20px; border-bottom: 0.5px solid #e0dbd2;">
                        <h2 style="margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #9c8e7e;">
                          Service Details
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; background-color: #ffffff;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${detailRow(
                            'Package',
                            `<span style="text-transform:capitalize">${reservation.package}</span>`
                          )}
                          ${detailRow(
                            'Shoot Type',
                            `<span style="text-transform:capitalize">${
                              reservation.shoot_type === 'other' && reservation.shoot_type_other
                                ? reservation.shoot_type_other
                                : reservation.shoot_type
                            }</span>`
                          )}
                          ${detailRow(
                            'Services',
                            Array.isArray(reservation.service_type)
                              ? reservation.service_type.join(', ')
                              : reservation.service_type
                          )}
                          ${detailRow('Location', locationDisplay)}
                          ${detailRow(
                            'Date',
                            `<strong style="color: #a07c2e;">${new Date(reservation.preferred_date || reservation.date || new Date().toISOString()).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}</strong>`
                          )}
                          ${detailRow('Time', `<strong style="color: #a07c2e;">${formattedTime}</strong>`)}
                          ${detailRow(
                            'Payment Method',
                            `<span style="text-transform:uppercase">${reservation.payment_method}</span>`
                          )}
                          ${reservation.addons && reservation.addons.length > 0
                            ? detailRow(
                                'Add-ons',
                                reservation.addons.join(', ') +
                                  (reservation.addons_other ? ` — ${reservation.addons_other}` : '')
                              )
                            : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Additional requests (optional) -->
                  ${reservation.message
                    ? `<table width="100%" cellpadding="0" cellspacing="0"
                        style="background-color: #fffbeb; border: 0.5px solid #fde68a; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 16px 20px;">
                            <h2 style="margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #92400e;">
                              Additional Requests
                            </h2>
                            <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">
                              ${reservation.message}
                            </p>
                          </td>
                        </tr>
                      </table>`
                    : ''}

                  <!-- Action required banner -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-left: 2px solid #3b82f6;">
                    <tr>
                      <td style="padding: 14px 18px;">
                        <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.6;">
                          <strong style="font-weight: 500;">Action Required:</strong> Please review this reservation and confirm
                          or contact the client for any clarifications.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #faf9f6; padding: 18px 32px; text-align: center; border-top: 0.5px solid #e0dbd2;">
                  <p style="margin: 0; font-size: 11px; color: #b4a898;">
                    Automated notification from the G-Limit Studio reservation system.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/* ════════════════════════════════════════════════════════════════════════
   HELPER — light-theme detail row for customer email
   ════════════════════════════════════════════════════════════════════════ */
const detailRowLight = (label: string, value: string) => `
  <tr>
    <td style="padding: 10px 24px; border-bottom: 0.5px solid #eee9e0; vertical-align: top; width: 36%;">
      <span style="font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #9c8e7e;">${label}</span>
    </td>
    <td style="padding: 10px 24px 10px 0; border-bottom: 0.5px solid #eee9e0; vertical-align: top;">
      <span style="font-size: 14px; color: #2a2218; line-height: 1.5;">${value}</span>
    </td>
  </tr>
`;

/* ════════════════════════════════════════════════════════════════════════
   EXPORTED FUNCTIONS
   ════════════════════════════════════════════════════════════════════════ */

/** Send status update email to the customer */
export const sendStatusUpdateEmail = async (reservation: Reservation, newStatus: string) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    const statusMessages = {
      confirmed: '✓ Your Reservation is Confirmed!',
      cancelled: '✗ Reservation Cancelled',
      completed: '✓ Session Completed - Thank You!',
    };

    const subject =
      statusMessages[newStatus as keyof typeof statusMessages] ?? 'Reservation Update';

    const fromAddress = process.env.SMTP_USER!;

    await transporter.sendMail({
      from: `"Studio Reservations" <${fromAddress}>`,
      to: reservation.email,
      subject,
      html: getCustomerEmailTemplate(reservation, newStatus),
    });

    console.log(`Status update email sent to ${reservation.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending status update email:', error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
};

/** Send new-booking notification to admin(s).
 *  Pass _overrideAdminEmail to target a specific inbox per call. */
export const sendNewBookingAdminEmail = async (reservation: Reservation) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    const adminEmail = reservation._overrideAdminEmail || process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      const msg =
        'No admin email configured (ADMIN_EMAIL env var missing and no override supplied)';
      console.error(msg);
      return { success: false, error: msg };
    }

    const { _overrideAdminEmail, ...cleanReservation } = reservation;

    const fromAddress = process.env.SMTP_USER!;

    const info = await transporter.sendMail({
      from: `"Studio Reservations" <${fromAddress}>`,
      to: adminEmail,
      subject: `🎉 New Reservation: ${cleanReservation.name} — ${new Date(
        cleanReservation.preferred_date || cleanReservation.date || new Date().toISOString()
      ).toLocaleDateString()}`, 
      html: getAdminNewBookingEmailTemplate(cleanReservation as Reservation),
    });

    console.log(`✅ Email sent to ${adminEmail} — messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending new booking admin email:', error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
};
