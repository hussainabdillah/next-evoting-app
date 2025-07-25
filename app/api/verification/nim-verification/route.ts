import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nim } = await req.json();
    if (!nim) {
      return NextResponse.json({ error: 'NIM is required' }, { status: 400 });
    }
    const voter = await prisma.eligibleVoter.findUnique({ where: { nim } });
    if (!voter) {
      return NextResponse.json({ isRegistered: false });
    }
    return NextResponse.json({
      isRegistered: true,
      name: voter.name,
      faculty: voter.faculty,
      nim: voter.nim,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
