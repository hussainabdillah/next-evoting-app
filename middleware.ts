// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

// import NextAuth from 'next-auth';
// import authConfig from './auth.config';

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   if (!req.auth) {
//     const url = req.url.replace(req.nextUrl.pathname, '/');
//     return Response.redirect(url);
//   }
// });

// export const config = { matcher: ['/dashboard/:path*'] };

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const { pathname } = request.nextUrl

  // Jika user belum login dan mau ke /admin atau /dashboard
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Jika user adalah user biasa dan coba akses /admin
  if (token?.role === 'user' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Middleware aktif di path-path tertentu
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}

