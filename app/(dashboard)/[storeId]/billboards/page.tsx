import React from 'react'
import BillboardClient from './_components/BillboardClient'

const BillboardsPage = async () => {

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillboardClient />
        </div>
    </div>
  )
}

export default BillboardsPage