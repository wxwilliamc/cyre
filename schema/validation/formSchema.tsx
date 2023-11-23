import * as z from 'zod'

// Validation
export const StoreNameSchema = z.object({
    name: z.string().min(1),
})

export type StoreNameSchemaType = z.infer<typeof StoreNameSchema>