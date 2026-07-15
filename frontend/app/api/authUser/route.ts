import { NextRequest, NextResponse } from 'next/server'
import { getAuthedUser } from '@/lib/keystone'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const authedUser = await getAuthedUser()
        return NextResponse.json(authedUser)
    } catch (error) {
        console.error('Error fetching authenticated user:', error)
        return NextResponse.json({ error: 'Failed to fetch authenticated user' }, { status: 500 })
    }
}