"use client"

import Modal from '@/components/Modal'
import { useStoreModal } from '@/hooks/use-store-modal'
import { useEffect, useState } from 'react'

const SetupPage = () => {

  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen){
      onOpen()
    }
  }, [isOpen, onOpen])

  return (
    <div className='p-12 container px-20 font-mono flex items-center justify-between'>
      Root Page
    </div>
  )
}

export default SetupPage