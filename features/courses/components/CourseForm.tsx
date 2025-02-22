'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { couseSchema } from '@/features/courses/schema/courseSchema'
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createCourse, updateCourse } from "../actions/courses";
import { actionToast } from "@/components/ui/toast";
//import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTransition } from "react";

export function CourseForm({ course }: { course?: { id: string, name: string, description: string } }) {
   // const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof couseSchema>>({
        resolver: zodResolver(couseSchema),
        defaultValues: course ?? {
            name: '',
            description: '',
        },
    })
    async function onSubmit(values: z.infer<typeof couseSchema>) {
        const action = course == null ? createCourse : updateCourse.bind(null, course.id, values)

        startTransition(async () => {
            const result = await action(values)
            //  if (result.error === false)
            //     router.refresh()
            actionToast({ toastData: result });
        });

    }
    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input isRequired variant='bordered' label='Course Name' 
                                    placeholder="Enter Course Name" labelPlacement='outside' radius="sm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl><Textarea
                                    variant="bordered" isRequired label='Description' 
                                     labelPlacement="outside" placeholder="Enter Course Description"

                                    {...field} />
                                    
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <hr />
                    <div className="self-end">
                        <Button disabled={form.formState.isSubmitting} type="submit" isLoading={isPending}>Save</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
