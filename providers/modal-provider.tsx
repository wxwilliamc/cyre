"use client"

import { useEffect, useState } from "react"

import { StoreModal } from "@/components/modals/store-modal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    // Avoid any hydration error, cuz we're applying client comp to server comp (layout.tsx)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) return null;

    return (
        <StoreModal />
    )
}