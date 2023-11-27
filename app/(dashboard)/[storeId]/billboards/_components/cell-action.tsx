'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./column"
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { useState } from "react";

interface CellActionProps {
    data: BillboardColumn;
}

const CellAction = ({ data }: CellActionProps) => {

    const router = useRouter();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(data.id)
        toast.success("Copied to clipboard.")
    }

    // Delete Billboard
    const { mutate: deleteBillboard, isPending: deleting } = useMutation({
        mutationFn: async () => {
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
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
        }
    })

  return (
    <>
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => deleteBillboard()}
            loading={deleting}
        />

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="h-8 w-8 p-0">
                    <span className="sr-only">
                        Open Menu
                    </span>
                    <MoreHorizontal className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                    <Edit className="w-4 h-4 mr-2"/>
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyCode}>
                    <Copy className="w-4 h-4 mr-2"/>
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                    <Trash className="w-4 h-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}

export default CellAction