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
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lessonSchema } from "../schema/lesson";
import { Textarea } from "@/components/ui/textarea";
import { createLessonAction, updateLessonAction } from "../actions/lesson";
import { YouTubeVideoPlayer } from "./YoutubeVideoPlayer";
export function LessonForm({ sections, defaultSectionId, lesson, onSuccess }:
    {
        sections: { id: string, name: string, }[],
        defaultSectionId?: string,
         onSuccess?: () => void,
        lesson?: {
            id: string,
            name: string,
            status: LessonStatus,
            youtubeVideoId: string,
            description: string | null,
            sectionId: string
        }
    }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: lesson?.name ?? '',
            status: lesson?.status ?? 'public',
            youtubeVideoId: lesson?.youtubeVideoId ?? '',
            description: lesson?.description ?? null,
            sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? ''
        },
    })
    async function onSubmit(values: z.infer<typeof lessonSchema>) {
        const action = lesson == null ? createLessonAction : updateLessonAction.bind(null, lesson.id, values)
        const result = await action(values)
        if (result.error===false)
            router.refresh()
        actionToast({ toastData: result });
        if (!result.error) onSuccess?.()
    }
    const videoId = form.watch('youtubeVideoId')

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
                                    <FormControl><Input {...field} className="border-gray-300 rounded-md" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name='youtubeVideoId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Youtube Video Id</FormLabel>
                                    <RequiredLabelIcon />
                                    <FormControl><Input {...field} className="border-gray-300 rounded-md" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="sectionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section</FormLabel>
                                    <RequiredLabelIcon />
                                    <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                        <FormControl>
                                            <SelectTrigger className="border-gray-300 rounded-md">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sections.map(section =>
                                                <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
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
                                            <SelectTrigger className="border-gray-300 rounded-md">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent> {
                                            lessonStatuses.map((status) =>
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className="min-h-20 resize-none border-gray-300 rounded-md" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="self-end">
                        <Button disabled={form.formState.isSubmitting} type="submit">Save</Button>
                    </div>
                    {videoId && <YouTubeVideoPlayer videoId={videoId} />}
                </form>
            </Form>
        </div>
    )
}

