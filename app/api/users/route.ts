import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";

// Helper function untuk validasi NIM
const validateUMSEmail = (email: string): { isValid: boolean; error?: string } => {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  // Extract NIM from email
  const emailParts = email.split('@');
  if (emailParts.length !== 2) {
    return { isValid: false, error: "Invalid email format." };
  }

  const nim = emailParts[0];
  const domain = emailParts[1];

  // Check domain
  if (domain !== 'student.ums.ac.id') {
    return { isValid: false, error: "Email must use @student.ums.ac.id domain." };
  }

  // Check NIM length (must be exactly 10 characters)
  if (nim.length !== 10) {
    return { isValid: false, error: "Student number must be exactly 10 characters." };
  }

  // Check first character (must be a-l)
  const firstChar = nim[0].toLowerCase();
  if (!/^[a-l]$/.test(firstChar)) {
    return { isValid: false, error: "Student number must start with letter a-l." };
  }

  // Check remaining 9 characters (must be digits)
  const numbers = nim.slice(1);
  if (!/^\d{9}$/.test(numbers)) {
    return { isValid: false, error: "Student number must have 9 digits after the first letter." };
  }

  return { isValid: true };
};

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        walletAddress: true,
        status: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create a new user by admin: must be email student ums
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Validasi format email UMS
    const emailValidation = validateUMSEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json({ 
        error: emailValidation.error 
      }, { status: 400 });
    }

    // Validasi password
    if (password.length < 6) {
      return NextResponse.json({ 
        error: "Password must be at least 6 characters long." 
      }, { status: 400 });
    }

    // Cek apakah email sudah digunakan
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: "Email already exists. Please use a different email." 
      }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
        status: "Verified" // Default status user if created by admin
      },
    });    

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle Prisma unique constraint error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ 
        error: "Email already exists. Please use a different email." 
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}