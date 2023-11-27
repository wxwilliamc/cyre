"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

// under Billboards Page

const BillboardClient = () => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
        <div className="flex items-center justify-between">
            {/* TODO: Display current billboard values */}
            <Heading 
                title="Billboards"
                description="Manage billboards for your store"
            />

            <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                <Plus className="w-4 h-4 mr-2"/>
                Add New
            </Button>

            {/* TODO: Display Billboards */}
        </div>

        <Separator />
    </>
  )
}

export default BillboardClient