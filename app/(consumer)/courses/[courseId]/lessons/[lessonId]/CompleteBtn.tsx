'use client'
import { actionToast } from "@/components/ui/toast";
import { updateLessonCompleteStatus } from "@/features/lessons/actions/updateLessonStatusComplete";
import { Button } from "@heroui/button";
import { CheckSquare2Icon, XSquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function CompleteBtn({ lessonId, isLessonComplete }: { lessonId: string, isLessonComplete: boolean }) {
    const [isLoading, startTransition] = useTransition()
    const router = useRouter()
    function performAction() {
        startTransition(async () => {
            const data = await updateLessonCompleteStatus.bind(null, lessonId, !isLessonComplete)()
            router.refresh()
            actionToast({ toastData: data })
        })
    }

    return (
        <Button onPress={performAction} isLoading={isLoading}
            startContent={!isLoading && (isLessonComplete ? <CheckSquare2Icon size={20} /> : <XSquareIcon size={20} />)}>
            {isLessonComplete ? "Mark Incomplete" : "Mark Complete"}
        </Button>)
}