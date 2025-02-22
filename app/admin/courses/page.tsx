import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/features/courses/components/CourseTable";
import Link from "next/link";
import { CourseSectionTable, CourseTable as DBCourseTable, LessonTable, UserCourseAccessTable } from "@/drizzle/schema";
import { countDistinct, eq, asc } from "drizzle-orm";
import { Button } from "@heroui/button";
export default async function CoursesPage() {
    const courses = await getCourses()
    return (
        <div >
            <PageHeader title={'Courses'}>
                <Button as={Link} href={'/admin/courses/new'} radius="sm" color="primary">Add Course</Button>
            </PageHeader>
            <hr className="my-4"/>
            
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