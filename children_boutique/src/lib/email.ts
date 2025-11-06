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
    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
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

// Order Notification Functions
export async function sendAdminOrderNotification(order: any) {
  const subject = `New Order Received - ${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ec4899; }
        .button { background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; border-top: 2px solid #ec4899; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received! 🎉</h1>
        </div>
        <div class="content">
          <h2>Order #${order.orderNumber}</h2>
          <div class="order-details">
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
            <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> Pending Approval</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          </div>

          <h3>Order Items:</h3>
          <div class="order-details">
            ${order.orderItems.map((item: any) => `
              <div class="item">
                <p><strong>${item.productName}</strong></p>
                <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            `).join('')}
            
            <div style="margin-top: 15px;">
              <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
              <p><strong>Shipping:</strong> $${order.shippingFee.toFixed(2)}</p>
              <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
              <p class="total">Total: $${order.total.toFixed(2)}</p>
            </div>
          </div>

          <h3>Shipping Address:</h3>
          <div class="order-details">
            <p>${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/orders/${order.id}" class="button">
              Review Order in Admin Panel
            </a>
          </div>

          <p style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            Please review and approve this order within 24 hours.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourstore.com';
  return await sendEmail({ to: adminEmail, subject, html });
}

export async function sendCustomerOrderConfirmation(order: any) {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ec4899; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; border-top: 2px solid #ec4899; padding-top: 10px; }
        .status-pending { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 4px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Order! ❤️</h1>
        </div>
        <div class="content">
          <h2>Order #${order.orderNumber}</h2>
          
          <div class="order-details">
            <p>Your order has been received and is <span class="status-pending">pending approval</span>.</p>
            <p>We will review your order and notify you once it's approved and ready for processing.</p>
          </div>

          <h3>Order Summary</h3>
          <div class="order-details">
            ${order.orderItems.map((item: any) => `
              <div class="item">
                <p><strong>${item.productName}</strong></p>
                <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
                <p>Subtotal: $${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            `).join('')}
            
            <div style="margin-top: 15px;">
              <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
              <p><strong>Shipping Fee:</strong> $${order.shippingFee.toFixed(2)}</p>
              <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
              <p class="total">Total Amount: $${order.total.toFixed(2)}</p>
            </div>
          </div>

          <h3>Shipping Details</h3>
          <div class="order-details">
            <p><strong>Shipping to:</strong></p>
            <p>${order.customerName}<br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}</p>
          </div>

          <h3>Payment Information</h3>
          <div class="order-details">
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Order Status:</strong> <span class="status-pending">Pending Approval</span></p>
          </div>

          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>What's Next?</strong></p>
            <p>1. We'll review your order within 24 hours<br>
               2. You'll receive an email when your order is approved<br>
               3. We'll process and ship your order as soon as possible</p>
          </div>

          <p style="text-align: center; margin-top: 20px; color: #666;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: order.customerEmail, subject, html });
}

export async function sendOrderApprovalNotification(order: any) {
  const subject = `Order Approved - ${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .status-approved { background: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 4px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Approved! ✅</h1>
        </div>
        <div class="content">
          <h2>Great News!</h2>
          <p>Your order <strong>#${order.orderNumber}</strong> has been approved and is now being processed.</p>
          
          <div class="order-details">
            <p><strong>Order Status:</strong> <span class="status-approved">Approved & Processing</span></p>
            <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong> ${order.orderItems.length} product(s)</p>
          </div>

          <p>We are now preparing your items for shipment. You will receive another notification when your order ships.</p>

          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Estimated Next Steps:</strong></p>
            <p>✓ Order processing (1-2 business days)<br>
               ✓ Quality check and packaging<br>
               ✓ Shipment preparation<br>
               ✓ Dispatch and tracking information</p>
          </div>

          <p style="text-align: center; margin-top: 20px;">
            Thank you for shopping with us! We appreciate your business.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: order.customerEmail, subject, html });
}

export async function sendOrderRejectionNotification(order: any, reason?: string) {
  const subject = `Order Update - ${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .status-rejected { background: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 4px; display: inline-block; }
        .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 10px 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Update</h1>
        </div>
        <div class="content">
          <h2>Regarding Your Order #${order.orderNumber}</h2>
          
          <div class="order-details">
            <p><strong>Status:</strong> <span class="status-rejected">Unable to Process</span></p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
          </div>

          <p>We're sorry to inform you that we are unable to process your order at this time.</p>

          ${reason ? `
            <div class="reason-box">
              <p><strong>Reason:</strong> ${reason}</p>
            </div>
          ` : ''}

          <div style="background: #fef3f2; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>What you can do:</strong></p>
            <p>• Contact our support team for more information<br>
               • Review your order details and try again<br>
               • Consider alternative payment methods if applicable<br>
               • Check product availability before reordering</p>
          </div>

          <p>If you have already been charged, the amount will be refunded to your original payment method within 5-7 business days.</p>

          <p style="text-align: center; margin-top: 20px; color: #666;">
            We apologize for any inconvenience and thank you for your understanding.
          </p>

          <div style="text-align: center; margin-top: 20px;">
            <p><strong>Need Help?</strong></p>
            <p>Contact our support team: ${process.env.SUPPORT_EMAIL || 'support@yourstore.com'}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to: order.customerEmail, subject, html });
}