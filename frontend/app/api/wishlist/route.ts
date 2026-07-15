import { NextResponse } from 'next/server'
import { getWishlist } from '@/lib/keystone'

export async function GET() {
    try {
        const wishlist = await getWishlist()
        return NextResponse.json(wishlist)
    } catch (error) {
        console.error('Error fetching authenticated user:', error)
        return NextResponse.json({ error: 'Failed to fetch authenticated user' }, { status: 500 })
    }
}