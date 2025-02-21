'use client'
import { LessonStatus } from "@/drizzle/schema";
import { useState } from "react";
import { LessonForm } from "./LessonForm";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { PlusCircleIcon } from "lucide-react";
export function LessonFormDialog({ sections, lesson, defaultSectionId }: {
    sections: { id: string, name: string }[],
    defaultSectionId?: string,
    lesson?: { id: string, name: string, status: LessonStatus, youtubeVideoId: string, videoUrl: string, description: string | null, sectionId: string }

}) {
    const [isOpen, setIsOpen] = useState(false);
    return (<>
        <>
            <Button variant="bordered" className="ml-auto"
                onPress={() => setIsOpen(!isOpen)} startContent={<PlusCircleIcon size={24} />}>
                {!lesson ? "Add Lesson" : `Edit`}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="xl" >
                <ModalContent>
                    <ModalHeader className="flex flex-col border-b">{!lesson ? "Add Lesson" : `Edit Lesson ${lesson.name}`}</ModalHeader>
                    <ModalBody >
                        <div >
                            <LessonForm sections={sections} defaultSectionId={defaultSectionId}
                                lesson={lesson} onSuccess={() => setIsOpen(false)} />
                        </div>
                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>

    </>)
}