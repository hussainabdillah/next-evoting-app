import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// POST change user vote status
// This is used to update the user's voting status after they have voted.
export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { candidateId } = body

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.hasVoted) {
    return NextResponse.json({ error: 'User has already voted' }, { status: 403 })
  }

  // Di sini saya tidak menyimpan data vote ke database
  // Karena saya menggunakan Smart Contract, jadi hanya update status user

  await prisma.user.update({
    where: { id: user.id },
    data: { hasVoted: true },
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
