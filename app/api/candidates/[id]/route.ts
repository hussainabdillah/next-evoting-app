import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase'
import { writeFile } from 'fs/promises';
import path from 'path';

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const data = await request.json();
//   const updatedCandidate = await prisma.candidate.update({
//     where: { id: Number(params.id) },
//     data,
//   });
//   return NextResponse.json(updatedCandidate);
// }

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   const formData = await req.formData();

//   const name = formData.get("name") as string;
//   const party = formData.get("party") as string;
//   const bio = formData.get("bio") as string;
//   const file = formData.get("image") as File | null;

//   let imageUrl = undefined;

//   if (file && file.size > 0) {
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(uploadDir, fileName);

//     await writeFile(filePath, buffer);

//     imageUrl = `/uploads/${fileName}`;
//   }

//   const updatedCandidate = await prisma.candidate.update({
//     where: { id: Number(params.id) },
//     data: {
//       name,
//       party,
//       bio,
//       ...(imageUrl ? { image: imageUrl } : {}), // hanya update jika ada file baru
//     },
//   });

//   return NextResponse.json(updatedCandidate);
// }

// PUT kode untuk mengedit candidate dan gambarnya disimpan di supabase --prod
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData()

  const name = formData.get('name') as string
  const party = formData.get('party') as string
  const bio = formData.get('bio') as string
  const file = formData.get('image') as File | null

  let imageUrl = undefined

  const existingCandidate = await prisma.candidate.findUnique({
    where: { id: Number(params.id) },
  })

  if (!existingCandidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  if (file && file.size > 0) {
    // 🔁 Hapus gambar lama dari Supabase jika ada
    if (existingCandidate.image && existingCandidate.image.includes('supabase')) {
      const parts = existingCandidate.image.split('/')
      const oldFileName = parts[parts.length - 1]

      const { error: deleteError } = await supabase.storage
        .from('uploads')
        .remove([oldFileName])

      if (deleteError) {
        console.error('Gagal hapus gambar lama dari Supabase:', deleteError)
      }
    }

    // 📤 Upload gambar baru ke Supabase
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${file.name}`

    const { data, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Gagal upload ke Supabase:', uploadError)
      return NextResponse.json({ error: 'Gagal upload gambar' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName)
    imageUrl = urlData.publicUrl
  }

  // 📝 Update data di database
  const updatedCandidate = await prisma.candidate.update({
    where: { id: Number(params.id) },
    data: {
      name,
      party,
      bio,
      ...(imageUrl ? { image: imageUrl } : {}), // hanya update image jika ada file baru
    },
  })

  return NextResponse.json(updatedCandidate)
}

// DELETE method
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Ambil kandidat dulu untuk dapat URL gambar
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(params.id) },
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Hapus gambar dari Supabase jika ada
    if (candidate.image && candidate.image.includes('supabase')) {
      const parts = candidate.image.split('/')
      const fileName = parts[parts.length - 1] // nama file terakhir di URL

      const { error: deleteError } = await supabase.storage
        .from('uploads')
        .remove([fileName])

      if (deleteError) {
        console.error('Gagal hapus gambar dari Supabase:', deleteError)
      }
    }

    // Hapus dari database
    await prisma.candidate.delete({
      where: { id: Number(params.id) },
    })

    return NextResponse.json({ message: 'Candidate deleted' })
  } catch (err) {
    console.error('Gagal delete kandidat:', err)
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 })
  }
}