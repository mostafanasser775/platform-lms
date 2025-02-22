'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { actionToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { CourseSectionStatus, CourseSectionStatuses } from "@/drizzle/schema";
import { sectionSchema } from "../schema/sectionSchema";
import { createSectionAction, updateSectionAction } from "../actions/section";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTransition } from "react";
import { Select, SelectItem } from "@heroui/select";
export function SectionForm({ section, courseId, onSuccess }:
    {
        section?: { id: string, name: string, status: CourseSectionStatus },
        courseId: string, onSuccess?: () => void
    }) {
    const [isPending, startTransition] = useTransition();

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
        startTransition(async () => {
            const result = await action(values)
            if (result.error === false)
                router.refresh()
            actionToast({ toastData: result });
            if (!result.error) onSuccess?.()

        });

    }
    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-4 @container' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
                        <FormField control={form.control} name="name"
                            render={({ field }) => (
                                <FormItem>

                                    <FormControl>
                                        <Input {...field} variant='bordered' radius="sm" label='Name'
                                            placeholder="Enter Name"
                                            isRequired labelPlacement="outside"
                                        />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                
                        <FormField control={form.control} name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <Select isRequired variant="bordered" radius="sm" label="Status" labelPlacement="outside"
                                        placeholder="Select an status"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        selectedKeys={[field.value]}
                                    >
                                        {CourseSectionStatuses.map((status) =>
                                            <SelectItem key={status} textValue={status}>
                                                {status}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <hr className="my-4" />
                    <div className="self-end">
                        <Button isLoading={isPending}
                            type="submit" radius="sm" variant="solid" color="default">Save</Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}
