import { env } from "@/data/env/server"
import { db } from "@/drizzle/db"
import { ProductTable, UserTable } from "@/drizzle/schema"
import { addUserCourseAccess } from "@/features/courses/db/userAccessCourse"
import { insertPurchaseDB } from "@/features/purchase/db/purchase"
import { stripeServerClient } from "@/services/stripe/stripeServer"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export  async function GET(req: NextRequest) {

    const stripeSessionId =  req.nextUrl.searchParams.get("stripeSessionId")

    if (stripeSessionId == null) {
        redirect("/products/purchase-failure")
    }
    let redirectUrl: string
    try {
        const checkOutSession = await stripeServerClient.checkout.sessions.retrieve(stripeSessionId,
            { expand: ["line_items"] })

        const productId = await processStripeCheckoutSession(checkOutSession)
        redirectUrl = `/products/${productId}/purchase/success`

    } catch {
        redirect("/products/purchase-failure")
    }
    return NextResponse.redirect(new URL(redirectUrl, req.url))
}

export async function POST(req: NextRequest) {
    const event = await stripeServerClient.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        env.STRIPE_WEBHOOK_SECRET
    )
    switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded":
            try {
                await processStripeCheckoutSession(event.data.object as Stripe.Checkout.Session)
            }
            catch {
                return new Response("Error occurred", { status: 500 })
            }

    }
    return new Response("Success", { status: 200 })
}

async function processStripeCheckoutSession(checkOutSession: Stripe.Checkout.Session) {
    const userId = checkOutSession.metadata?.userId
    const productId = checkOutSession.metadata?.productId
    console.log("it reaches here")
    console.log("userId",userId )
    console.log("productId",productId )
    if (userId == null || productId == null) {
        throw new Error("userId or productId not found in checkout session")
    }
    const [product, user] = await Promise.all([
        getProduct(productId),
        getUser(userId)
    ])
    console.log("product",product)
    console.log("user",user)

    if (product == null || user == null) {
        throw new Error("product or user not found")
    }
    const courseids = product.courseProducts.map(c => c.courseId)
     db.transaction(async trx => {
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