"use client"

import { Store } from '@prisma/client'
import React, { useState } from 'react'
import Heading from './ui/heading'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import { Separator } from './ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StoreNameSchema, StoreNameSchemaType } from '@/schema/validation/formSchema'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import AlertModal from './modals/alert-modal'
import ApiAlert from './ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'

interface SettingFormProps {
    store: Store
}

// Under Settings Page

const SettingForm = ({ store }: SettingFormProps) => {

    // control alert model
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const origin = useOrigin();

    const form = useForm<StoreNameSchemaType>({
        resolver: zodResolver(StoreNameSchema),
        defaultValues: store
    })

    const { mutate: updateStore, isPending } = useMutation({
        mutationFn: async ({ name } : StoreNameSchemaType) => {
            const values: StoreNameSchemaType = {
                name
            }

            const { data } = await axios.patch(`/api/stores/${store.id}`, values)
            return data
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                    router.push('/sign-in')
                }

                if(error.response?.status === 400){
                    toast.error("Please provide StoreId / Store Name to continue.")
                }
            } else {
                toast.error("Something went wrong.")
            }
        },
        onSuccess: () => {
            toast.success("Store Updated.")
            router.refresh();
        }
    })

    const onSubmit = (data: StoreNameSchemaType) => {
        const values: StoreNameSchemaType = {
            name: data.name
        }

        updateStore(values)
    }

    const { mutate: deleteStore, isPending: deleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/stores/${store.id}`)
            return data
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                    router.push('/sign-in')
                }

                if(error.response?.status === 400){
                    toast.error("Store not exists.")
                }
            } else {
                toast.error("Make sure you removed all products and categories first.")
            }
        },
        onSuccess: () => {
            toast.success("Store Deleted.")
            router.refresh();
            router.push('/');
        }
    })

  return (
    <>
        {/* Alert Modal */}
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteStore()}
            loading={deleting}
        />

        <div className='flex items-center justify-between'>
            <Heading 
                title="Settings"
                description="Manage store preferences"
            />

            <Button variant='destructive' size='sm' onClick={() => setIsOpen(true)} disabled={isPending}>
                <Trash className='w-5 h-5'/>
            </Button>
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
                                        placeholder='Store name...'
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button disabled={isPending} className='ml-auto' type='submit'>
                    Save Changes
                </Button>
            </form>
        </Form>

        <Separator />

        <ApiAlert 
            title='NEXT_PUBLIC_API_URL'
            description={`${origin}/api/${store.id}`}
            variant='public'
        />

    </>
  )
}

export default SettingForm