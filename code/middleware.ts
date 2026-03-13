import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const authToken = request.cookies.get('auth_token');
  const pathname = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ['/login', '/register'];
  
  if (!authToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
