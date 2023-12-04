"use client"

import { Billboard, Category, Store } from '@prisma/client'
import React, { useState } from 'react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Trash, View } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BillboardSchema, BillboardSchemaType, CategorySchema, CategorySchemaType, StoreNameSchema, StoreNameSchemaType } from '@/schema/validation/formSchema'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal' 
import ImageUpload from '@/components/ui/image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BillBoardFormProps {
    category: Category | null
    billboards: Billboard[]
}

// Under [categoryId] Page

const CategoryForm = ({ category, billboards }: BillBoardFormProps) => {

    // control alert model
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams()
    const title = category ? 'Edit category' : 'Create new category'
    const description = category ? 'Edit current category' : 'Add a new category for this store'
    const action = category ? 'Edit' : 'Create'
    const toastMessage = category ? 'Category Updated.' : 'Category Created.'

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: category || {
            name: "",
            billboardId: '',
        }
    })

    // Create a New Category
    const { mutate: createCategory, isPending } = useMutation({
        mutationFn: async ({ name, billboardId } : CategorySchemaType) => {
            const values: CategorySchemaType = {
                name,
                billboardId
            }

            if(category){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, values)
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
            router.push(`/${params.storeId}/categories`)
            router.refresh();
        }
    })

    const onSubmit = (data: CategorySchemaType) => {
        const values: CategorySchemaType = {
            name: data.name,
            billboardId: data.billboardId, 
        }

        createCategory(values)
    }

    // Delete Billboard
    const { mutate: deleteCategory, isPending: deleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            return data
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                    router.push('/sign-in')
                }

                if(error.response?.status === 400){
                    toast.error("Billboard not exists.")
                }
            } else {
                toast.error("Make sure you removed all categories using this billboard.")
            }
        },
        onSuccess: () => {
            toast.success("Categories Deleted.")
            router.push(`/${params.storeId}/categories`);
            router.refresh();
        }
    })

  return (
    <>
        {/* Alert Modal */}
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteCategory()}
            loading={deleting}
        />

        <div className='flex items-center justify-between'>
            <Heading 
                title={title}
                description={description}
            />


            {category && (
                <Button variant='destructive' size='sm' onClick={() => setIsOpen(true)} disabled={deleting}>
                    <Trash className='w-5 h-5'/>
                </Button>
            )}

        </div>

        <Separator />

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
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
                                        placeholder='assign a unique category here'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='billboardId'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Billboard
                                </FormLabel>
                                <Select disabled={isPending} value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a billboard"/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {billboards.map((billboard) => (
                                            <SelectItem key={billboard.id} value={billboard.id}>
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <Button variant='ghost' className='mr-2' onClick={() => router.push(`/${params.storeId}/categories`)} type='button'>
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

export default CategoryForm