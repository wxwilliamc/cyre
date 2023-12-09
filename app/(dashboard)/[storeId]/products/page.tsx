import React from 'react'
import { db } from '@/lib/prisma'
import { ProductsColumn } from './_components/column'
import { format } from 'date-fns'
import { formatPrice } from '@/lib/format-price'
import ProductClient from './_components/ProductClient'

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

  const products = await db.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // modify the date data type from DateTime to string
  // Easy for us to display those billboard data to DataTable
  const formattedProducts: ProductsColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatPrice(item.price.toString()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  })) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ProductClient data={formattedProducts}/>
        </div>
    </div>
  )
}

export default ProductsPage