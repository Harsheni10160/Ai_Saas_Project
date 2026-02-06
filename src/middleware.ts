import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    const response = NextResponse.next()

    // Workspace scoping: If user is on a /dashboard route and has no active_workspace_id cookie,
    // we should ideally set it. However, middleware cannot easily call prisma or getServerSession 
    // without significant perf impact or complex edge runtime setup.
    // Instead, we'll ensure the cookie exists or is set by the client/API.

    // Add CORS headers to all responses
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
}

export const config = {
    matcher: '/api/:path*',
}
