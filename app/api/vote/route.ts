import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

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

  // Di sini seharusnya kamu juga menyimpan data vote ke database
  // Tapi karena kamu menggunakan Smart Contract, kita hanya update status

  await prisma.user.update({
    where: { id: user.id },
    data: { hasVoted: true },
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
