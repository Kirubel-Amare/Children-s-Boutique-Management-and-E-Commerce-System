// app/api/auth/otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail, generateOTP, generateOTPEmail } from '@/lib/emailService';

// Send OTP
export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();

    if (!email || !action) {
      return NextResponse.json(
        { message: 'Email and action are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    const updateData: any = {
      otpCode: otp,
      otpExpires,
    };
    await prisma.user.update({
      where: { email },
      data: updateData,
    });

    // Send OTP email
    const emailResult = await sendEmail({
      to: email,
      subject: `OTP Verification for ${action}`,
      html: generateOTPEmail(user.name, otp, action),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { message: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      expiresIn: '10 minutes',
    });
  } catch (error: any) {
    console.error('OTP sending error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify OTP
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if OTP exists and is valid
    if (!user.otpCode || !user.otpExpires) {
      return NextResponse.json(
        { message: 'No OTP requested or OTP expired' },
        { status: 400 }
      );
    }

    if (user.otpCode !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP code' },
        { status: 400 }
      );
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }
    // Clear OTP after successful verification
    const clearData: any = {
      otpCode: null,
      otpExpires: null,
    };
    await prisma.user.update({
      where: { email },
      data: clearData,
    });

    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true,
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}