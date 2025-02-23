import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable, UserLessonCompleteTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk";
import { asc, eq, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CoursePageClient } from "./_client";
import { Divider } from "@heroui/react";

export default async function CourseLayoutPage({ params, children }: { params: Promise<{ courseId: string }>, children: React.ReactNode }) {
    const { courseId } = await params
    const course = await GetCourse(courseId)
    if (!course) return notFound()

    return <div className="grid grid-cols-[500px,1fr] gap-8 container my-4">
        <div className=" my-8 p-4">
            <div className="font-semibold text-lg">{course.name}</div>
            <div>
                <Suspense fallback={<div>...loading</div>}>
                    <div className="">
                        <SuspenseBoundary course={course} />

                    </div>
                </Suspense>
            </div>
        </div>
        <div className="flex">
            <div>
            <Divider orientation="vertical" className="my-8"/>

            </div>

            {children}
        </div>

    </div>;
}
async function SuspenseBoundary({ course }: {
    course: {
        id: string,
        name: string,
        courseSections: {
            id: string,
            name: string,
            lessons: {
                id: string,
                name: string,
                status: string
            }[]
        }[]
    }
}
) {
    const { userId } = await getCurrentUser();
    const completedLessonsIds = userId == null ? [] : await getCompletedLessonsIds(userId)
    return (
        <CoursePageClient course={mapCourse(course, completedLessonsIds)} />
    )
}
async function getCompletedLessonsIds(userId: string) {
    const data = await db.query.UserLessonCompleteTable.findMany({
        where: eq(UserLessonCompleteTable.userId, userId),
        columns: { lessonId: true },
    })
    return data.map(d => d.lessonId)

}
async function GetCourse(id: string) {
    return await db.query.CourseTable.findFirst({
        where: eq(CourseTable.id, id),
        columns: {
            id: true,
            name: true,
        },
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                where: eq(CourseSectionTable.status, "public"),
                columns: { id: true, name: true },
                with: {
                    lessons: {
                        orderBy: asc(LessonTable.order),
                        columns: { id: true, name: true, status: true },
                        where: or(eq(LessonTable.status, "public"), eq(LessonTable.status, "preview"))
                    }
                }
            }
        }
    })
}

function mapCourse(
    course: {
        name: string, id: string
        courseSections: {
            name: string, id: string
            lessons: {
                name: string, id: string, status: string
            }[]
        }[]
    },
    completedLessonIds: string[]
) {
    return {
        ...course,
        courseSections: course.courseSections.map(section => {
            return {
                ...section,
                lessons: section.lessons.map(lesson => {
                    return {
                        ...lesson,
                        isComplete: completedLessonIds.includes(lesson.id),
                    }
                }),
            }
        }),
    }
}
