import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import {
    LessonTable,
    ProductTable as DBProductTable,
    PurchaseTable,
    CourseProdcutTable
} from "@/drizzle/schema";
import { eq, asc, countDistinct } from "drizzle-orm";
import { ProductTable } from "@/features/products/components/ProductTable";
import { TransationLinkBtn } from "@/components/TransationLinkBtn";
import { PlusIcon } from "lucide-react";
export default async function productsPage() {
    const products = await getProducts()
    return (
        <div >
            <PageHeader title={'Products'}>
                <TransationLinkBtn icon={<PlusIcon size={20}/>} title="Add Product" link={'/admin/products/new'} variant="solid" color="primary" />
            </PageHeader>
            <hr className="my-4" />
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