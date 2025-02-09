'use server'

import { getCurrentUser } from "@/services/clerk"
import { canrefundPurchase } from "../permenssions/purchase"
import { stripeServerClient } from "@/services/stripe/stripeServer"
import { db } from "@/drizzle/db"
import { UpdatePurchaseDB } from "../db/purchase"
import { revokeUserCourseAccess } from "@/features/courses/db/userAccessCourse"

export async function refundPurchase(id: string) {
    if (!canrefundPurchase(await getCurrentUser())) {
        return { error: true, message: "Failed to Refund Your Purchase" }
    }
    const data = await db.transaction(async trx => {

        const refundPurchase = await UpdatePurchaseDB(id, { refundedAt: new Date() }, trx)
        if (refundPurchase == null) throw new Error("Failed to refund purchase")
        const session = await stripeServerClient.checkout.sessions.retrieve(refundPurchase.stripeSessionId);
        if (session.payment_intent == null) {
            trx.rollback();
            return { error: true, message: "Failed to Refund Your Purchase" }
        }
        try {
            await stripeServerClient.refunds.create({
                payment_intent: typeof session.payment_intent === "string" ? session.payment_intent :
                    session.payment_intent.id

            })
            await revokeUserCourseAccess(refundPurchase,trx)
        } catch (error) {
            console.log(error)
            trx.rollback();
            return { error: true, message: "Failed to Refund Your Purchase" }
        }


    })
    return data ?? { error: false, message: "successful" }

}
