"use client"

import { Billboard, Store } from '@prisma/client'
import React, { useState } from 'react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BillboardSchema, BillboardSchemaType, StoreNameSchema, StoreNameSchemaType } from '@/schema/validation/formSchema'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal' 
import ApiAlert from '@/components/ui/api-alert' 
import { useOrigin } from '@/hooks/use-origin'
import ImageUpload from '@/components/ui/image-upload'

interface BillBoardFormProps {
    billBoard: Billboard | null
}

// Under [billboardId] Page

const BillBoardForm = ({ billBoard }: BillBoardFormProps) => {

    // control alert model
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams()
    const title = billBoard ? 'Edit billboard' : 'Create billboard'
    const description = billBoard ? 'Edit current billboard' : 'Add a new billboard for this store'
    const action = billBoard ? 'Edit' : 'Create'
    const toastMessage = billBoard ? 'Billboard Updated.' : 'Billboard Created.'

    const form = useForm<BillboardSchemaType>({
        resolver: zodResolver(BillboardSchema),
        defaultValues: billBoard || {
            label: "",
            imageUrl: '',
        }
    })

    // Create a New Billboard
    const { mutate: createBillboard, isPending } = useMutation({
        mutationFn: async ({ label, imageUrl } : BillboardSchemaType) => {
            const values: BillboardSchemaType = {
                label,
                imageUrl
            }

            if(billBoard){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values)
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
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
        }
    })

    const onSubmit = (data: BillboardSchemaType) => {
        const values: BillboardSchemaType = {
            label: data.label,
            imageUrl: data.imageUrl,
        }

        createBillboard(values)
    }

    // Delete Billboard
    const { mutate: deleteBillboard, isPending: deleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
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
            toast.success("Billboard Deleted.")
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
        }
    })

  return (
    <>
        {/* Alert Modal */}
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteBillboard()}
            loading={deleting}
        />

        <div className='flex items-center justify-between'>
            <Heading 
                title={title}
                description={description}
            />


            {billBoard && (
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
                    name='imageUrl'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Background Image
                            </FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    disable={isPending}
                                    value={field.value ? [field.value] : []}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='grid grid-cols-3 gap-8'>
                    <FormField 
                        control={form.control}
                        name='label'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Label
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder='Billboard label...'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
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

        <Separator />

        

    </>
  )
}

export default BillBoardForm