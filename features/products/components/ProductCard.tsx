import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
export function ProductCard({ product }: { product: { id: string, name: string, priceInDollars: number, imageUrl: string, description: string } }) {
    return (
        <Card className={cn("flex flex-col overflow-hidden w-full max-w-[500px] mx-auto  transition-transform hover:shadow-lg hover:-translate-y-2 delay-300  ")}>
            < div className="relative aspect-video w-full p-4" >
                <Image src={product.imageUrl} alt={product.name}
                    className="object-cover absolute object-center w-full h-full" width={192} height={192} />
            </div >
            <CardHeader>
                <CardDescription className="space-y-0">
                    <Suspense fallback={<div>...loading price</div>}>
                        <Price price={product.priceInDollars} />
                    </Suspense>
                </CardDescription>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3">
                    {product.description}
                </p>
            </CardContent>
            <CardFooter className="mt-auto">

                <Button className="w-full text-white " asChild>
                    <Link href={`/products/${product.id}`}>View Course</Link>
                </Button>
            </CardFooter>

        </Card >
    )
}
export function Price({ price }: { price: number }) {
    return <div className="text-muted-foreground">
    $ {price}
    </div>
}