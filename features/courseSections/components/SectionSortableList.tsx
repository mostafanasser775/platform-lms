"use client"
import { CourseSectionStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { EyeClosed } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { SortableItem, SortableList } from "@/components/SortableList";
import { deleteSectionAction, updateSectionOrderAction } from "../actions/section";
import { useEffect, useState } from "react";
import { SectionModal } from "./SectionModal";

export function SortableSectionList({ courseId, sections, }: {
  courseId: string, sections: { id: string, name: string, status: CourseSectionStatus }[];
}) {
  const [sortableKey, setSortableKey] = useState(0);

  useEffect(() => {
    setSortableKey((prev) => prev + 1);
  }, [sections]);

  return (
    <div className="shadow-sm">
      <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">Sections</div>
      <SortableList key={sortableKey} items={sections} onOrderChange={updateSectionOrderAction}>
        {(items) => (
          <div className="divide-y border-t">
            {items.map((section) => (
              <SortableItem key={section.id} id={section.id} className="grid grid-cols-3 items-center p-3 hover:bg-gray-50">
                {/* Section Name */}
                <div className={cn("flex items-center gap-2", section.status === "private" && "text-muted-foreground")}>
                  {section.status === "private" && <EyeClosed className="size-4" />}
                  <span>{section.name}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end col-span-2 gap-x-4 items-center">
                  <SectionModal section={section} courseId={courseId} />
                  <ActionButton action={deleteSectionAction.bind(null, section.id)} />
                </div>
              </SortableItem>
            ))}
          </div>
        )}
      </SortableList>
    </div>
  );
}