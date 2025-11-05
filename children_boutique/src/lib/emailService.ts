// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourapp.com',
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateOTPEmail(name: string, otp: string, action: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-code { font-size: 32px; font-weight: bold; text-align: center; color: #ec4899; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Security Verification</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>You are attempting to ${action}. Please use the following OTP code to verify your identity:</p>
          <div class="otp-code">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this action, please ignore this email and contact support immediately.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}