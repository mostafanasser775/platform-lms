import { PageHeader } from "@/components/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Receipt, ExternalLink } from "lucide-react"
import { db } from "@/drizzle/db"
import { PurchaseTable } from "@/drizzle/schema"
import { formatDate, formatPrice } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/services/clerk"
import { stripeServerClient } from "@/services/stripe/stripeServer"
import { and, eq } from "drizzle-orm"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment, Suspense } from "react"
import Stripe from "stripe"

export default async function PurchasePage({
  params,
}: {
  params: Promise<{ purchaseId: string }>
}) {
  const { purchaseId } = await params

  return (
    <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 bg-muted rounded"></div>
              <div className="h-[400px] w-full bg-muted rounded-lg"></div>
            </div>
          </div>
        }
      >
        <SuspenseBoundary purchaseId={purchaseId} />
      </Suspense>
    </div>
  )
}

async function SuspenseBoundary({ purchaseId }: { purchaseId: string }) {
  const { userId, redirectToSignIn, user } = await getCurrentUser({
    allData: true,
  })
  if (userId == null || user == null) return redirectToSignIn()

  const purchase = await getPurchase({ userId, id: purchaseId })

  if (purchase == null) return notFound()

  const { receiptUrl, pricingRows } = await getStripeDetails(
    purchase.stripeSessionId,
    purchase.pricePaidInCents,
    purchase.refundedAt != null
  )

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <PageHeader title={purchase.productDetails.name}>
          {receiptUrl && (
            <Button variant="outline" size="lg" asChild>
              <Link target="_blank" href={receiptUrl}>
                <Receipt className="mr-2 h-4 w-4" />
                View Receipt
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </PageHeader>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-bold">Receipt</CardTitle>
                <CardDescription className="text-sm">
                  Transaction ID: {purchaseId}
                </CardDescription>
              </div>
              <Badge 
                className={cn(
                  "text-base px-4 py-1",
                  purchase.refundedAt 
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
                    : "bg-green-100 text-green-800 hover:bg-green-100"
                )}
              >
                {purchase.refundedAt ? "Refunded" : "Paid"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <div className="text-lg">{formatDate(purchase.createdAt)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Product</label>
                <div className="text-lg font-medium">{purchase.productDetails.name}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Customer</label>
                <div className="text-lg">{user.name}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Seller</label>
                <div className="text-lg">Web Dev Simplified</div>
              </div>
            </div>
          </CardContent>

          <Separator />
          
          <CardFooter className="pt-6">
            <div className="w-full space-y-4">
              {pricingRows.map(({ label, amountInDollars, isBold }, index) => (
                <Fragment key={label}>
                  <div className="flex justify-between items-center">
                    <div className={cn(
                      "text-base",
                      isBold && "font-bold text-lg",
                      index === pricingRows.length - 1 && "text-lg"
                    )}>
                      {label}
                    </div>
                    <div className={cn(
                      "text-base tabular-nums",
                      isBold && "font-bold text-lg",
                      index === pricingRows.length - 1 && "text-lg"
                    )}>
                      {formatPrice(amountInDollars, { showZeroAsNumber: true })}
                    </div>
                  </div>
                  {index < pricingRows.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </Fragment>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  )
}

async function getPurchase({ userId, id }: { userId: string; id: string }) {
  return db.query.PurchaseTable.findFirst({
    columns: {
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
      stripeSessionId: true,
    },
    where: and(eq(PurchaseTable.id, id), eq(PurchaseTable.userId, userId)),
  })
}

async function getStripeDetails(
  stripeSessionId: string,
  pricePaidInCents: number,
  isRefunded: boolean
) {
  const { payment_intent, total_details, amount_total, amount_subtotal } =
    await stripeServerClient.checkout.sessions.retrieve(stripeSessionId, {
      expand: [
        "payment_intent.latest_charge",
        "total_details.breakdown.discounts",
      ],
    })

  const refundAmount =
    typeof payment_intent !== "string" &&
    typeof payment_intent?.latest_charge !== "string"
      ? payment_intent?.latest_charge?.amount_refunded
      : isRefunded
      ? pricePaidInCents
      : undefined

  return {
    receiptUrl: getReceiptUrl(payment_intent),
    pricingRows: getPricingRows(total_details, {
      total: (amount_total ?? pricePaidInCents) - (refundAmount ?? 0),
      subtotal: amount_subtotal ?? pricePaidInCents,
      refund: refundAmount,
    }),
  }
}

function getReceiptUrl(paymentIntent: Stripe.PaymentIntent | string | null) {
  if (
    typeof paymentIntent === "string" ||
    typeof paymentIntent?.latest_charge === "string"
  ) {
    return
  }

  return paymentIntent?.latest_charge?.receipt_url
}

function getPricingRows(
  totalDetails: Stripe.Checkout.Session.TotalDetails | null,
  {
    total,
    subtotal,
    refund,
  }: { total: number; subtotal: number; refund?: number }
) {
  const pricingRows: {
    label: string
    amountInDollars: number
    isBold?: boolean
  }[] = []

  if (totalDetails?.breakdown != null) {
    totalDetails.breakdown.discounts.forEach(discount => {
      pricingRows.push({
        label: `${discount.discount.coupon.name} (${discount.discount.coupon.percent_off}% off)`,
        amountInDollars: discount.amount / -100,
      })
    })
  }

  if (refund) {
    pricingRows.push({
      label: "Refund",
      amountInDollars: refund / -100,
    })
  }

  if (pricingRows.length === 0) {
    return [{ label: "Total", amountInDollars: total / 100, isBold: true }]
  }

  return [
    {
      label: "Subtotal",
      amountInDollars: subtotal / 100,
    },
    ...pricingRows,
    {
      label: "Total",
      amountInDollars: total / 100,
      isBold: true,
    },
  ]
}