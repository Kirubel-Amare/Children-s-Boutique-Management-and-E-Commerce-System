// app/api/contact/route.ts (updated)
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Store message in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        status: 'UNREAD'
      }
    });

    // Send email to business
    const businessEmailResult = await sendEmail({
      to: 'akirubel8@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ec4899; }
            .button { background: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <h2>Contact Details</h2>
              <div class="message-box">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message ID:</strong> ${contactMessage.id}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <h3>Message:</h3>
              <div class="message-box">
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXTAUTH_URL}/admin/messages" class="button">
                  View in Admin Panel
                </a>
                <a href="mailto:${email}" style="margin-left: 10px;" class="button">
                  Reply to ${name}
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (!businessEmailResult.success) {
      console.error('Failed to send business email:', businessEmailResult.error);
    }

    // Send confirmation email to user
    const userEmailResult = await sendEmail({
      to: email,
      subject: 'Thank you for contacting us!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .contact-info { background: #eff6ff; padding: 15px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us! ❤️</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              
              <p>We've received your message and will get back to you within 24 hours.</p>
              
              <div class="message-box">
                <p><strong>Your Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>

              <div class="contact-info">
                <h3>Our Contact Information</h3>
                <p><strong>📧 Email:</strong> akirubel8@gmail.com</p>
                <p><strong>📞 Phone:</strong> +251 955901762</p>
                <p><strong>📍 Address:</strong> Deneba CBE Street, Fashion City, FC 12345</p>
              </div>

              <p style="text-align: center; margin-top: 20px; color: #666;">
                We appreciate your interest in our boutique and look forward to assisting you!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (!userEmailResult.success) {
      console.error('Failed to send user confirmation email:', userEmailResult.error);
    }

    return NextResponse.json(
      { 
        message: 'Message sent successfully!',
        messageId: contactMessage.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}