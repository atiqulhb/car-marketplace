import { getAllBrands, getModels } from "@/lib/keystone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
    const { type } = await params
    const { searchParams } = request.nextUrl

    const cursor = searchParams.get('cursor')
    const brandId = searchParams.get('brandId') as string
    
    function resolveFilter(type) {
        switch (type) {
            case 'brands':
                return getAllBrands(cursor)
            case 'models':
                return getModels(brandId)
            default:
                throw new Error('Unhandled filter type')
        }
    }

    try {
        const data = await resolveFilter(type)
        console.log(data)
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}