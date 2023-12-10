import * as z from 'zod'

// Validation
export const StoreNameSchema = z.object({
    name: z.string().min(1),
})

export type StoreNameSchemaType = z.infer<typeof StoreNameSchema>

export const BillboardSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

export type BillboardSchemaType = z.infer<typeof BillboardSchema>

export const CategorySchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
})

export type CategorySchemaType = z.infer<typeof CategorySchema>

export const SizeSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

export type SizeSchemaType = z.infer<typeof SizeSchema>

export const ColorSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid color(hex) code"
    }),
})

export type ColorSchemaType = z.infer<typeof ColorSchema>

export const ProductSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

export type ProductSchemaType = z.infer<typeof ProductSchema>