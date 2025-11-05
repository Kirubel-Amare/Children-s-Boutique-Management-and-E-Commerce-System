// lib/emailService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: { orderNumber: any; totalAmount: any; status: any; }, customerEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `Order Confirmation - #${order.orderNumber}`,
      html: `
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. Here are your order details:</p>
        <ul>
          <li>Order Number: ${order.orderNumber}</li>
          <li>Total: $${order.totalAmount}</li>
          <li>Status: ${order.status}</li>
        </ul>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}