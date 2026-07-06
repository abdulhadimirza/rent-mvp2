import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/middleware';

export async function proxy(request: NextRequest) {
    // Delegate session refresh and auth guards to the helper
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/inngest, x/inngest, .netlify/functions/inngest, .redwood/functions/inngest
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - All assets ending in common extensions (svg, png, jpg, etc.)
         */
        '/((?!api/inngest|x/inngest|\\.netlify/functions/inngest|\\.redwood/functions/inngest|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
