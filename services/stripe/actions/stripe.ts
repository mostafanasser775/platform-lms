"use server"

import { env } from "@/data/env/client"
import { stripeServerClient } from "../stripeServer"

export async function getClientSessionSecret(
  product: {
    priceInDollars: number
    name: string
    imageUrl: string
    description: string
    id: string
  },
  user: { email: string; id: string }
) {
  // const url = process.env.NEXT_PUBLIC_VERCEL_URL
  const session = await stripeServerClient.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
            description: product.description,
          },
          unit_amount: product.priceInDollars * 100,
        },
      },
    ],
    ui_mode: "embedded",
    mode: "payment",
    return_url: `${env.NEXT_PUBLIC_VERCEL_URL}/api/webhooks/stripe?stripeSessionId={CHECKOUT_SESSION_ID}`,
    //    return_url: `${env.NEXT_PUBLIC_VERCEL_URL}/api/webhooks/stripe/{CHECKOUT_SESSION_ID}`,

    customer_email: user.email,
    payment_intent_data: {
      receipt_email: user.email,
    },
    metadata: {
      productId: product.id,
      userId: user.id,
    },
  })

  if (session.client_secret == null) throw new Error("Client secret is null")

  return session.client_secret
}
