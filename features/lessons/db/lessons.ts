import { db } from "@/drizzle/db"
import { CourseSectionTable, LessonTable, UserLessonCompleteTable } from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

export async function getNextCourseLessonOrderDB(sectionId: string) {
  const lesson = await db.query.LessonTable.findFirst({
    columns: { order: true },
    where: ({ sectionId: sectionIdCol }, { eq }) => eq(sectionIdCol, sectionId),
    orderBy: ({ order }, { desc }) => desc(order),
  })

  return lesson ? lesson.order + 1 : 0
}

export async function insertLessonDB(data: typeof LessonTable.$inferInsert) {
  const [newLesson] = await db.transaction(async trx => {
    const [[newLesson], section] = await Promise.all([
      trx.insert(LessonTable).values(data).returning(),
      trx.query.CourseSectionTable.findFirst({
        columns: { courseId: true },
        where: eq(CourseSectionTable.id, data.sectionId),
      }),
    ])

    if (section == null) return trx.rollback()

    return [newLesson, section.courseId]
  })
  if (newLesson == null) throw new Error("Failed to create lesson")


  return newLesson
}

export async function updateLessonDB(
  id: string,
  data: Partial<typeof LessonTable.$inferInsert>
) {
  const [updatedLesson] = await db.transaction(async trx => {
    const currentLesson = await trx.query.LessonTable.findFirst({
      where: eq(LessonTable.id, id),
      columns: { sectionId: true },
    })

    if (
      data.sectionId != null &&
      currentLesson?.sectionId !== data.sectionId &&
      data.order == null
    ) {
      data.order = await getNextCourseLessonOrderDB(data.sectionId)
    }

    const [updatedLesson] = await trx
      .update(LessonTable)
      .set(data)
      .where(eq(LessonTable.id, id))
      .returning()
    if (updatedLesson == null) {
      trx.rollback()
      throw new Error("Failed to update lesson")
    }

    const section = await trx.query.CourseSectionTable.findFirst({
      columns: { courseId: true },
      where: eq(CourseSectionTable.id, updatedLesson.sectionId),
    })

    if (section == null) return trx.rollback()

    return [updatedLesson, section.courseId]
  })

  return updatedLesson
}

export async function deleteLessonDB(id: string) {
  const [deletedLesson] = await db.transaction(async trx => {
    const [deletedLesson] = await trx
      .delete(LessonTable)
      .where(eq(LessonTable.id, id))
      .returning()
    if (deletedLesson == null) {
      trx.rollback()
      throw new Error("Failed to delete lesson")
    }

    const section = await trx.query.CourseSectionTable.findFirst({
      columns: { courseId: true },
      where: ({ id }, { eq }) => eq(id, deletedLesson.sectionId),
    })

    if (section == null) return trx.rollback()

    return [deletedLesson, section.courseId]
  })

  return deletedLesson
}

export async function updateLessonOrdersDB(lessonIds: string[]) {
  await db.transaction(async trx => {
    const lessons = await Promise.all(
      lessonIds.map((id, index) =>
        db.update(LessonTable).set({ order: index }).where(eq(LessonTable.id, id))
          .returning({
            sectionId: LessonTable.sectionId,
            id: LessonTable.id,
          })
      )
    )
    const sectionId = lessons[0]?.[0]?.sectionId
    if (sectionId == null) return trx.rollback()

    const section = await trx.query.CourseSectionTable.findFirst({
      columns: { courseId: true },
      where: ({ id }, { eq }) => eq(id, sectionId),
    })

    if (section == null) return trx.rollback()

    return [lessons, section.courseId]
  })

}

export async function updateLessonCompleteStatusDB({ lessonId, userId, complete }: { lessonId: string, userId: string, complete: boolean }) {
  let completeLesson: { lessonId: string, userId: string } | undefined;
  if (complete) {
    const [lesson] = await db.insert(UserLessonCompleteTable).values({
      lessonId, userId
    }).onConflictDoNothing().returning()
    completeLesson = lesson
  }
  else {
    const [lesson] = await db.delete(UserLessonCompleteTable).
      where(and(eq(UserLessonCompleteTable.userId, userId), eq(UserLessonCompleteTable.lessonId, lessonId)))
      .returning()
    completeLesson = lesson

  }
  return completeLesson
}