"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "@/components/Modal"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from 'axios'
import toast from "react-hot-toast";
import { StoreNameSchema, StoreNameSchemaType } from "@/schema/validation/formSchema";

export const StoreModal = () => {

    const storeModal = useStoreModal();

    const form = useForm<StoreNameSchemaType>({
        resolver: zodResolver(StoreNameSchema),
        defaultValues: {
            name: ''
        }
    })

    const { mutate: createStore, isPending } = useMutation({
        mutationFn: async ({ name }: StoreNameSchemaType) => {
            const values: StoreNameSchemaType = {
                name
            }

            const { data } = await axios.post('/api/stores', values)
            return data;
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 401){
                    toast.error("Please Login.")
                }

                if(error.response?.status === 500){
                    toast.error("Something wrong with the request. Try again later.")
                }
            } else {
                return toast.error("Something went wrong...")
            }
        },
        onSuccess: () => {
            return toast.success("Store Name Registered.")
        }
    })

    const onSubmit = (data: StoreNameSchemaType) => {
        const values: StoreNameSchemaType = {
            name: data.name
        }

        createStore(values)
    }

    return (

        <Modal 
            title="Create a store" 
            description="Add a new store to manage products and categories" 
            isOpen={storeModal.isOpen} 
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="E-Commerce"
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button variant='ghost' onClick={storeModal.onClose} disabled={isPending}>
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={isPending}>
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}