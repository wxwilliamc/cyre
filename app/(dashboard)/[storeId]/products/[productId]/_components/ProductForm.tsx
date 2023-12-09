"use client"

import { Billboard, Category, Color, Image, Product, Size, Store } from '@prisma/client'
import React, { useState } from 'react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BillboardSchema, BillboardSchemaType, ProductSchema, ProductSchemaType, StoreNameSchema, StoreNameSchemaType } from '@/schema/validation/formSchema'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal' 
import ImageUpload from '@/components/ui/image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductFormProps {
    product: Product & {
        image: Image[]
    } | null
    categories: Category[]
    sizes: Size[]
    colors: Color[]
}

// Under [productId] Page

const ProductForm = ({ product, categories, sizes, colors }: ProductFormProps) => {

    // control alert model
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams()
    const title = product ? 'Edit product' : 'Create product'
    const description = product ? 'Edit current product' : 'Add a new product for this store'
    const action = product ? 'Edit' : 'Create'
    const toastMessage = product ? 'Product Updated.' : 'Product Created.'

    const form = useForm<ProductSchemaType>({
        resolver: zodResolver(ProductSchema),
        defaultValues: product ? {
            ...product,
        } : {
            name: '',
            images: [],
            price: "",
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        }
    })

    // Create a New Product
    const { mutate: createProduct, isPending } = useMutation({
        mutationFn: async ({ 
            name,
            images,
            price,
            categoryId,
            sizeId,
            colorId,
            isFeatured,
            isArchived } : ProductSchemaType) => {
            const values: ProductSchemaType = {
                name,
                images,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived
            }

            if(product){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/products`, values)
            }
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                    router.push('/sign-in')
                }

                if(error.response?.status === 400){
                    toast.error("Invalid Request. Try again.")
                }
            } else {
                toast.error("Something went wrong.")
            }
        },
        onSuccess: () => {
            toast.success(toastMessage)
            router.push(`/${params.storeId}/products`)
            router.refresh();
        }
    })

    const onSubmit = (data: ProductSchemaType) => {
        const values: ProductSchemaType = {
            name: data.name,
            images: data.images,
            price: data.price,
            categoryId: data.categoryId,
            sizeId: data.sizeId,
            colorId: data.colorId,
            isFeatured: data.isFeatured,
            isArchived: data.isArchived,
        }

        createProduct(values)
    }

    // Delete Product
    const { mutate: deleteProduct, isPending: deleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            return data
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                    router.push('/sign-in')
                }

                if(error.response?.status === 400){
                    toast.error("Product not exists.")
                }
            } else {
                toast.error("Something went wrong.")
            }
        },
        onSuccess: () => {
            toast.success("Product Deleted.")
            router.push(`/${params.storeId}/products`);
            router.refresh();
        }
    })

  return (
    <>
        {/* Alert Modal */}
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteProduct()}
            loading={deleting}
        />

        <div className='flex items-center justify-between'>
            <Heading 
                title={title}
                description={description}
            />


            {product && (
                <Button variant='destructive' size='sm' onClick={() => setIsOpen(true)} disabled={isPending}>
                    <Trash className='w-5 h-5'/>
                </Button>
            )}

        </div>

        <Separator />

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField 
                    control={form.control}
                    name='images'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Product Image
                            </FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    disable={isPending}
                                    value={field.value.map((image) => image.url )}
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url )])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='grid grid-cols-3 gap-8'>
                    <FormField 
                        control={form.control}
                        name='name'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder='Product Name'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='price'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Price
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder='9.99'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='categoryId'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Category
                                </FormLabel>
                                <Select disabled={isPending} value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='sizeId'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Size
                                </FormLabel>
                                <Select disabled={isPending} value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a size"/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {sizes.map((size) => (
                                            <SelectItem key={size.id} value={size.id}>
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='colorId'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Color
                                </FormLabel>
                                <Select disabled={isPending} value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a color"/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {colors.map((color) => (
                                            <SelectItem key={color.id} value={color.id}>
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='isFeatured'
                        render={({field}) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>

                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Featured
                                    </FormLabel>
                                    <FormDescription>
                                        This product will available list on homepage.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='isArchived'
                        render={({field}) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>

                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Archived
                                    </FormLabel>
                                    <FormDescription>
                                        This product will not be appear anywhere in the store.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                </div>
                
                <Button variant='ghost' className='mr-2' onClick={() => router.push(`/${params.storeId}/billboards`)} type='button'>
                    Cancel
                </Button>

                <Button disabled={isPending} className='ml-auto' type='submit'>
                    {action}
                </Button>
            </form>
        </Form>
    </>
  )
}

export default ProductForm