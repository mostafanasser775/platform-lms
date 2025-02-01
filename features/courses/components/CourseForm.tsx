'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { couseSchema } from '@/features/courses/schema/courseSchema'
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCourse, updateCourse } from "../actions/courses";
import { actionToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
export function CourseForm({ course }: { course?: { id: string, name: string, description: string } }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof couseSchema>>({
        resolver: zodResolver(couseSchema),
        defaultValues: course ?? {
            name: '',
            description: '',
        },
    })
    async function onSubmit(values: z.infer<typeof couseSchema>) {
        const action = course == null ? createCourse : updateCourse.bind(null, course.id, values)
        const result = await action(values)
        if (result)
            router.refresh()
        actionToast({
            toastData: {
                error: result.error ? result.message : undefined,
                message: result.message,
            },
        })
    }
    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <RequiredLabelIcon />
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />

                    <FormField control={form.control} name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <RequiredLabelIcon />
                                <FormControl><Textarea className="min-h-20 resize-none" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="self-end">
                        <Button disabled={form.formState.isSubmitting} type="submit">Save</Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}
