import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema/course";
import { ProductTable } from "@/drizzle/schema/product";
import { ProductForm } from "@/features/products/components/ProductForm";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const Product = await getProudct(productId)

    const courses = await getCourses()
    if (Product === undefined) return notFound()
    return <div className="container ">
        <PageHeader title="Edit Product" />
        <ProductForm product={{
            ...Product,
            courseIds: Product.courseProducts.map(c => c.courseId)
        }}
            courses={courses} />

    </div>
}
async function getCourses() {
    return db.query.CourseTable.findMany({
        orderBy: asc(CourseTable.name),
        columns: { id: true, name: true }
    })
}
async function getProudct(id: string) {
    return db.query.ProductTable.findFirst({
        where: eq(ProductTable.id, id),
        columns: {
            id: true,
            name: true,
            description: true,
            priceInDollars: true,
            status: true, imageUrl: true
        },
        with: {
            courseProducts: {
                columns: {
                    courseId: true
                }
            }
        }
    })
}