"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./column"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface OrderClientProps {
    data: OrderColumn[]
}

// under Orders Page

const OrderClient = ({ data }: OrderClientProps) => {

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Orders (${data.length})`}
                description="Manage orders for your store"
            />
        </div>

        <Separator />

        {/* searchKey - Dynamic Search as the dataTable could be use on anywhere and we don't know what kind of data will be filter on other components */}

        {/* In this case we know what we want to filter on billboard which is based on label, so we assign it as our searchKey */}
        <DataTable columns={columns} data={data} searchKey='products'/>
    </>
  )
}

export default OrderClient