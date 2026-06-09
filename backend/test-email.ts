import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Shiv Shakti Auto Parts" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email',
      text: 'This is a test email to verify credentials.'
    };

    await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully!');
  } catch (err) {
    console.error('Failed to send test email:', err);
  }
}

testEmail();
