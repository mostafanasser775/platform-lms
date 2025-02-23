import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { CourseSectionTable, CourseTable as DBCourseTable, LessonTable, UserCourseAccessTable } from "@/drizzle/schema";
import { countDistinct, eq, asc } from "drizzle-orm";

import { TransationLinkBtn } from "@/components/TransationLinkBtn";
import { PlusIcon } from "lucide-react";
export default async function CoursesPage() {
    const courses = await getCourses()
    return (
        <div >
            <PageHeader title={'Courses'}>
                <TransationLinkBtn icon={<PlusIcon size={20}/>} variant="solid" color="primary" link="/admin/courses/new" title="Add Course"/>
            </PageHeader>
            <hr className="my-4" />

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