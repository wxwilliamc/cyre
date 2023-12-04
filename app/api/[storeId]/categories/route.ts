import { db } from "@/lib/prisma"
import { BillboardSchema, CategorySchema } from "@/schema/validation/formSchema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
        const { userId } = auth()

        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const body = await req.json();
        const { name, billboardId } = CategorySchema.parse(body);

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

        const newCategory = await db.category.create({
            data:{
                name,
                billboardId,
                storeId: params.storeId
            },
        })

        return NextResponse.json({ newCategory }, { status: 200 })
    } catch (error) {
        console.log("[CATEGORY_POST]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}

// Get All Categories
export const GET = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
       
        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json({ categories }, { status: 200 })
    } catch (error) {
        console.log("[CATEGORIES_GET]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}