import { NextRequest, NextResponse } from 'next/server'
import { getMessages } from '@/lib/keystone'

export async function GET(request: NextRequest) {
    const conversationId = request.nextUrl.searchParams.get('conversationId')

    try {
        const messages = await getMessages(conversationId)
        return NextResponse.json(messages)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    } 
}