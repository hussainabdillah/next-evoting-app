import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase'
import { writeFile } from 'fs/promises';
import path from 'path';

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
    // deleting old image from Supabase if it exists
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

    // uploading new image to Supabase
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

  // update candidate data in Prisma
  const updatedCandidate = await prisma.candidate.update({
    where: { id: Number(params.id) },
    data: {
      name,
      party,
      bio,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  })

  return NextResponse.json(updatedCandidate)
}

// DELETE method
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // find candidate by ID
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(params.id) },
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // delete image from Supabase if it exists
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

    // Delete candidate from Prisma
    await prisma.candidate.delete({
      where: { id: Number(params.id) },
    })

    return NextResponse.json({ message: 'Candidate deleted' })
  } catch (err) {
    console.error('Gagal delete kandidat:', err)
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 })
  }
}