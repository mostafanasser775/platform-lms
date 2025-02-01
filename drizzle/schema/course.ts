import { pgTable, text } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "@/drizzle/schemahelpers";
import { relations } from "drizzle-orm";
import { CourseProdcutTable } from "./courseProduct";
import { UserCourseAccessTable } from "./userCourseAccess";
import { CourseSectionTable } from "./courseSections";
export const CourseTable = pgTable(("courses"), {
    id,
    name: text().unique().notNull(),
    description: text().notNull(),
    createdAt,
    updatedAt
})


export const CourseRelationships = relations(CourseTable, ({ many }) => ({
    courseProducts: many(CourseProdcutTable),
    userCourseAccesses: many(UserCourseAccessTable),
    courseSections: many(CourseSectionTable),
    
  }))
  