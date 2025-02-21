import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";
import UserPurchasesTable, { UserPurchasesTableSkeleton } from "@/features/purchase/compoenents/UserPurchasesTable";
import { getCurrentUser } from "@/services/clerk";
import { desc, eq } from "drizzle-orm";
import { Suspense } from "react";

export default function PurchasesPage() {
    return (
        <div className="container my-4">
            <PageHeader title={'Purchases'} />
            <Suspense fallback={<UserPurchasesTableSkeleton />}>
                <SuspenseBoundary />
            </Suspense>
        </div>
    );
}
 async function SuspenseBoundary() {
    const { userId, redirectToSignIn } = await getCurrentUser();
    if (!userId) return redirectToSignIn();
    const Purchases = await getPurchases(userId);
    if (Purchases.length === 0) return <p className="text-center">No Purchases Found</p>
    else return <UserPurchasesTable Purchases={Purchases} />

}
 async function getPurchases(userId: string) {
    return await db.query.PurchaseTable.findMany({
        columns: {
            id: true,
            pricePaidInCents: true,
            productDetails: true,
            refundedAt: true,
            createdAt: true
        },
        where: eq(PurchaseTable.userId, userId),
        orderBy: desc(PurchaseTable.createdAt)
    })

}