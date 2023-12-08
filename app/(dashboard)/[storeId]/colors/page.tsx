import React from 'react'
import BillboardClient from './_components/ColorClient'
import { db } from '@/lib/prisma'
import { ColorColumn } from './_components/column'
import { format } from 'date-fns'
import SizeClient from './_components/ColorClient'
import ColorClient from './_components/ColorClient'

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {

  const colors = await db.color.findMany({
    where: {
        storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // modify the date data type from DateTime to string
  // Easy for us to display those sizes data to DataTable
  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  })) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ColorClient data={formattedColors}/>
        </div>
    </div>
  )
}

export default ColorsPage