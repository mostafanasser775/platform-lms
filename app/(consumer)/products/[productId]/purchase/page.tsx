import {  redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/services/clerk";
import { userOwnsProductDB } from "@/features/products/db/product";
import { PageHeader } from "@/components/PageHeader";
import { SignIn, SignUp } from "@clerk/nextjs";
import { StripeCheckoutForm } from "@/services/stripe/componenets/StripeCheckOutForm";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { wherePublicProducts } from "@/features/products/permissions/products";
import { and, eq } from "drizzle-orm";
export default async function PurchasePage({ params, searchParams }:
    {
        params: Promise<{ productId: string }>,
        searchParams: Promise<{ authMode: string }>
    }) {
   
    return <Suspense fallback={<div>...loading</div>}>

        <SuspendedCompoenet params={params} searchParams={searchParams} />
    </Suspense>;
}
 async function SuspendedCompoenet(
    { params, searchParams }:
        {
            params: Promise<{ productId: string }>,
            searchParams: Promise<{ authMode: string }>
        }
) {
    const { productId } = await params;
    const { user } = await getCurrentUser({ allData: true })
    const product = await getPublicProduct(productId);

    if (user != null&&product!=null) {
        if (await userOwnsProductDB({ userId: user.id, productId })) {
            redirect(`/courses/`)
        }
        else
            return (
                <div className="container my-8">
                    <StripeCheckoutForm product={product} user={user} />

                </div>
            )


    }
    const { authMode } = await searchParams;
    const isSignUp = authMode === "signup";

    return (
        <div className="container my-4 flex flex-col items-center justify-center">
            <PageHeader title="you need an account to make purchases" />
            {isSignUp ? (
                <SignUp routing="hash" signInUrl={`/products/${productId}/purchase?authMode=signIn`}
                    forceRedirectUrl={`/products/${productId}/purchase`}
                />
            ) : (
                <SignIn routing="hash" signUpUrl={`/products/${productId}/purchase?authMode=signIn`}
                    forceRedirectUrl={`/products/${productId}/purchase`} />
            )

            }
        </div>
    )
}
async function getPublicProduct(id: string) {
    
  
    return db.query.ProductTable.findFirst({
      columns: {
        name: true,
        id: true,
        imageUrl: true,
        description: true,
        priceInDollars: true,
      },
      where: and(eq(ProductTable.id, id), wherePublicProducts),
    })
  }
  