import { NextResponse } from 'next/server';

export function middleware(request) {
    const auth = request.cookies.get('auth');

    if (!auth && request.nextUrl.pathname.startsWith('/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/register',
}; 