import { db } from "@/lib/prisma"
import BillBoardForm from "./_components/CategoryForm"
import CategoryForm from "./_components/CategoryForm"

interface NewCategoryPageProps {
    params: {
        categoryId: string
        storeId: string
    }
}

const NewCategoryPage = async ({ params }: NewCategoryPageProps) => {

    const category = await db.category.findUnique({
        where: {
            id: params.categoryId
        }
    })

    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm 
                category={category}
                billboards={billboards}
            />
        </div>
    </div>
  )
}

export default NewCategoryPage