// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 })
  }

  const hashedPassword = await hash(password, 10)
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'user', // default role
    },
  })

  return NextResponse.json({ message: 'User created', user: newUser }, { status: 201 })
}
