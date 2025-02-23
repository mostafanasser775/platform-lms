import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Play, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export const revalidate = 0; // Disable caching

export default async function PurchaseSuccessPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const product = await getPublicProduct(productId);
    if (!product) return notFound();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Success Message */}
            <div className="flex flex-col items-center text-center space-y-3">
                <CheckCircle className="text-green-500 w-14 h-14" />
                <h1 className="text-3xl font-semibold text-gray-900">Purchase Successful! 🎉</h1>
                <p className="text-gray-600 text-lg">You have successfully enrolled in <span className="font-medium">{product.name}</span>. Enjoy learning!</p>
            </div>

            {/* Course Card */}
            <Card className="mt-6 w-full max-w-lg bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                <div className="relative w-full h-56">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-2xl"
                    />
                </div>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{product.description}</p>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
                <Link href="/courses" passHref>
                    <Button className="px-6 py-3 text-lg flex items-center gap-2">
                        <Play className="w-5 h-5" /> Start Learning
                    </Button>
                </Link>
                <Link href="/products" passHref>
                    <Button variant="outline" className="px-6 py-3 text-lg flex items-center gap-2">
                        <ArrowRight className="w-5 h-5" /> Explore More
                    </Button>
                </Link>
            </div>
        </div>
    );
}

async function getPublicProduct(id: string) {
    return db.query.ProductTable.findFirst({
        columns: {
            name: true,
            description: true,
            imageUrl: true,
        },
        where: and(eq(ProductTable.id, id), eq(ProductTable.status, "public")),
    });
}
