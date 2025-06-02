// app/api/candidates/route.ts
import { prisma } from '@/lib/prisma'; // Pastikan prisma di-setup dengan benar
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabase'

// GET
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany(); // Ambil semua data candidates
    return NextResponse.json(candidates); // Mengirimkan data sebagai response JSON
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST
// export async function POST(request: Request) {
//     const data = await request.json();
//     const newCandidate = await prisma.candidate.create({
//       data: {
//         name: data.name,
//         party: data.party,
//         image: data.image,
//         bio: data.bio,
//       },
//     });
//     return NextResponse.json(newCandidate, { status: 201 });
//   }

// POST kandidat baru dengan upload gambar disimpan di uploads/public --dev
// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();

//     const name = formData.get('name') as string;
//     const party = formData.get('party') as string;
//     const bio = formData.get('bio') as string;
//     const file = formData.get('image') as File;

//     if (!file || typeof file === 'string') {
//       return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

//     await writeFile(filePath, buffer);

//     const newCandidate = await prisma.candidate.create({
//       data: {
//         name,
//         party,
//         bio,
//         image: `/uploads/${fileName}`, // URL yang bisa diakses publik
//       },
//     });

//     return NextResponse.json(newCandidate, { status: 201 });
//   } catch (error) {
//     console.error('Error creating candidate:', error);
//     return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
//   }
// }

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

  // simpan ke prisma atau db
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