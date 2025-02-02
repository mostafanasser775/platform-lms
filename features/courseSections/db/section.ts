import { db } from "@/drizzle/db";
import { CourseSectionTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getNextCourseSectionOrder(courseId: string) {
    const section = await db.query.CourseSectionTable.findFirst({
        columns: { order: true },
        where: ({ courseId: courseIdCol }, { eq }) => eq(courseIdCol, courseId),
        orderBy: ({ order }, { desc }) => desc(order)
    })
    return section ? section.order + 1 : 0
}

export async function insertCourseSectionDB(data: typeof CourseSectionTable.$inferInsert) {
    const [newSection] = await db.insert(CourseSectionTable).values(data).returning();
    if (newSection === null) throw new Error("Failed to create section");
    return newSection
    
}
export async function updateCourseSectionDB(id: string, data: Partial<typeof CourseSectionTable.$inferInsert>) {
    const [updatedSection] = await db.update(CourseSectionTable)
        .set(data)
        .where(eq(CourseSectionTable.id, id))
        .returning();
    if (updatedSection === null) throw new Error("Failed to update Section");
    return updatedSection
}
export async function updateCourseSectionOrdersDB(sectionIds: string[]) {
    console.log(sectionIds);

    await db.transaction(async (trx) => {
        for (const [index, id] of sectionIds.entries()) {
            await trx.update(CourseSectionTable)
                .set({ order: index })
                .where(eq(CourseSectionTable.id, id))
                .returning({
                    courseId: CourseSectionTable.courseId,
                    id: CourseSectionTable.id
                });
        }
    });
}
export async function deleteCourseSectionDB(id: string) {
    const [deletedSection] = await db.delete(CourseSectionTable)
        .where(eq(CourseSectionTable.id, id))
        .returning();
    if (deletedSection === null) throw new Error("Failed to delete Section");
    return deletedSection
}
