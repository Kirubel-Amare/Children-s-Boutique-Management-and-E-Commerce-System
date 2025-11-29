// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  console.log('Upload API called');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File received:', file?.name, file?.type, file?.size);

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Define upload directory
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    console.log('Creating upload directory:', uploadDir);
    
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('Upload directory created successfully');
    } catch (error: any) {
      console.log('Directory creation error:', error.message);
      // Continue even if directory exists
    }

    // Write file to disk
    const filePath = join(uploadDir, fileName);
    console.log('Writing file to:', filePath);
    
    await writeFile(filePath, buffer);
    console.log('File written successfully');

    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      message: 'File uploaded successfully' 
    });

  } catch (error: any) {
    console.error('Upload error details:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}