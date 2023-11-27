"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn, columns } from "./column"
import { DataTable } from "@/components/ui/data-table"

interface BillboardClientProps {
    data: BillboardColumn[]
}

// under Billboards Page

const BillboardClient = ({ data }: BillboardClientProps) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Billboards (${data.length})`}
                description="Manage billboards for your store"
            />

            <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                <Plus className="w-4 h-4 mr-2"/>
                Add New
            </Button>
        </div>

        <Separator />

        {/* searchKey - Dynamic Search as the dataTable could be use on anywhere and we don't know what kind of data will be filter on other components */}

        {/* In this case we know what we want to filter on billboard which is based on label, so we assign it as our searchKey */}
        <DataTable columns={columns} data={data} searchKey='label'/>
    </>
  )
}

export default BillboardClient