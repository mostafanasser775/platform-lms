import { cn } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export function ProductCard({ product }: { product: { id: string, name: string, priceInDollars: number, imageUrl: string, description: string } }) {
    return (
            <Card as={Link} href={`/products/${product.id}`} className={cn(
                "flex flex-col overflow-hidden w-full max-w-[420px] mx-auto border rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:cursor-pointer"
            )}>
                {/* Image Section */}
                <div className="relative w-full h-56 bg-gray-100">
                    <Image 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="object-cover rounded-t-xl w-full h-full"
                        width={420} 
                        height={240} 
                    />
                </div>

                {/* Product Info */}
                <CardHeader className="px-5 pt-4">
                    <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                </CardHeader>

                {/* Body */}
                <CardBody className="px-5 pt-1">
                    <div className="text-gray-700 text-base leading-relaxed line-clamp-3">
                        {product.description}
                    </div>
                    <div className="text-gray-500 text-sm mt-2">
                        <Suspense fallback={<div>Loading price...</div>}>
                            <Price price={product.priceInDollars} />
                        </Suspense>
                    </div>
                </CardBody>

                {/* Footer */}
                <CardFooter className="px-5 pb-4 mt-auto border-t">
                    <span className="text-blue-600 font-medium text-sm tracking-wide">View Details →</span>
                </CardFooter>
            </Card>
    );
}

export function Price({ price }: { price: number }) {
    return (
        <div className="text-lg font-bold text-blue-600">
            ${price.toFixed(2)}
        </div>
    );
}
