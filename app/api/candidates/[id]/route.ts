import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updatedCandidate = await prisma.candidate.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updatedCandidate);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.candidate.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: 'Candidate deleted' });
}
