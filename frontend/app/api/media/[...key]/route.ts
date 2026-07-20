import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params } ) {
    const { key } = await params

    console.log('key', key)

    const path = key.join('/')

    console.log('path', path)

    if (path.includes('..')) {
        return new Response('Invalid path', { status: 400 })
    }

    const upstream = await fetch(`http://localhost:3000/${path}`, {
        next: { revalidate: 60 * 60 * 24 * 30 }
    })

    if (!upstream.ok || !upstream.body) {
        return new Response('Not found, { status: 404 }')
    }

    return new Response(upstream.body, {
        headers: {
            'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
            'Content-Length': upstream.headers.get('content-length') ?? '',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    })

}