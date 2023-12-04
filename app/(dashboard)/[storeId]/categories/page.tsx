import React from 'react'
import BillboardClient from './_components/CategoryClient'
import { db } from '@/lib/prisma'
import { CategoryColumn } from './_components/column'
import { format } from 'date-fns'
import CategoryClient from './_components/CategoryClient'

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {

  const categories = await db.category.findMany({
    where: {
        storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // modify the date data type from DateTime to string
  // Easy for us to display those billboard data to DataTable
  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  })) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <CategoryClient data={formattedCategories}/>
        </div>
    </div>
  )
}

export default CategoriesPage