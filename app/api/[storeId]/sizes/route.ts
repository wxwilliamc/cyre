import { db } from "@/lib/prisma"
import { SizeSchema } from "@/schema/validation/formSchema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
        const { userId } = auth()

        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const body = await req.json();
        const { name, value } = SizeSchema.parse(body);

        // To avoid user steal others's user storeId and try to make changes on it
        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        
        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const newSize = await db.size.create({
            data:{
                name,
                value,
                storeId: params.storeId
            },
        })

        return NextResponse.json({ newSize }, { status: 200 })
    } catch (error) {
        console.log("[SIZE_POST]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}

// Get All Sizes
export const GET = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
       
        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const sizes = await db.size.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json({ sizes }, { status: 200 })
    } catch (error) {
        console.log("[SIZES_GET]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}