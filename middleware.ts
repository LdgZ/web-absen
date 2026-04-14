import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. Define Public Routes (Pages & APIs)
  const isPublicPage = pathname === '/login' || pathname === '/register';
  const isPublicApi = pathname === '/api/auth/login' || pathname === '/api/health' || pathname === '/api/debug/schema';
  
  // 2. Allow public routes
  if (isPublicPage || isPublicApi) {
    // If logged in and trying to access login page, redirect to dashboard
    if (authToken && isPublicPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 3. Security Check: If no token
  if (!authToken) {
    // For API requests, return 401 Unauthorized instead of redirect
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    // For Page requests, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Guard everything except static files and standard Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
