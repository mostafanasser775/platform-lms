'use client'
import { formatPlural } from "@/lib/formatters";
import { Trash2Icon } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { deleteCourse } from "../actions/courses";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { TransationLinkBtn } from "@/components/TransationLinkBtn";

export function CourseTable({ courses }: {
    courses: { id: string, name: string, sectionsCount: number, lessonsCount: number, studentsCount: number }[]
}) {
    if (!courses || courses.length === 0) {
        return <div className="p-6 text-center text-gray-500">No courses available</div>;
    }

    return (
        <div className="border rounded-medium">
            <Table aria-label="Example static collection table" removeWrapper selectionMode="single">

                <TableHeader className="">
                    <TableColumn className="px-6 py-4 text-lg font-semibold">{formatPlural(courses.length, {
                        singular: "Course",
                        plural: "Courses",
                    })}</TableColumn>
                    <TableColumn className="px-6 py-4">Students</TableColumn>
                    <TableColumn className="px-6 py-4 text-right">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow key={course.id} >
                            <TableCell className="px-6">
                                <div className="font-semibold text-gray-900">{course.name}</div>
                                <div className="text-sm text-gray-500">
                                    {formatPlural(course.sectionsCount, { singular: 'section', plural: 'sections' })} • {formatPlural(course.lessonsCount, { singular: 'lesson', plural: 'lessons' })}
                                </div>
                            </TableCell>
                            <TableCell className="px-6">{formatPlural(course.studentsCount, { singular: 'student', plural: 'students' })}</TableCell>
                            <TableCell className="px-6 text-right">
                                <div className="flex items-center gap-3 justify-end">
                                    <TransationLinkBtn title="Edit" color="default"  variant="solid" link={`/admin/courses/${course.id}/edit`}/>
                                    <ActionButton variant="destructive" size="sm" requireAreYouSure action={deleteCourse.bind(null, course.id)}>
                                        <Trash2Icon className="w-4 h-4" />
                                    </ActionButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
