import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PUT update user status vote by admin
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
