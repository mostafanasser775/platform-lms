
import { PageHeader } from "@/components/PageHeader";

import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { ProductCard } from "@/features/products/components/ProductCard";
import { asc, eq } from "drizzle-orm";
export const revalidate = 0; // Disable caching

export default async function AllCoursesPage() {
    const products = await getPublicProducts();

    return (
        <div className="container my-8">
            
            <PageHeader title='Browse Courses' />
            <hr className="my-4"/>
            <div className="mt-8  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4   pb-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
async function getPublicProducts() {
    return db.query.ProductTable.findMany({
        columns: {
            id: true,
            priceInDollars: true,
            imageUrl: true,
            description: true,
            name: true,
        },
        where: eq(ProductTable.status, "public"),
        orderBy: asc(ProductTable.name),
    });
}
