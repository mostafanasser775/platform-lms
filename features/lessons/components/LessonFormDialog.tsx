'use client'
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LessonStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import { LessonForm } from "./LessonForm";

export function LessonFormDialog({ sections, lesson, children,
    defaultSectionId
}: {
    sections: { id: string, name: string }[],
    children?: ReactNode,
    defaultSectionId?: string,
    lesson?: {
        id: string,
        name: string,
        status: LessonStatus,
        youtubeVideoId: string,
        description: string | null,
        sectionId: string
    }

}) {
    const [isOpen, setIsOpen] = useState(false);
    return (<>
        <Dialog open={isOpen} onOpenChange={setIsOpen}   >
            {children}
            <DialogContent className=" max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>{!lesson ? "Add Lesson" : `Edit Lesson ${lesson.name}`}</DialogTitle>
                </DialogHeader>
                <div className=" mt-4">
                    <LessonForm sections={sections} defaultSectionId={defaultSectionId}
                        lesson={lesson} onSuccess={() => setIsOpen(false)} />

                </div>
            </DialogContent>

        </Dialog>
    </>)
}