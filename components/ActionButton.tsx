"use client"

import { useState, useTransition } from "react"
import { Trash2Icon } from "lucide-react"

import { useRouter } from "next/navigation"
import { actionToast } from "./ui/toast"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button } from "@heroui/button"

export function ActionButton({ action, title }: { title?: string, action: () => Promise<{ error: boolean; message: string }> }) {
    {
        const [isLoading, startTransition] = useTransition()
        const [isOpen, setIsOpen] = useState(false)
        const router = useRouter()

        function performAction() {
            startTransition(async () => {
                const data = await action()
                router.refresh()
                actionToast({ toastData: data })  
                setIsOpen(!isOpen)

            })
        }


        return (
            <>
                <Button onPress={() => setIsOpen(!isOpen)} isIconOnly={!title} color={title === 'Refund' ? "warning" : "danger"} radius="sm">{title && title}{!title && (isLoading ? "..." : <Trash2Icon size={20} />)}</Button >
                <Modal isOpen={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                    <ModalContent>
                        <ModalHeader className="border-b">Delete</ModalHeader>
                        <ModalBody className="my-4">
                            <span className="font-semibold">Are you sure?</span>
                            <span>
                                This action cannot be undone.
                            </span>
                        </ModalBody>
                        <ModalFooter className="border-t">
                            <Button isDisabled={isLoading} onPress={() => setIsOpen(!isOpen)} radius="sm">Cancel</Button>
                            <Button disabled={isLoading} isLoading={isLoading} onPress={performAction} color="danger" radius="sm">Yes</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )

    }
}

