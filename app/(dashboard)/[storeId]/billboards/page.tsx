import React from 'react'
import BillboardClient from './_components/BillboardClient'
import { db } from '@/lib/prisma'
import { BillboardColumn } from './_components/column'
import { format } from 'date-fns'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {

  const billboards = await db.billboard.findMany({
    where: {
        storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // modify the date data type from DateTime to string
  // Easy for us to display those billboard data to DataTable
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  })) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillboardClient data={formattedBillboards}/>
        </div>
    </div>
  )
}

export default BillboardsPage