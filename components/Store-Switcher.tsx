"use client"

import { Store } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

// Under Navbar.tsx

const StoreSwitcher = ({ className, items=[] }: StoreSwitcherProps) => {

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // exact data from store and use for popover
    // and it's only required label and value in this case
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    // Cuz we're using this under mapping from formattedItems with consists 2 params
    const onStoreSelect = (store: { value: string, label: string}) => {
        setIsOpen(false)
        router.push(`/${store.value}`)
    }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button variant='outline' size='sm' role="combobox" aria-expanded={isOpen} aria-label="Select a store" className={cn(`w-[200px] justify-between`, className)}>
                <StoreIcon className="mr-2 h-4 w-4"/>
                {currentStore?.label}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                
                {/* All Stores */}
                <CommandList>
                    <CommandInput 
                        placeholder="Search store..."
                    />
                    
                    {/* If no stores found */}
                    <CommandEmpty>
                        No Store found.
                    </CommandEmpty>

                    <CommandGroup heading="Stores">
                        {formattedItems.map((store) => (
                            <CommandItem
                                key={store.value}
                                onSelect={() => onStoreSelect(store)}
                                className="text-sm"
                            >
                                <StoreIcon className="mr-2 h-4 w-4"/>
                                {store.label}
                                <Check className={cn(`ml-auto h-4 w-4 `, currentStore?.value === store.value ? 'opacity-100' : 'opacity-0')}/>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>

                <CommandSeparator />

                {/* Create new store */}
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                            onSelect={() => {
                                setIsOpen(false)
                                storeModal.onOpen();
                            }}
                        >
                            <PlusCircle className="mr-2 h-5 w-5"/>
                            Create Store
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher