import { db } from "@/drizzle/db"
import { ProductTable, UserTable } from "@/drizzle/schema"
import { addUserCourseAccess } from "@/features/courses/db/userAccessCourse"
import { insertPurchaseDB } from "@/features/purchase/db/purchase"
import { stripeServerClient } from "@/services/stripe/stripeServer"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(req: NextRequest, { params }: { params: Promise<{ stripeSessionId: string }> }) {

    const { stripeSessionId } = await params
    console.log(stripeSessionId)
    if (stripeSessionId == null) {
        redirect("/products/purchase-failure")
    }
    let redirectUrl: string
    try {
        const checkOutSession = await stripeServerClient.checkout.sessions.retrieve(stripeSessionId,{ expand: ["line_items"] })

        const productId = await processStripeCheckoutSession(checkOutSession)
        redirectUrl = `/products/${productId}/purchase/success`

    } catch {
        redirect("/products/purchase-failure")
    }
    return NextResponse.redirect(new URL(redirectUrl, req.url))
}
async function processStripeCheckoutSession(checkOutSession: Stripe.Checkout.Session) {
    const userId = checkOutSession.metadata?.userId
    const productId = checkOutSession.metadata?.productId
    console.log("it reaches here")
    console.log(userId,productId)
    if (userId == null || productId == null) {
        throw new Error("userId or productId not found in checkout session")
    }
    const [product, user] = await Promise.all([
        getProduct(productId), getUser(userId)
    ])
    if (product == null || user == null) {
        throw new Error("product or user not found")
    }
    const courseids = product.courseProducts.map(c => c.courseId)
   await  db.transaction(async trx => {
        try {
            await addUserCourseAccess({ userId: user.id, courseids }, trx)
            await insertPurchaseDB({
                stripeSessionId: checkOutSession.id,
                pricePaidInCents: checkOutSession.amount_total || product.priceInDollars * 100,
                productDetails: product,
                userId: user.id,
                productId
            }, trx)
        } catch (error) {
            trx.rollback()
            throw error
        }

    },)

    return productId
}
async function getProduct(id: string) {
    return await db.query.ProductTable.findFirst({
        columns: {
            id: true,
            priceInDollars: true,
            name: true,
            description: true,
            imageUrl: true

        },
        where: eq(ProductTable.id, id),
        with: {
            courseProducts: {
                columns: {
                    courseId: true
                }
            }
        }
    })
}
async function getUser(id: string) {
    return await db.query.UserTable.findFirst({
        where: eq(UserTable.id, id)
    })
}
