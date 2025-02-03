import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/drizzle/db"
import {
    CourseProdcutTable,
    ProductTable,
    PurchaseTable,
} from "@/drizzle/schema"

export async function userOwnsProductDB({ userId, productId,
}: { userId: string, productId: string }) {

    const existingPurchase = await db.query.PurchaseTable.findFirst({
        where: and(
            eq(PurchaseTable.productId, productId),
            eq(PurchaseTable.userId, userId),
            isNull(PurchaseTable.refundedAt)
        ),
    })

    return existingPurchase != null
}

export async function insertProductDB(
    data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
    const newProduct = await db.transaction(async trx => {
        const [newProduct] = await trx.insert(ProductTable).values(data).returning()
        if (newProduct == null) {
            trx.rollback()
            throw new Error("Failed to create product")
        }

        await trx.insert(CourseProdcutTable).values(
            data.courseIds.map(courseId => ({
                productId: newProduct.id,
                courseId,
            }))
        )

        return newProduct
    })
    return newProduct
}

export async function updateProductDB(
    id: string,
    data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }
) {
    const updatedProduct = await db.transaction(async trx => {
        const [updatedProduct] = await trx
            .update(ProductTable)
            .set(data)
            .where(eq(ProductTable.id, id))
            .returning()
        if (updatedProduct == null) {
            trx.rollback()
            throw new Error("Failed to create product")
        }

        await trx
            .delete(CourseProdcutTable)
            .where(eq(CourseProdcutTable.productId, updatedProduct.id))

        await trx.insert(CourseProdcutTable).values(
            data.courseIds.map(courseId => ({
                productId: updatedProduct.id,
                courseId,
            }))
        )

        return updatedProduct
    })

    return updatedProduct
}

export async function deleteProductDB(id: string) {
    const [deletedProduct] = await db
        .delete(ProductTable)
        .where(eq(ProductTable.id, id))
        .returning()
    if (deletedProduct == null) throw new Error("Failed to delete product")
    return deletedProduct
}
