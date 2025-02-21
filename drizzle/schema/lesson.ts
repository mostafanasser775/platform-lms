import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemahelpers"
import { CourseSectionTable } from "./courseSections"
import { relations } from "drizzle-orm"
import { UserLessonCompleteTable } from "./userLessonComplete"

export const lessonStatuses = ["public", "private", "preview"] as const
export type LessonStatus = (typeof lessonStatuses)[number]
export const lessonStatusEnum = pgEnum("lesson_status", lessonStatuses)

export const LessonTable = pgTable("lessons", {
    id,
    name: text().notNull(),
    description: text(),
    youtubeVideoId: text().notNull(),
    videoUrl: text().notNull(),
    order: integer().notNull(),
    status: lessonStatusEnum().notNull().default("private"),
    sectionId: uuid().notNull().references(() => CourseSectionTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt
})
export const LessonRelationships = relations(
    LessonTable, ({ one, many }) => ({
        section: one(CourseSectionTable, {
            fields: [LessonTable.sectionId],
            references: [CourseSectionTable.id]
        }),
        UserLessonsComplete: many(UserLessonCompleteTable)
    }
    )
)