// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail, generateOTP, generateOTPEmail } from '@/lib/emailService';

// Get current user settings
export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user settings with OTP verification
export async function PUT(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, currentPassword, newPassword, otp } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // If password change is requested, verify OTP
    if (newPassword) {
      if (!otp) {
        return NextResponse.json(
          { message: 'OTP required for password change' },
          { status: 400 }
        );
      }

      // Verify OTP
      if (!user.otpCode || user.otpCode !== otp || !user.otpExpires || new Date() > user.otpExpires) {
        return NextResponse.json(
          { message: 'Invalid or expired OTP' },
          { status: 400 }
        );
      }

      // Verify current password
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Current password is required' },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Update password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          password: hashedNewPassword,
          otpCode: null,
          otpExpires: null,
        },
      });

      // Send security alert email
      await sendEmail({
        to: user.email,
        subject: 'Password Changed Successfully',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ec4899;">Password Updated</h2>
            <p>Hello ${user.name},</p>
            <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
          </div>
        `,
      });
    }

    // Update name if provided
    if (name) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { name },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json({
      message: 'Settings updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}