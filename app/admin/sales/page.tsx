import { PageHeader } from "@/components/PageHeader"
import { db } from "@/drizzle/db"
import { PurchaseTable } from "@/drizzle/schema"
import PurchasesSalesTable from "@/features/purchase/compoenents/PurchasesSalesTable"
import { desc } from "drizzle-orm"

export default async function SalesPurcahsePage() {
    const purchases = await getPurchases()
    return (
        <div >
            <PageHeader title="Sales" />
            <hr className="my-4"/>
            <PurchasesSalesTable Purchases={purchases} />

        </div>
    )
}
async function getPurchases() {
    return db.query.PurchaseTable.findMany({
        columns: { id: true, pricePaidInCents: true, refundedAt: true, productDetails: true, createdAt: true },
        orderBy: desc(PurchaseTable.createdAt),
        with: {
            user: {
                columns: { name: true }
            }
        }
    })
}