"use client"

import { Color } from '@prisma/client'
import React, { useState } from 'react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColorSchema, ColorSchemaType, SizeSchema, SizeSchemaType } from '@/schema/validation/formSchema'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal' 

interface SizeFormProps {
    color: Color | null
}

// Under [colorId] Page

const SizeForm = ({ color }: SizeFormProps) => {

    // control alert model
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const params = useParams()
    const title = color ? 'Edit color' : 'Create color'
    const description = color ? 'Edit current color' : 'Add a new color for this store'
    const action = color ? 'Edit' : 'Create'
    const toastMessage = color ? 'Color Updated.' : 'Color Created.'

    const form = useForm<ColorSchemaType>({
        resolver: zodResolver(ColorSchema),
        defaultValues: color || {
            name: "",
            value: '',
        }
    })

    // Create a New Size
    const { mutate: createColor, isPending } = useMutation({
        mutationFn: async ({ name, value } : ColorSchemaType) => {
            const values: ColorSchemaType = {
                name,
                value
            }

            if(color){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/colors`, values)
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
            router.push(`/${params.storeId}/colors`)
            router.refresh();
        }
    })

    const onSubmit = (data: SizeSchemaType) => {
        const values: SizeSchemaType = {
            name: data.name,
            value: data.value
        }

        createColor(values)
    }

    // Delete Size
    const { mutate: deleteColor, isPending: deleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/colors/${params.sizeId}`)
            return data
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                    router.push('/sign-in')
                }

                if(error.response?.status === 400){
                    toast.error("Size not exists.")
                }
            } else {
                toast.error("Make sure you removed all products using this color.")
            }
        },
        onSuccess: () => {
            toast.success("Color Deleted.")
            router.push(`/${params.storeId}/colors`);
            router.refresh();
        }
    })

  return (
    <>
        {/* Alert Modal */}
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteColor()}
            loading={deleting}
        />

        <div className='flex items-center justify-between'>
            <Heading 
                title={title}
                description={description}
            />


            {color && (
                <Button variant='destructive' size='sm' onClick={() => setIsOpen(true)} disabled={isPending}>
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
                                        placeholder='Color name'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name='value'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Value
                                </FormLabel>
                                <FormControl>
                                    <div className='flex items-center gap-x-4'>

                                        <Input 
                                            {...field}
                                            placeholder='Color value'
                                            disabled={isPending}
                                        />

                                        <div className='border p-4 rounded-full' style={{ backgroundColor: field.value }}/>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <Button variant='ghost' className='mr-2' onClick={() => router.push(`/${params.storeId}/colors`)} type='button'>
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

export default SizeForm