import { ActionButton } from "@/components/ActionButton";
import { VideoPlayer } from "@/components/VideoPlayer";
import { db } from "@/drizzle/db";
import { CourseSectionTable, LessonStatus, LessonTable, UserLessonCompleteTable } from "@/drizzle/schema";
import { updateLessonCompleteStatus } from "@/features/lessons/actions/updateLessonStatusComplete";
import { canViewLesson } from "@/features/lessons/permissions/lessons";
import { getCurrentUser } from "@/services/clerk";
import { Button } from "@heroui/button";
import { and, asc, desc, eq, gt, lt, or } from "drizzle-orm";
import { CheckSquare2Icon, XSquareIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params
    const Lesson = await getLesson(lessonId)
    if (Lesson == null || courseId == null) return notFound()

    return (
        <div className="container my-4">
            <Suspense fallback={<div>...</div>}>
                <SuspenseBoundary lesson={Lesson} courseId={courseId} />
            </Suspense>
        </div>
    );
}
async function SuspenseBoundary({ lesson, courseId }: {
    lesson: { id: string, videoUrl: string, name: string, description: string | null, status: LessonStatus, sectionId: string, order: number }
    courseId: string
}) {
    const { userId, role } = await getCurrentUser();
    const isLessonComplete = userId == null ? false :
        await getIsLessonComplete({ lessonId: lesson.id, userId })

    const canView = await canViewLesson({ role, userId }, lesson)

    if (!canView) return notFound()
    console.log(lesson)
    return (
        <div className="my-4 flex flex-col gap-4">
            <div className="aspect-video">

                {canView ? (
                    <div>
                        <VideoPlayer videoUrl={'https://www.youtube.com/watch?v=LXb3EKWsInQ'} lessonId={lesson.id} />
                    </div>
                ) : (
                    <div className="flex justify-center">

                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">{lesson.name}</h1>
                <div className="flex justify-between">
                    <Suspense fallback={<Button isLoading />}>
                        <ToLessonButton lesson={lesson} courseId={courseId} lessonFunc={getPreviousLesson}>
                            Previous
                        </ToLessonButton>
                    </Suspense>
                    <ActionButton action={updateLessonCompleteStatus.bind(null, lesson.id, !isLessonComplete)}>
                        {isLessonComplete ? (
                            <div className="flex items-center">
                                <CheckSquare2Icon /><span className="ml-2">Mark Incomplete</span>
                            </div>
                        ) : (
                            <div className="flex"><XSquareIcon /> <span className="ml-2">Mark Complete</span></div>
                        )}
                    </ActionButton>
                    <Suspense fallback={<Button isLoading />}>
                        <ToLessonButton lesson={lesson} courseId={courseId} lessonFunc={getNextLesson}>
                            Next
                        </ToLessonButton>
                    </Suspense>
                </div>
            </div>
            {lesson.description && <p>{lesson.description}</p>
            }
        </div>

    )
}
async function getLesson(lessonId: string) {
    return db.query.LessonTable.findFirst({
        columns: { id: true, videoUrl: true, status: true, sectionId: true, name: true, description: true, order: true },
        where: (eq(LessonTable.id, lessonId))
    })
}

async function getIsLessonComplete({ userId, lessonId }: { userId: string, lessonId: string }) {
    const data = await db.query.UserLessonCompleteTable.findFirst({
        where: and(eq(UserLessonCompleteTable.userId, userId), eq(UserLessonCompleteTable.lessonId, lessonId))
    })

    return data != null
}
async function getPreviousLesson(lesson: { id: string, sectionId: string, order: number }) {
    let previousLesson = await db.query.LessonTable.findFirst({
        where: and(lt(LessonTable.order, lesson.order), eq(LessonTable.sectionId, lesson.sectionId), or(eq(LessonTable.status, "public"), eq(LessonTable.status, 'preview'))),
        orderBy: desc(LessonTable.order), columns: { id: true }
    })
    if (previousLesson == null) {
        const Section = await db.query.CourseSectionTable.findFirst({
            where: eq(CourseSectionTable.id, lesson.sectionId),
            columns: { order: true, courseId: true }
        })
        if (Section == null) return
        const PreviousSection = await db.query.CourseSectionTable.findFirst({
            where: and(lt(CourseSectionTable.order, Section.order), eq(CourseSectionTable.courseId, Section.courseId), eq(CourseSectionTable.status, "public")),
            orderBy: desc(CourseSectionTable.order), columns: { id: true }
        })
        if (PreviousSection == null) return
        previousLesson = await db.query.LessonTable.findFirst({
            where: and(eq(LessonTable.sectionId, PreviousSection.id), or(eq(LessonTable.status, "public"), eq(LessonTable.status, 'preview'))),
            orderBy: desc(LessonTable.order), columns: { id: true }
        })

    }
    return previousLesson

}

async function getNextLesson(lesson: {
    id: string
    sectionId: string
    order: number
}) {
    let nextLesson = await db.query.LessonTable.findFirst({
        where: and(
            gt(LessonTable.order, lesson.order),
            eq(LessonTable.sectionId, lesson.sectionId),
            or(eq(LessonTable.status, "public"), eq(LessonTable.status, 'preview'))
        ),
        orderBy: asc(LessonTable.order),
        columns: { id: true },
    })

    if (nextLesson == null) {
        const section = await db.query.CourseSectionTable.findFirst({
            where: eq(CourseSectionTable.id, lesson.sectionId),
            columns: { order: true, courseId: true },
        })

        if (section == null) return

        const nextSection = await db.query.CourseSectionTable.findFirst({
            where: and(
                gt(CourseSectionTable.order, section.order),
                eq(CourseSectionTable.courseId, section.courseId),
                eq(CourseSectionTable.status, "public")
            ),
            orderBy: asc(CourseSectionTable.order),
            columns: { id: true },
        })

        if (nextSection == null) return

        nextLesson = await db.query.LessonTable.findFirst({
            where: and(eq(LessonTable.sectionId, nextSection.id), or(eq(LessonTable.status, "public"), eq(LessonTable.status, 'preview'))),
            orderBy: asc(LessonTable.order),
            columns: { id: true },
        })
    }

    return nextLesson
}
async function ToLessonButton({
    children,
    courseId,
    lessonFunc,
    lesson,
}: {
    children: ReactNode
    courseId: string
    lesson: {
        id: string
        sectionId: string
        order: number
    }
    lessonFunc: (lesson: {
        id: string
        sectionId: string
        order: number
    }) => Promise<{ id: string } | undefined>
}) {
    const toLesson = await lessonFunc(lesson)
    if (toLesson == null) return null

    return (
        <Button variant="bordered" as={Link} href={`/courses/${courseId}/lessons/${toLesson.id}`}>
            {children}
        </Button>
    )
}