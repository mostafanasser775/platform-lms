"use server"

import { z } from "zod"
import { getCurrentUser } from "@/services/clerk"
import {
    canCreateLessons,
    canDeleteLessons,
    canUpdateLessons,
} from "../permissions/lessons"
import { lessonSchema } from "../schema/lesson"
import {
    deleteLessonDB, getNextCourseLessonOrderDB,
    insertLessonDB, updateLessonDB, updateLessonOrdersDB
} from "../db/lessons"


export async function createLessonAction(unsafeData: z.infer<typeof lessonSchema>) {
    const { success, data } = lessonSchema.safeParse(unsafeData)

    if (!success || !canCreateLessons(await getCurrentUser())) {
        return { error: true, message: "There was an error creating your lesson" }
    }

    const order = await getNextCourseLessonOrderDB(data.sectionId)

    await insertLessonDB({ ...data, order })

    return { error: false, message: "Successfully created your lesson" }
}

export async function updateLessonAction(
    id: string,
    unsafeData: z.infer<typeof lessonSchema>
) {
    const { success, data } = lessonSchema.safeParse(unsafeData)

    if (!success || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: "There was an error updating your lesson" }
    }

    await updateLessonDB(id, data)

    return { error: false, message: "Successfully updated your lesson" }
}

export async function deleteLessonAction(id: string) {
    if (!canDeleteLessons(await getCurrentUser())) {
        return { error: true, message: "Error deleting your lesson" }
    }

    await deleteLessonDB(id)

    return { error: false, message: "Successfully deleted your lesson" }
}

export async function updateLessonOrdersAction(lessonIds: string[]) {
    if (lessonIds.length === 0 || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: "Error reordering your lessons" }
    }

    await updateLessonOrdersDB(lessonIds)

    return { error: false, message: "Successfully reordered your lessons" }
}
