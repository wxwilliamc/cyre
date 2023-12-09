import { db } from "@/lib/prisma"
import { BillboardSchema, ProductSchema } from "@/schema/validation/formSchema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {
        const { userId } = auth()

        if(!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const body = await req.json();
        const { name,
            images,
            price,
            categoryId,
            sizeId,
            colorId,
            isFeatured,
            isArchived  } = ProductSchema.parse(body);

        if(!images || !images.length ) {
            return new NextResponse("Image is required", { status: 400 })
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

        const newProduct = await db.product.create({
            data:{
                name,
                image: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId
            },
        })

        return NextResponse.json({ newProduct }, { status: 200 })
    } catch (error) {
        console.log("[PRODUCT_POST]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}

// Get All Products
export const GET = async (req: Request, { params }: { params: { storeId: string }}) => {
    try {

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const colorId = searchParams.get('colorId') || undefined
        const sizeId = searchParams.get('sizeId') || undefined
        const isFeatured = searchParams.get('isFeatured')
       
        if(!params.storeId) return new NextResponse("StoreId is required.", { status: 400})

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                category: true,
                size: true,
                color: true,
                image: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ products }, { status: 200 })
    } catch (error) {
        console.log("[PRODUCTS_GET]", error)
        return new NextResponse('INTERNAL_ERROR', { status: 500 })
    }
}