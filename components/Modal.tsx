"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

interface ModalProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    children?: React.ReactNode
}

// Customize Modal Component

const Modal = ({ title, description, isOpen, onClose, children }: ModalProps ) => {

    const onChange = () => {
        if(!isOpen){
            onClose()
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            <div>
                {children}
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default Modal