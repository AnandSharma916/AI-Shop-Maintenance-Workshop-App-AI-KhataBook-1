import nodemailer from 'nodemailer';

export const sendOtpEmail = async (toEmail: string, otp: string, subjectPrefix: string = 'New Registration Request', sendToAdmin: boolean = false, userDetails?: { name: string, phone: string, email: string }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    const detailsHtml = userDetails ? `
      <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; text-align: left;">
        <h3 style="margin-top: 0; color: #111827;">User Signup Details:</h3>
        <p><strong>Name:</strong> ${userDetails.name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${userDetails.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${userDetails.email}</p>
      </div>
    ` : '';

    const mailOptions = {
      from: `"Shiv Shakti Auto Parts" <${process.env.ADMIN_EMAIL}>`,
      to: sendToAdmin ? process.env.ADMIN_EMAIL : toEmail, // Route conditionally
      subject: `${subjectPrefix} OTP - ${toEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #2563EB;">Shiv Shakti Auto Parts & Workshop</h2>
          <p>An OTP has been requested for this email address.</p>
          ${detailsHtml}
          <div style="margin: 20px auto; padding: 15px; border: 2px dashed #2563EB; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #6B7280; font-size: 12px; mt-5">If you didn't request this, you can ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};
