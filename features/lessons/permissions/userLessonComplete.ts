import { db } from "@/drizzle/db"
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema"
import { and, eq, or } from "drizzle-orm"

export async function canUpdateUserLessonCompleteStatus(
  user: { userId: string | undefined },
  lessonId: string
) {

  if (user.userId == null) return false


  const [courseAccess] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .innerJoin(CourseTable, eq(CourseTable.id, UserCourseAccessTable.courseId))
    .innerJoin(
      CourseSectionTable,
      and(
        eq(CourseSectionTable.courseId, CourseTable.id),
        eq(CourseSectionTable.status,'public')
      )
    )
    .innerJoin(
      LessonTable,
      and(eq(LessonTable.sectionId, CourseSectionTable.id), or(eq(LessonTable.status, "public"), eq(LessonTable.status, 'preview')))
    )
    .where(
      and(
        eq(LessonTable.id, lessonId),
        eq(UserCourseAccessTable.userId, user.userId)
      )
    )
    .limit(1)

  return courseAccess != null
}
