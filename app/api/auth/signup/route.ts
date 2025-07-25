// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

// Helper for UMS student email
function isValidUMSStudentEmail(email: string): boolean {
  return /^[a-l]\d{9}@student\.ums\.ac\.id$/.test(email);
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  // Email validation
  if (!isValidUMSStudentEmail(email)) {
    return NextResponse.json({ message: 'Email must be a valid UMS student email (e.g. l200210200@student.ums.ac.id)' }, { status: 400 });
  }

  // Password validation
  if (password.length < 6) {
    return NextResponse.json({ message: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  // Generate verification token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 Hours
  
  const hashedPassword = await hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'user', // default role is user
      status: 'Verified', // default is not verified, but for testing purpose make it verified
      emailVerified: null,
      verificationToken: token,
      verificationTokenExpiry: tokenExpires
    },
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, token);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Optionally, you can delete the user if email sending fails
    await prisma.user.delete({ where: { id: newUser.id } });
    return NextResponse.json({ message: 'Failed to send verification email' }, { status: 500 });
  }
  

  return NextResponse.json({ message: 'User created please check your email to verify your account.', user: newUser }, { status: 201 });
}
