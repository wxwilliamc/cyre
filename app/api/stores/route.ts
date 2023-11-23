import { db } from "@/lib/prisma";
import { StoreNameSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const { userId } = auth();

        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const body = await req.json();
        const { name } = StoreNameSchema.parse(body);

        const newStore = await db.store.create({
            data: {
                userId,
                name
            }
        })

        return NextResponse.json({ newStore }, { status: 200 })
        
    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}