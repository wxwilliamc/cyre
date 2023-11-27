import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'
import MainNav from './MainNav'
import StoreSwitcher from './Store-Switcher'
import { Store } from '@prisma/client'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'

// Under Dashboard Layout.tsx

const Navbar = async () => {

  const { userId } = auth();
  if(!userId){
    redirect('/sign-in')
  }

  const stores = await db.store.findMany({
    where: {
      userId
    }
  })

  return (
    <div className='flex h-16 items-center px-4 border-b container'>
        {/* Store Switcher */}
        <StoreSwitcher items={stores}/>

        {/* Routes */}
        <MainNav className='mx-6'/>

        <div className='ml-auto flex items-center space-x-4'>
            {/* User */}
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}

export default Navbar