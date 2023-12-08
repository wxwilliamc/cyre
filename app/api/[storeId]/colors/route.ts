import { db } from "@/lib/prisma"
import { ColorSchema, SizeSchema } from "@/schema/validation/formSchema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
        const { userId } = auth()

        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const body = await req.json();
        const { name, value } = ColorSchema.parse(body);

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

        const newColor = await db.color.create({
            data:{
                name,
                value,
                storeId: params.storeId
            },
        })

        return NextResponse.json({ newColor }, { status: 200 })
    } catch (error) {
        console.log("[COLOR_POST]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}

// Get All Sizes
export const GET = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
       
        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const colors = await db.color.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json({ colors }, { status: 200 })
    } catch (error) {
        console.log("[COLORS_GET]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}