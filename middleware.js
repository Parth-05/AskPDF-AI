import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public and protected routes
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  console.log(`Middleware triggered for: ${req.nextUrl.pathname}`);
  const { nextUrl } = req;

  // Redirect "/" to "/dashboard" if logged in
  // if (nextUrl.pathname === '/') {
  //   const user = auth.userId; // Check if the user is logged in
  //   if (user) {
  //     return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  //   }
  // }

  // Protect all routes except public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  // You don't need separate logic for protected routes since they're implicitly handled
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
