import { getAllBrands, getModels } from "@/lib/keystone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string | string[] }> }) {
    const { type } = await params
    const { searchParams } = request.nextUrl

    const cursor = searchParams.get('cursor') as string
    const brandParam = searchParams.get('brand') as string
    const brand = brandParam ? brandParam.split(',').filter(Boolean) : []

    console.log("brand as string from filters api route", brandParam)
    console.log("brand from string back to array from filters api route", brand)
    
    function resolveFilter(type) {
        switch (type) {
            case 'brands':
                return getAllBrands(cursor)
            case 'models':
                return getModels(brand)
            default:
                throw new Error('Unhandled filter type')
        }
    }

    try {
        const data = await resolveFilter(type)
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}