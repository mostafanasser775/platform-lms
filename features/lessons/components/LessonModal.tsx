'use client'
import { LessonStatus } from "@/drizzle/schema";
import { useState } from "react";
import { LessonForm } from "./LessonForm";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";
import { EditIcon, PlusCircleIcon } from "lucide-react";
export function LessonModal({ sections, lesson, defaultSectionId }: {
    sections: { id: string, name: string }[],
    defaultSectionId?: string,
    lesson?: { id: string, name: string, status: LessonStatus, youtubeVideoId: string, videoUrl: string, description: string | null, sectionId: string }

}) {
    const [isOpen, setIsOpen] = useState(false);
    return (<>
        <>
            <Button variant="bordered" className="ml-auto"
                onPress={() => setIsOpen(!isOpen)} startContent={!lesson ? <PlusCircleIcon size={20} /> : <EditIcon size={20} />}>
                {!lesson ? "Add Lesson" : `Edit Lesson`}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="xl" isDismissable={false}>
                <ModalContent>
                    <ModalHeader className="flex flex-col border-b">{!lesson ? "Add Lesson" : `Edit Lesson ${lesson.name}`}</ModalHeader>
                    <ModalBody >
                        <LessonForm sections={sections} defaultSectionId={defaultSectionId}
                            lesson={lesson} onSuccess={() => setIsOpen(false)}  onOpenChange={() => setIsOpen(!isOpen)} />

                    </ModalBody>

                </ModalContent>
            </Modal>
        </>

    </>)
}