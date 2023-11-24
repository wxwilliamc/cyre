import SettingForm from '@/components/SettingForm';
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

interface SettingsPageProps {
    params: {
        storeId: string
    }
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
    
    const { userId } = auth();
    if(!userId) redirect("/sign-in");

    const store = await db.store.findFirst({
        where: {
            userId,
            id: params.storeId
        }
    })

    // To avoid manual params update
    if(!store) redirect('/');

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            {/* Store Setting Form */}
            <SettingForm store={store}/>
        </div>
    </div>
  )
}

export default SettingsPage