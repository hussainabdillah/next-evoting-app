// app/api/candidates/route.ts
import { prisma } from '@/lib/prisma'; // Pastikan prisma di-setup dengan benar
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany(); // Ambil semua data candidates
    return NextResponse.json(candidates); // Mengirimkan data sebagai response JSON
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}
