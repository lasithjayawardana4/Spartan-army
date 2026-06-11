import { NextResponse } from 'next/server';
import { verifySession } from '@/app/admin/actions';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    // 1. Verify admin session
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or invalid file format' }, { status: 400 });
    }

    // 3. Read buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Ensure public/uploads exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate secure filename safely
    const originalName = (file as any).name || 'upload.png';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(sanitizedName) || '.png';
    const base = path.basename(sanitizedName, ext) || 'image';
    
    // Preserve original extension
    const safeExt = ext.toLowerCase();
    const fileName = `${base}_${Date.now()}${safeExt}`;
    const filePath = path.join(uploadDir, fileName);

    // 5. Write to disk
    await fs.writeFile(filePath, buffer);

    // Return the relative URL matching next.js public server path
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${fileName}` 
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
