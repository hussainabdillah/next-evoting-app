import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const count = await prisma.user.count({
      where: {
        role: 'user'
      }
    })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching voters:', error)
    return NextResponse.json({ error: 'Failed to fetch voters' }, { status: 500 })
  }
}
