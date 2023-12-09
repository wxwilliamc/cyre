import { db } from "@/lib/prisma";
import { BillboardSchema, ProductSchema, StoreNameSchema } from "@/schema/validation/formSchema";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Update
export const PATCH = async (req:Request, { params }: { params: { storeId: string, productId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.productId){
            return new NextResponse("ProductId is required", { status: 400 })
        }

        const body = await req.json();
        const { name,
            images,
            price,
            categoryId,
            sizeId,
            colorId,
            isFeatured,
            isArchived  } = ProductSchema.parse(body);

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

        await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                image: {
                    deleteMany: {}
                }
            }
        })

        const product = await db.product.update({
            where: {
                id:params.productId
            },
            data: {
                image: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image )
                        ]
                    }
                }
            }
        })

        return NextResponse.json({ product }, { status: 200 })
    } catch (error) {
        console.log("[PRODUCT_PATCH]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Delete
// Even the req not use in this case, but still remain cuz the params only works on 2nd not 1st
export const DELETE = async (req:Request, { params }: { params: { storeId: string, productId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.productId){
            return new NextResponse("ProductId is required", { status: 400 })
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

        const productDelete = await db.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        return NextResponse.json({ productDelete }, { status: 200 })
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

// Get Only Billboard
export const GET = async (req:Request, { params }: { params: { productId: string }}) => {
    try {

        if(!params.productId){
            return new NextResponse("ProductId is required", { status: 400 })
        }

        const product = await db.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                category: true,
                size: true,
                image: true,
                color: true,
            }
        })

        return NextResponse.json({ product }, { status: 200 })
    } catch (error) {
        console.log("[PRODUCT_GET]", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}
