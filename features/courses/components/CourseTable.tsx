'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatPlural } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { deleteCourse } from "../actions/courses";
export function CourseTable({ courses }: {
    courses: {
        id: string,
        name: string,
        sectionsCount: number,
        lessonsCount: number
        studentsCount: number
    }[]
}) {
    return (
        <div className="container ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            {formatPlural(courses.length, {
                                singular: "course",
                                plural: "courses",
                            })}
                        </TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses && courses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell className="flex flex-col gap-1">
                                <div className="font-semibold ">
                                    {course.name}
                                </div>
                                <div className="text-muted-foreground">
                                    {formatPlural(course.sectionsCount, { singular: 'section', plural: 'sections' })}{" "} . {" "}
                                    {formatPlural(course.lessonsCount, { singular: 'lesson', plural: 'lessons' })}
                                </div>


                            </TableCell>
                            <TableCell>{formatPlural(course.studentsCount, { singular: 'student', plural: 'students' })}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button asChild ><Link href={`/admin/courses/${course.id}/edit`}>Edit</Link></Button>
                                    <ActionButton variant={'destructive'} requireAreYouSure
                                        action={deleteCourse.bind(null, course.id)}>
                                        <Trash2Icon />
                                        <span className="sr-only">Delete</span>
                                    </ActionButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                    }
                </TableBody>

            </Table>
        </div>
    )
}