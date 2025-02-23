"use client"
import { LessonStatus } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { EyeClosed, VideoIcon } from "lucide-react"
import { ActionButton } from "@/components/ActionButton"
import { SortableItem, SortableList } from "@/components/SortableList"
import { deleteLessonAction, updateLessonOrdersAction } from "../actions/lesson"
import { useEffect, useState } from "react"
import { LessonModal } from "./LessonModal"

export function SortableLessonList({ sections, lessons }: {
  sections: { id: string, name: string }[]
  lessons: {
    id: string
    name: string
    status: LessonStatus,
    videoUrl: string,
    youtubeVideoId: string,
    description: string | null,
    sectionId: string
  }[]
}) {
  const [sortableKey, setSortableKey] = useState(0);
  useEffect(() => {
    setSortableKey(sortableKey + 1)
  }, [lessons]);
  return (
    console.log(lessons),
    <SortableList key={sortableKey} items={lessons} onOrderChange={updateLessonOrdersAction}>
      {items =>
        items.map(lesson => (
          <SortableItem
            key={lesson.id}
            id={lesson.id}
            className="flex items-center gap-1"
          >
            <div className={cn("contents", lesson.status === "private" && "text-muted-foreground")}>
              {lesson.status === "private" && <EyeClosed className="size-4" />}
              {lesson.status === "preview" && <VideoIcon className="size-4" />}
              {lesson.name}
            </div>
            <LessonModal lesson={lesson} sections={sections} defaultSectionId={""} />

            <ActionButton action={deleteLessonAction.bind(null, lesson.id)} />

          </SortableItem>
        ))
      }
    </SortableList>
  )
}
