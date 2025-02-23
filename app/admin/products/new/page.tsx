import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema/course";
import { ProductForm } from "@/features/products/components/ProductForm";
import { asc } from "drizzle-orm";
export const revalidate = 0; // Disable caching

export default async  function NewProductPage() {
    const courses = await getCourses()
    return <div className="container ">
        <PageHeader title="Add Product" />
        <ProductForm courses={courses} />

    </div>
}
async function getCourses() {
    return db.query.CourseTable.findMany({
        orderBy: asc(CourseTable.name),
        columns: { id: true, name: true }
    })
}