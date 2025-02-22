'use client'
import { CourseSectionStatus } from "@/drizzle/schema";
import { useState } from "react";
import { SectionForm } from "./SectionForm";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";
import {  EditIcon, PlusIcon } from "lucide-react";

export function SectionModal({ courseId, section }: { courseId: string, section?: { id: string, name: string, status: CourseSectionStatus } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button size="md" radius="sm" variant="bordered" startContent={section?<EditIcon size={20}/>:<PlusIcon size={20}/>}
            onPress={() => setIsOpen(!isOpen)}>{!section ? "Add Section" : `Edit Section`}</Button>
            <Modal isOpen={isOpen} onOpenChange={setIsOpen} >
                <ModalContent>
                    <ModalHeader>
                        {!section ? "Add Section" : `Edit Section ${section.name}`}
                    </ModalHeader>
                    <ModalBody>
                        <SectionForm section={section} courseId={courseId} onSuccess={() => setIsOpen(false)} />
                    </ModalBody>

                </ModalContent>


            </Modal >
        </>)
}