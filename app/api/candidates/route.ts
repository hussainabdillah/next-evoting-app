import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'

// GET
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany();
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST kandidat baru dengan upload gambar disimpan di supabase --prod
export async function POST(request: Request) {
  const formData = await request.formData()

  const name = formData.get('name') as string
  const party = formData.get('party') as string
  const bio = formData.get('bio') as string
  const file = formData.get('image') as File

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, buffer, {
      contentType: file.type,
    })

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`

  const newCandidate = await prisma.candidate.create({
    data: {
      name,
      party,
      bio,
      image: imageUrl,
    },
  })

  return NextResponse.json(newCandidate, { status: 201 })
}