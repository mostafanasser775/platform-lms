import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/features/courses/components/CourseTable";
import Link from "next/link";
import { CourseSectionTable, CourseTable as DBCourseTable, LessonTable, UserCourseAccessTable } from "@/drizzle/schema";
import { countDistinct, eq, asc } from "drizzle-orm";
export default async function CoursesPage() {
    const courses = await getCourses()
    return (
        <div className="container my-6">
            <PageHeader title={'Courses'}>
                <Button asChild>
                    <Link href={'/admin/courses/new'}>Add Course</Link>
                </Button>
            </PageHeader>
            <CourseTable courses={courses} />
        </div>
    );
}
async function getCourses() {
    return await db.select({
        id: DBCourseTable.id,
        name: DBCourseTable.name,
        description: DBCourseTable.description,
        sectionsCount: countDistinct(CourseSectionTable),
        lessonsCount: countDistinct(LessonTable),
        studentsCount: countDistinct(UserCourseAccessTable)

    }).from(DBCourseTable)
        .leftJoin(CourseSectionTable, eq(CourseSectionTable.courseId, DBCourseTable.id))
        .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
        .leftJoin(UserCourseAccessTable, eq(UserCourseAccessTable.courseId, DBCourseTable.id))
        .orderBy(asc(DBCourseTable.name))
        .groupBy(DBCourseTable.id)
}