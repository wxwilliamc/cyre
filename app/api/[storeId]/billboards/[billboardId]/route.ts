import { db } from "@/lib/prisma";
import { BillboardSchema, StoreNameSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Update
export const PATCH = async (req:Request, { params }: { params: { storeId: string, billboardId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.billboardId){
            return new NextResponse("BillboardId is required", { status: 400 })
        }

        const body = await req.json();
        const { imageUrl, label } = BillboardSchema.parse(body);

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

        const billboardUpdate = await db.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json({ billboardUpdate }, { status: 200 })
    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Delete
// Even the req not use in this case, but still remain cuz the params only works on 2nd not 1st
export const DELETE = async (req:Request, { params }: { params: { storeId: string, billboardId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.billboardId){
            return new NextResponse("BillboardId is required", { status: 400 })
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

        const billboardDelete = await db.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        })

        return NextResponse.json({ billboardDelete }, { status: 200 })
    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Get Only Billboard
export const GET = async (req:Request, { params }: { params: { billboardId: string }}) => {
    try {

        if(!params.billboardId){
            return new NextResponse("BillboardId is required", { status: 400 })
        }

        const billboard = await db.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        })

        return NextResponse.json({ billboard }, { status: 200 })
    } catch (error) {
        console.log("[BILLBOARD_GET]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}
