import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemahelpers"
import { relations } from "drizzle-orm"
import { UserCourseAccessTable } from "./userCourseAccess"

export const UserRoles = ["admin", "user"] as const
export type UserRole = typeof UserRoles[number]
export const UserRoleEnum = pgEnum("user_role", UserRoles)

export const UserTable = pgTable("users", {
    id,
    clerkUserId: text().unique().notNull(),
    email: text().unique().notNull(),
    name: text().notNull(),
    role: UserRoleEnum().notNull().default("user"),
    imageUrl:text(),
    deletedAt: timestamp({withTimezone: true}),
    createdAt,
    updatedAt
}) 

export const UserRelationships = relations(UserTable, ({ many }) => ({
  userCourseAccesses: many(UserCourseAccessTable),
}))
