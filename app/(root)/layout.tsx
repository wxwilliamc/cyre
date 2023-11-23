import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface SetupLayoutProps {
    children: React.ReactNode
}

const SetupLayout = async ({ children }: SetupLayoutProps) => {

    const { userId } = auth()
    if(!userId) {
        redirect('/sign-in')
    }

    const store = await db.store.findFirst({
        where: {
            userId
        }
    })

    if(store){
        redirect(`/${store.id}`)
    }

  return (
    <>
        {/* render root page content */}
        {/* If no store found, will ask user to create a new store by trigger the useStoreModal */}
        {children}
    </>
  )
}

export default SetupLayout