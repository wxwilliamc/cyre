
import { db } from "@/lib/prisma";
import { StoreNameSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Update
export const PATCH = async (req:Request, { params }: { params: { storeId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        if(!params.storeId){
            return new NextResponse("StoreId is required", { status: 400 })
        }

        const body = await req.json();
        const { name } = StoreNameSchema.parse(body);

        if(!name) return new NextResponse("Store name is required", { status: 400 })

        const storeUpdate = await db.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json({ storeUpdate }, { status: 200 })
    } catch (error) {
        console.log("[STORE_UPDATE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Delete
// Even the req not use in this case, but still remain cuz the params only works on 2nd not 1st
export const DELETE = async (req:Request, { params }: { params: { storeId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        if(!params.storeId){
            return new NextResponse("StoreId is required", { status: 400 })
        }

        const storeDelete = await db.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        })

        return NextResponse.json({ storeDelete }, { status: 200 })
    } catch (error) {
        console.log("[STORE_DELETE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}
