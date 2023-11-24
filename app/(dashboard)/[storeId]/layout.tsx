import Navbar from "@/components/Navbar"
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface DashboardLayoutProps {
    children: React.ReactNode
    params: {
        storeId: string
    }
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps ) => {
    
    const { userId } = auth()
    if(!userId) {
        redirect('/sign-in')
    }

    // fetch exact store based on storeId from params
    const store = await db.store.findFirst({
        where: {
            userId,
            id: params.storeId
        }
    })

    if(!store){
        redirect('/')
    }
    
    return (
        <>
            <Navbar />
            
            {/* render all page content created within dashboard*/}
            {children}
        </>
    )
}

export default DashboardLayout