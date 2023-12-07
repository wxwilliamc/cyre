"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SizeColumn, columns } from "./column"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface SizeClientProps {
    data: SizeColumn[]
}

// under Sizes Page

const SizeClient = ({ data }: SizeClientProps) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Sizes (${data.length})`}
                description="Manage sizes for your store"
            />

            <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                <Plus className="w-4 h-4 mr-2"/>
                Add New
            </Button>
        </div>

        <Separator />

        {/* searchKey - Dynamic Search as the dataTable could be use on anywhere and we don't know what kind of data will be filter on other components */}

        {/* In this case we know what we want to filter on billboard which is based on label, so we assign it as our searchKey */}
        <DataTable columns={columns} data={data} searchKey='name'/>

        <Heading 
            title="API"
            description="API calls for Sizes"
        />

        <Separator />

        <ApiList entityName="sizes" entityIdName="sizeId"/>
    </>
  )
}

export default SizeClient