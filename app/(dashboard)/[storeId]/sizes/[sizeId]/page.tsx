import { db } from "@/lib/prisma"
import BillBoardForm from "./_components/SizeForm"
import SizeForm from "./_components/SizeForm"

interface NewSizePageProps {
    params: {
        sizeId: string
    }
}

const NewSizePage = async ({ params }: NewSizePageProps) => {

    const size = await db.size.findUnique({
        where: {
            id: params.sizeId
        }
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm 
                size={size}
            />
        </div>
    </div>
  )
}

export default NewSizePage