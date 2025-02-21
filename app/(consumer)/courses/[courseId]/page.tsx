import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await getCourse(courseId)
    if (course == null) return notFound()
    return (
        <div className="container my-4">
            <PageHeader title={course.name}/>
            <p className="text-muted-foreground">
                {course.description}
            </p>

        </div>
    );
}
async function getCourse(courseId: string) {
    return db.query.CourseTable.findFirst({
        columns: { id: true, name: true, description: true},
        where: eq(CourseTable.id, courseId)
    })
}