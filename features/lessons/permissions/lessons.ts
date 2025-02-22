import { db } from "@/drizzle/db"
import { and, eq } from "drizzle-orm";

import {

  CourseSectionTable,
  CourseTable,
  LessonStatus,
  LessonTable,
  UserCourseAccessTable,
  UserRole,
} from "@/drizzle/schema"

export function canCreateLessons({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

export function canUpdateLessons({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

export function canDeleteLessons({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}


export async function canViewLesson({ role, userId, }: {
  userId: string | undefined, role: UserRole | undefined
},
  lesson: { id: string; status: LessonStatus }
) {
  if (role === "admin" || lesson.status === "preview") return true
  if (userId == null || lesson.status === "private") return false


  const [data] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .leftJoin(CourseTable, eq(CourseTable.id, UserCourseAccessTable.courseId))
    .leftJoin(
      CourseSectionTable,
      and(eq(CourseSectionTable.courseId, CourseTable.id), eq(CourseSectionTable.status, "public")

      )
    )
    .leftJoin(
      LessonTable,
      and(eq(LessonTable.sectionId, CourseSectionTable.id), eq(LessonTable.status, "public"))
    )
    .where(
      and(
        eq(LessonTable.id, lesson.id),
        eq(UserCourseAccessTable.userId, userId)
      )
    )
    .limit(1)

  return data != null && data.courseId != null
}
