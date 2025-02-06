import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";

export async function insertPurchaseDB(data: typeof PurchaseTable.$inferInsert, trx: Omit<typeof db, '$client'> = db) {
    const details = data.productDetails
    const [newPurchase] = await trx.insert(PurchaseTable).values(
        {
            ...data,
            productDetails: {
                name: details.name,
                description: details.description,
                imageUrl: details.imageUrl,

            }
        }
    ).onConflictDoNothing().returning();
    if (newPurchase === null) throw new Error("Failed to create purchase");
    return newPurchase
}