import { db } from "@/lib/prisma"
import BillBoardForm from "./_components/ColorForm"
import SizeForm from "./_components/ColorForm"

interface NewColorPageProps {
    params: {
        colorId: string
    }
}

const NewColorPage = async ({ params }: NewColorPageProps) => {

    const color = await db.color.findUnique({
        where: {
            id: params.colorId
        }
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm 
                color={color}
            />
        </div>
    </div>
  )
}

export default NewColorPage