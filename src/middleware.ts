import { NextResponse } from 'next/server';

/**
 * Passthrough. When Clerk keys are set, prefer wrapping with clerkMiddleware
 * (see Clerk docs). Without keys the app stays fully public; SSO UI shows setup guidance.
 */
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
