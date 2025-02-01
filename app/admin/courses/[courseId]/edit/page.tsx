import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { DialogTitle } from "@radix-ui/react-dialog";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params
    const course = await getCourse(courseId)
    console.log(course)
    if (!course) return notFound()

    return <div className="container my-4">
        <PageHeader title={`Edit ${course.name}`} />
        <Tabs defaultValue="lessons">
            <TabsList>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="lessons">
                <Card>
                    <CardHeader className="flex items-center flex-row jusctify-between">
                        <CardTitle>Sections</CardTitle>
                        <SectionFormDialog>
                            <DialogTitle>Add Section</DialogTitle>
                            <SectionFormDialog />
                    </CardHeader>

                </Card>
            </TabsContent>
            <TabsContent value="details">
                <Card>
                    <CardHeader>
                        <CourseForm course={course} />
                    </CardHeader>

                </Card>
            </TabsContent>

        </Tabs>

    </div>

}
async function getCourse(id: string) {
    return await db.query.CourseTable.findFirst({
        columns: { id: true, name: true, description: true },
        where: eq(CourseTable.id, id),
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                columns: { id: true, name: true, status: true, },
                with: {
                    lessons: {
                        orderBy: asc(LessonTable.order),
                        columns: {
                            id: true,
                            name: true,
                            status: true,
                            description: true,
                            youtubeVideoId: true,
                            sectionId: true
                        }

                    }
                }
            }
        }
    }

    )
}