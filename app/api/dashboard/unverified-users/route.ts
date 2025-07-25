import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Count users with status 'Not Verified' or 'Unverified'
    const unverifiedCount = await prisma.user.count({
      where: {
        OR: [
          { status: 'Not Verified' },
          { status: 'Unverified' },
          { status: { not: 'Verified' } }
        ]
      }
    });

    return NextResponse.json({ 
      count: unverifiedCount,
      message: 'Unverified users count retrieved successfully'
    });
  } catch (error) {
    console.error('Failed to fetch unverified users count:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        count: 0 
      }, 
      { status: 500 }
    );
  }
}
