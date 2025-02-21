'use server'

import { getCurrentUser } from "@/services/clerk"
import { updateLessonCompleteStatusDB } from "../db/lessons"

export async function updateLessonCompleteStatus(lessonId: string, complete: boolean) {
    const { userId } = await getCurrentUser()
    if (userId)
        await updateLessonCompleteStatusDB({ lessonId, userId, complete })
    return {error:false,message:"Lesson Marked complete"}
}