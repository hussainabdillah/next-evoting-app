// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const { pathname } = request.nextUrl

  // Jika user belum login dan mau ke /admin atau /dashboard
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Jika user adalah user biasa dan coba akses /admin
  if (token?.role === 'user' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Jika admin mencoba akses /dashboard
  if (token?.role === 'admin' && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

// Middleware aktif di path-path tertentu
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}

