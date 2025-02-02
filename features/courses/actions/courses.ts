'use server'

import { z } from "zod";
import { couseSchema } from "../schema/courseSchema";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourse, candeleteCourse, canUpdateCourses } from "../permissions/course";
import { deleteCourseDB, insertCourse, updateCourseDb } from "../db/course";
import { redirect } from "next/navigation";
export async function createCourse(unparsedValues: z.infer<typeof couseSchema>) {
    const { success, data } = couseSchema.safeParse(unparsedValues)

    if (!success || !canCreateCourse(await getCurrentUser())) {
        return { error: true, message: "there is an error in data" }
    }
    const course = await insertCourse(data)
    redirect(`/admin/courses/${course?.id}/edit`);
}


export async function deleteCourse(id: string) {
    if (!candeleteCourse(await getCurrentUser())) {
        return { error: true, message: "Failed to Delete Your Course" }
    }
    await deleteCourseDB(id)
    return { error: false, message: 'successfully deleted course' }

}
export async function updateCourse(id: string, unparsedValues: z.infer<typeof couseSchema>) {
    const { success, data } = couseSchema.safeParse(unparsedValues)

    if (!success || !canUpdateCourses(await getCurrentUser())) {
        return { error: true, message: "there is an error in data" }
    }
    await updateCourseDb(id, data)
    return { error: false, message: 'successfully Update course' }
}

