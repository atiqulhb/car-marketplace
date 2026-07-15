import { NextRequest, NextResponse } from "next/server"
import { getConversations } from '@/lib/keystone'

export async function GET(request: NextRequest) {
    console.log('inside api/conversations')
    try {
        const conversations = await getConversations()
        console.log('conversations list from api/conversations', conversations)
        return NextResponse.json(conversations)
    } catch (error) {
        console.error(error.message)
        return NextResponse.json({ error: 'Error getting conversations'}, { status: 500 })
    }
}