import React from 'react'
import BillboardClient from './_components/SizeClient'
import { db } from '@/lib/prisma'
import { SizeColumn } from './_components/column'
import { format } from 'date-fns'
import SizeClient from './_components/SizeClient'

const SizesPage = async ({ params }: { params: { storeId: string } }) => {

  const sizes = await db.size.findMany({
    where: {
        storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // modify the date data type from DateTime to string
  // Easy for us to display those sizes data to DataTable
  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  })) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeClient data={formattedSizes}/>
        </div>
    </div>
  )
}

export default SizesPage