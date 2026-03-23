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
  preferred_date: string;
  preferred_time: string;
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
  };
  const label = labels[location] ?? location;
  if ((location === 'outdoor' || location === 'clients-venue') && locationAddress) {
    return `${label} — ${locationAddress}`;
  }
  return label;
};

/* ─── shared row helper (avoids repeating inline style blocks) ────────── */
const detailRow = (label: string, value: string) => `
  <tr>
    <td style="font-weight: bold; color: #6b7280; font-size: 14px; width: 150px; padding: 6px 8px; vertical-align: top;">${label}:</td>
    <td style="color: #1f2937; font-size: 14px; padding: 6px 8px;">${value}</td>
  </tr>
`;

/* ════════════════════════════════════════════════════════════════════════
   CUSTOMER EMAIL TEMPLATE  (status update: confirmed / cancelled / completed)
   ════════════════════════════════════════════════════════════════════════ */
const getCustomerEmailTemplate = (reservation: Reservation, status: string) => {
  const statusMessages = {
    confirmed: {
      subject: '✓ Your Reservation is Confirmed!',
      heading: 'Reservation Confirmed',
      message: 'Great news! Your reservation has been confirmed.',
      color: '#10b981',
    },
    cancelled: {
      subject: '✗ Reservation Cancelled',
      heading: 'Reservation Cancelled',
      message: 'Your reservation has been cancelled.',
      color: '#ef4444',
    },
    completed: {
      subject: '✓ Session Completed - Thank You!',
      heading: 'Session Completed',
      message: 'Thank you for choosing our studio! Your session has been completed.',
      color: '#3b82f6',
    },
  };

  const statusInfo = statusMessages[status as keyof typeof statusMessages] ?? statusMessages.confirmed;

  const locationDisplay = formatLocation(reservation.location, reservation.location_address);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background-color: ${statusInfo.color}; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    ${statusInfo.heading}
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                    Hi <strong>${reservation.name}</strong>,
                  </p>
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #333333;">
                    ${statusInfo.message}
                  </p>

                  <!-- Reservation Details card -->
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 20px; font-size: 20px; color: #1f2937;
                          border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                          Reservation Details
                        </h2>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${detailRow('Package', `<span style="text-transform:capitalize">${reservation.package}</span>`)}
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
                            new Date(reservation.preferred_date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })
                          )}
                          ${detailRow('Time', reservation.preferred_time)}
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
                          ${reservation.referred_by
                            ? detailRow('Referred By', reservation.referred_by)
                            : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${status === 'confirmed'
                    ? `<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b;
                        padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; color: #92400e;">
                          <strong>Important:</strong> Please arrive 10–15 minutes before your scheduled time.
                          If you need to reschedule, please contact us at least 24 hours in advance.
                        </p>
                      </div>`
                    : ''}

                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                    If you have any questions, please don't hesitate to contact us.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center;
                  border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                    Thank you for choosing our studio!
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    This is an automated email. Please do not reply to this message.
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
   ADMIN EMAIL TEMPLATE  (new booking notification)
   ════════════════════════════════════════════════════════════════════════ */
const getAdminNewBookingEmailTemplate = (reservation: Reservation) => {
  const locationDisplay = formatLocation(reservation.location, reservation.location_address);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Reservation Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background-color: #ffffff; border-radius: 8px; overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background-color: #7c3aed; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    🎉 New Reservation Received!
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                    A new reservation has been submitted and requires your attention.
                  </p>

                  <!-- Client Information -->
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 15px; font-size: 18px; color: #1f2937;
                          border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                          Client Information
                        </h2>
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
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 15px; font-size: 18px; color: #1f2937;
                          border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
                          Service Details
                        </h2>
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
                            `<strong>${new Date(reservation.preferred_date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}</strong>`
                          )}
                          ${detailRow('Time', `<strong>${reservation.preferred_time}</strong>`)}
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
                        style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <tr>
                          <td>
                            <h2 style="margin: 0 0 10px; font-size: 16px; color: #92400e;">
                              Additional Requests
                            </h2>
                            <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.5;">
                              ${reservation.message}
                            </p>
                          </td>
                        </tr>
                      </table>`
                    : ''}

                  <!-- Action required banner -->
                  <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6;
                    padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #1e40af;">
                      <strong>Action Required:</strong> Please review this reservation and confirm
                      or contact the client for any clarifications.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center;
                  border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    This is an automated notification from your reservation system.
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
        cleanReservation.preferred_date
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
