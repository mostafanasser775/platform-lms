'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { actionToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { CourseSectionStatus, CourseSectionStatuses } from "@/drizzle/schema";
import { sectionSchema } from "../schema/sectionSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSectionAction, updateSectionAction } from "../actions/section";
export function SectionForm({ section, courseId, onSuccess }:
    {
        section?: { id: string, name: string, status: CourseSectionStatus },
        courseId: string, onSuccess?: () => void
    }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof sectionSchema>>({
        resolver: zodResolver(sectionSchema),
        defaultValues: section ?? {
            name: '',
            status: 'public',
        },
    })
    async function onSubmit(values: z.infer<typeof sectionSchema>) {
        const action = section == null ? createSectionAction.bind(null, courseId) : updateSectionAction.bind(null, section.id, values)
        const result = await action(values)
        if (result)
            router.refresh()
        actionToast({ toastData: result });
        if (!result.error) onSuccess?.()
    }
    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-4 @container' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
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

                        <FormField control={form.control} name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <RequiredLabelIcon />
                                    <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>{
                                            CourseSectionStatuses.map((status) =>
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="self-end">
                        <Button disabled={form.formState.isSubmitting} type="submit">Save</Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}
