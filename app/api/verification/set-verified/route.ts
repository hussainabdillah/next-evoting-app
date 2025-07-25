import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nim } = await req.json();
    if (!nim) {
      return NextResponse.json({ error: 'NIM is required' }, { status: 400 });
    }
    // Update status user: cari user dengan email = nim + '@student.com' (atau sesuaikan field unik lain)
    // Jika ingin update by nim, tambahkan field nim ke model User
    const user = await prisma.user.updateMany({
      where: { email: nim.toLowerCase() + '@student.ums.ac.id' },
      data: { status: 'Verified' },
    });
    if (user.count === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
