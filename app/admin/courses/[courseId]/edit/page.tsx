import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { SectionFormDialog } from "@/features/courseSections/components/SectionFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, PlusIcon } from "lucide-react";
import { SortableSectionList } from "@/features/courseSections/components/SortableSectionList";
import { cn } from "@/lib/utils";
import { LessonFormDialog } from "@/features/lessons/components/LessonFormDialog";
import { SortableLessonList } from "@/features/lessons/components/SortableLessonList";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params
    const course = await getCourse(courseId)
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
                    <CardHeader className="flex items-center flex-row justify-between   ">
                        <CardTitle>Sections</CardTitle>
                        <SectionFormDialog courseId={course.id} >
                            <DialogTrigger asChild >
                                <Button variant="outline">
                                    <PlusIcon />Add Section
                                </Button>
                            </DialogTrigger>
                        </SectionFormDialog>
                    </CardHeader>
                    <CardContent>
                        <SortableSectionList sections={course.courseSections} courseId={course.id} />
                    </CardContent>

                </Card>
                <hr className="my-4" />
                {course.courseSections.map((section) => (
                    <Card key={section.id} className="mt-4">
                        <CardHeader className="flex items-center flex-row justify-between gap-4">
                            <CardTitle className={cn("flex items-center gap-2",
                                section.status === "private" && "text-muted-foreground")}>
                                {section.status === "private" && <EyeClosedIcon className="size-4" />} {section.name}
                            </CardTitle>
                            <LessonFormDialog defaultSectionId={section.id} sections={course.courseSections} />
                        </CardHeader>
                        <CardContent>
                            <SortableLessonList lessons={section.lessons} sections={course.courseSections} />
                        </CardContent>

                    </Card>
                ))}
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
                            videoUrl: true,
                            sectionId: true
                        }

                    }
                }
            }
        }
    }
    )
}