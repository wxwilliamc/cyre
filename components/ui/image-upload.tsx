// Cloudinary Image Upload

"use client"

import { useEffect, useState } from "react"
import { Button } from "./button"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
    disable?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}

// Under BillboardForm.tsx

const ImageUpload = ({ disable, onChange, onRemove, value } : ImageUploadProps) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }
    
    if(!isMounted) return null;

    return (
        <div>
            {/* Existing Image Display */}
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[250px] h-[250px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant='destructive' size='icon'>
                                <Trash className="w-4 h-4"/>
                            </Button>
                        </div>

                        <Image 
                            src={url}
                            fill
                            alt="image"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Image Upload */}
            <CldUploadWidget
                onUpload={onUpload}
                uploadPreset="sm7zqjo9" //from cloudinary
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button type="button" disabled={disable} onClick={onClick} variant='secondary'>
                            <ImagePlus className="w-4 h-4 mr-2"/>
                            Upload Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload