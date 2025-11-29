// app/api/upload/test/route.ts
import { NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });
    
    return NextResponse.json({
      success: true,
      message: 'Upload directory is accessible',
      path: uploadDir
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}