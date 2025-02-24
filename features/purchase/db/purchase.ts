import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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
export async function insertPurchaseDBNew(data: typeof PurchaseTable.$inferInsert) {
    const details = data.productDetails
    const [newPurchase] = await db.insert(PurchaseTable).values(
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

export async function UpdatePurchaseDB(id: string, data: Partial<typeof PurchaseTable.$inferInsert>, trx: Omit<typeof db, '$client'> = db) {
    const details = data.productDetails
    const [UpdatedPurchase] = await trx.update(PurchaseTable).set(
        {
                
            ...data,
            productDetails: details ? {
                name: details.name,
                description: details.description,
                imageUrl: details.imageUrl,

            } : undefined
        }
    ).where(eq(PurchaseTable.id, id)).returning();
    if (UpdatedPurchase === null) throw new Error("Failed to create purchase");
    return UpdatedPurchase
}