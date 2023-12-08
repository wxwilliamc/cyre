import { db } from "@/lib/prisma";
import { ColorSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Update
export const PATCH = async (req:Request, { params }: { params: { storeId: string, colorId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.colorId){
            return new NextResponse("ColorId is required", { status: 400 })
        }

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

        const colorUpdate = await db.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json({ colorUpdate }, { status: 200 })
    } catch (error) {
        console.log("[COLOR_PATCH]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Delete
// Even the req not use in this case, but still remain cuz the params only works on 2nd not 1st
export const DELETE = async (req:Request, { params }: { params: { storeId: string, colorId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.colorId){
            return new NextResponse("ColorId is required", { status: 400 })
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

        const colorDelete = await db.color.deleteMany({
            where: {
                id: params.colorId,
            }
        })

        return NextResponse.json({ colorDelete }, { status: 200 })
    } catch (error) {
        console.log("[COLOR_DELETE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Get Only Size
export const GET = async (req:Request, { params }: { params: { colorId: string }}) => {
    try {

        if(!params.colorId){
            return new NextResponse("ColorId is required", { status: 400 })
        }

        const color = await db.color.findUnique({
            where: {
                id: params.colorId,
            }
        })

        return NextResponse.json({ color }, { status: 200 })
    } catch (error) {
        console.log("[COLOR_GET]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}
