import { db } from "@/lib/prisma";
import { BillboardSchema, CategorySchema, SizeSchema, StoreNameSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Update
export const PATCH = async (req:Request, { params }: { params: { storeId: string, sizeId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.sizeId){
            return new NextResponse("SizeId is required", { status: 400 })
        }

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

        const sizeUpdate = await db.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json({ sizeUpdate }, { status: 200 })
    } catch (error) {
        console.log("[SIZE_PATCH]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Delete
// Even the req not use in this case, but still remain cuz the params only works on 2nd not 1st
export const DELETE = async (req:Request, { params }: { params: { storeId: string, sizeId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.sizeId){
            return new NextResponse("SizeId is required", { status: 400 })
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

        const sizeDelete = await db.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        })

        return NextResponse.json({ sizeDelete }, { status: 200 })
    } catch (error) {
        console.log("[SIZE_DELETE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Get Only Size
export const GET = async (req:Request, { params }: { params: { sizeId: string }}) => {
    try {

        if(!params.sizeId){
            return new NextResponse("SizeId is required", { status: 400 })
        }

        const size = await db.size.findUnique({
            where: {
                id: params.sizeId,
            }
        })

        return NextResponse.json({ size }, { status: 200 })
    } catch (error) {
        console.log("[SIZE_GET]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}
