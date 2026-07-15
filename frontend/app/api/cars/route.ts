import { NextRequest, NextResponse } from 'next/server'
import { fetchCars } from '@/lib/keystone'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const filters = Object.fromEntries(searchParams.entries())
    const cursor = searchParams.get('cursor')

    try {
        const page = await fetchCars(filters, cursor)
        return NextResponse.json(page)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    } 
}