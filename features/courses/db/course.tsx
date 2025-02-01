import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
    console.log(data)
    const [newCourse] = await db.insert(CourseTable).values(data).returning();
    if (newCourse === null) throw new Error("Failed to create course");
    return newCourse
}
export async function updateCourseDb(id: string, data: typeof CourseTable.$inferInsert) {
    const [UpdatedCourse] = await db.update(CourseTable).set(data).where(eq(CourseTable.id, id)).returning();
    if (UpdatedCourse === null) throw new Error("Failed to update course");
    return UpdatedCourse
}
export async function deleteCourseDB(id: string) {
    const [deletedCourse] = await db.delete(CourseTable).where(eq(CourseTable.id, id)).returning();
    if (deletedCourse === null) throw new Error("Failed to delete course");
    return deletedCourse
}
