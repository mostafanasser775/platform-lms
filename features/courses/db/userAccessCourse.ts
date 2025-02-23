import { db } from "@/drizzle/db";
import { ProductTable, PurchaseTable, UserCourseAccessTable } from "@/drizzle/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

export async function addUserCourseAccess({ userId, courseids }: { userId: string, courseids: string[] }, trx: Omit<typeof db, '$client'> = db) {
    console.log("courseIds", courseids)
    console.log("userId", userId)
    const accesses = await trx
            .insert(UserCourseAccessTable)
            .values(courseids.map(courseId => ({ userId, courseId })))
            .returning();

    console.log("access", accesses)


    return accesses
}

export async function revokeUserCourseAccess({ userId, productId }: { userId: string, productId: string }, trx: Omit<typeof db, '$client'> = db) {
    const validPurchases = await trx.query.PurchaseTable.findMany({
        where: and(eq(PurchaseTable.userId, userId), isNull(PurchaseTable.refundedAt)),
        with: {
            product: {
                with: {
                    courseProducts: {
                        columns: {
                            courseId: true
                        }
                    }
                }
            }
        }
    })
    const refundedPurchase = await trx.query.ProductTable.findFirst({
        where: eq(ProductTable.id, productId),
        with: {
            courseProducts: {
                columns: {
                    courseId: true
                }
            }
        }
    })
    if (refundedPurchase == null) return
    const validCoursesIds = validPurchases.flatMap(p => p.product?.courseProducts.map(cp => cp.courseId))
    const removedCoursesIds = refundedPurchase.courseProducts
        .flatMap(cp => cp.courseId)
        .filter(courseId => !validCoursesIds.includes(courseId));
    const revokedCoursesIds = await trx.delete(UserCourseAccessTable)
        .where(and(eq(UserCourseAccessTable.userId, userId), inArray(UserCourseAccessTable.courseId, removedCoursesIds))).returning();
    return revokedCoursesIds
}