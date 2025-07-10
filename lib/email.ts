import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  const transporter = nodemailer.createTransport({
    // config SMTP
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    html: `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your email address:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you!</p>`
  });
}