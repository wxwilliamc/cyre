import { db } from "@/lib/prisma";
import { BillboardSchema, CategorySchema, StoreNameSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Update
export const PATCH = async (req:Request, { params }: { params: { storeId: string, categoryId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.categoryId){
            return new NextResponse("CategoryId is required", { status: 400 })
        }

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

        const categoryUpdate = await db.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json({ categoryUpdate }, { status: 200 })
    } catch (error) {
        console.log("[CATEGORY_PATCH]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Delete
// Even the req not use in this case, but still remain cuz the params only works on 2nd not 1st
export const DELETE = async (req:Request, { params }: { params: { storeId: string, categoryId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.categoryId){
            return new NextResponse("CategoryId is required", { status: 400 })
        }

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

        const categoryDelete = await db.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json({ categoryDelete }, { status: 200 })
    } catch (error) {
        console.log("[CATEGORY_DELETE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Get Only Category
export const GET = async (req:Request, { params }: { params: { categoryId: string }}) => {
    try {

        if(!params.categoryId){
            return new NextResponse("CategoryId is required", { status: 400 })
        }

        const category = await db.category.findUnique({
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json({ category }, { status: 200 })
    } catch (error) {
        console.log("[CATEGORY_GET]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}
