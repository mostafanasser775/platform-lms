import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import Link from "next/link";
import {
    LessonTable,
    ProductTable as DBProductTable,
    PurchaseTable,
    CourseProdcutTable
} from "@/drizzle/schema";
import { eq, asc, countDistinct } from "drizzle-orm";
import { ProductTable } from "@/features/products/components/ProductTable";
export default async function productsPage() {
    const products = await getProducts()
    return (
        <div className="container my-6">
            <PageHeader title={'Products'}>
                <Button asChild>
                    <Link href={'/admin/products/new'}>Add Product</Link>
                </Button>
            </PageHeader>
            <ProductTable products={products} />
        </div>
    );
}
async function getProducts() {
    return await db.select({
        id: DBProductTable.id,
        name: DBProductTable.name,
        status: DBProductTable.status,
        priceInDollars: DBProductTable.priceInDollars,
        description: DBProductTable.description,
        imageUrl: DBProductTable.imageUrl,
        courseCount: countDistinct(CourseProdcutTable.courseId),
        customersCount: countDistinct(PurchaseTable.userId),

    }).from(DBProductTable)
        .leftJoin(PurchaseTable, eq(PurchaseTable.productId, DBProductTable.id))
        .leftJoin(LessonTable, eq(LessonTable.sectionId, DBProductTable.id))
        .leftJoin(CourseProdcutTable, eq(CourseProdcutTable.productId, DBProductTable.id))
        .orderBy(asc(DBProductTable.name))
        .groupBy(DBProductTable.id)
}