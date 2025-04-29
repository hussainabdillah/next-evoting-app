// app/api/candidates/route.ts
import { prisma } from '@/lib/prisma'; // Pastikan prisma di-setup dengan benar
import { NextResponse } from 'next/server';

// GET
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany(); // Ambil semua data candidates
    return NextResponse.json(candidates); // Mengirimkan data sebagai response JSON
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST
export async function POST(request: Request) {
    const data = await request.json();
    const newCandidate = await prisma.candidate.create({
      data: {
        name: data.name,
        party: data.party,
        image: data.image,
        bio: data.bio,
      },
    });
    return NextResponse.json(newCandidate, { status: 201 });
  }
