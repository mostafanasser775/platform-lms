'use server'

import { z } from "zod";
import { getCurrentUser } from "@/services/clerk";
import { sectionSchema } from "../schema/sectionSchema";
import { canCreateSection, canDeleteSection, canUpdateSection } from "../permissions/section";
import { deleteCourseSectionDB, getNextCourseSectionOrder, insertCourseSectionDB, updateCourseSectionDB, updateCourseSectionOrdersDB } from "../db/section";
export async function createSectionAction(courseId: string, unparsedValues: z.infer<typeof sectionSchema>) {
    const { success, data } = sectionSchema.safeParse(unparsedValues)

    if (!success || !canCreateSection(await getCurrentUser())) {
        return { error: true, message: "there is an error Creating Section" }
    }
    const order = await getNextCourseSectionOrder(courseId)
    await insertCourseSectionDB({ ...data, courseId, order })
    return { error: false, message: 'successfully Added Section' }

}


export async function updateSectionAction(id: string, unparsedValues: z.infer<typeof sectionSchema>) {
    const { success, data } = sectionSchema.safeParse(unparsedValues)

    if (!success || !canDeleteSection(await getCurrentUser())) {
        return { error: true, message: "There is an error Updating Section" }
    }
    await updateCourseSectionDB(id, data)
    return { error: false, message: 'Successfully Update section' }
}

export async function updateSectionOrderAction(sectionIds: string[]) {
    console.log(sectionIds)
    if(sectionIds.length === 0 || !canUpdateSection(await getCurrentUser())) {
        return { error: true, message: "There is an error Updating Section" }
    }

    await updateCourseSectionOrdersDB(sectionIds)
    return { error: false, message: 'Successfully reordered Your Sections' }
}


export async function deleteSectionAction(id: string) {
    if (!canUpdateSection(await getCurrentUser())) {
        return { error: true, message: "Failed to Delete Your Section" }
    }
    await deleteCourseSectionDB(id)
    return { error: true, message: 'Successfully deleted section' }

}