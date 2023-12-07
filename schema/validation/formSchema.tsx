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