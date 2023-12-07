"use client"

import { Size } from '@prisma/client'
import React, { useState } from 'react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SizeSchema, SizeSchemaType } from '@/schema/validation/formSchema'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal' 

interface SizeFormProps {
    size: Size | null
}

// Under [sizeId] Page

const SizeForm = ({ size }: SizeFormProps) => {

    // control alert model
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const params = useParams()
    const title = size ? 'Edit size' : 'Create size'
    const description = size ? 'Edit current size' : 'Add a new size for this store'
    const action = size ? 'Edit' : 'Create'
    const toastMessage = size ? 'Size Updated.' : 'Size Created.'

    const form = useForm<SizeSchemaType>({
        resolver: zodResolver(SizeSchema),
        defaultValues: size || {
            name: "",
            value: '',
        }
    })

    // Create a New Size
    const { mutate: createSize, isPending } = useMutation({
        mutationFn: async ({ name, value } : SizeSchemaType) => {
            const values: SizeSchemaType = {
                name,
                value
            }

            if(size){
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, values)
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
            router.push(`/${params.storeId}/sizes`)
            router.refresh();
        }
    })

    const onSubmit = (data: SizeSchemaType) => {
        const values: SizeSchemaType = {
            name: data.name,
            value: data.value
        }

        createSize(values)
    }

    // Delete Size
    const { mutate: deleteSize, isPending: deleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
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
                toast.error("Make sure you removed all products using this size.")
            }
        },
        onSuccess: () => {
            toast.success("Size Deleted.")
            router.push(`/${params.storeId}/sizes`);
            router.refresh();
        }
    })

  return (
    <>
        {/* Alert Modal */}
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteSize()}
            loading={deleting}
        />

        <div className='flex items-center justify-between'>
            <Heading 
                title={title}
                description={description}
            />


            {size && (
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
                                        placeholder='Size name'
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
                                    <Input 
                                        {...field}
                                        placeholder='Size value'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <Button variant='ghost' className='mr-2' onClick={() => router.push(`/${params.storeId}/sizes`)} type='button'>
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