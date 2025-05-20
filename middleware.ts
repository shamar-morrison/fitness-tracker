import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not signed in and the route is protected, redirect to login
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/workouts') ||
    req.nextUrl.pathname.startsWith('/progress') ||
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/templates') ||
    req.nextUrl.pathname.startsWith('/stats');

  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');

  if (session && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workouts/:path*',
    '/progress/:path*',
    '/profile/:path*',
    '/templates/:path*',
    '/stats/:path*',
    '/auth/:path*',
  ],
};
