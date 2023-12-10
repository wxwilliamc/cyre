import React from 'react'
import { db } from '@/lib/prisma'
import { OrderColumn } from './_components/column'
import { format } from 'date-fns'
import { formatter } from '@/lib/format-price'
import OrderClient from './_components/OrdersClient'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {

  const orders = await db.order.findMany({
    where: {
        storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // modify the date data type from DateTime to string
  // Easy for us to display those billboard data to DataTable
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + item.product.price
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  })) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <OrderClient data={formattedOrders}/>
        </div>
    </div>
  )
}

export default BillboardsPage