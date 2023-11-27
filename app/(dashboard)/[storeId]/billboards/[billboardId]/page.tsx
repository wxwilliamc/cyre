import { db } from "@/lib/prisma"
import BillBoardForm from "./_components/BillboardForm"

interface NewBillBoardPageProps {
    params: {
        billboardId: string
    }
}

const NewBillBoardPage = async ({ params }: NewBillBoardPageProps) => {

    const billboard = await db.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillBoardForm 
                billBoard={billboard}
            />
        </div>
    </div>
  )
}

export default NewBillBoardPage