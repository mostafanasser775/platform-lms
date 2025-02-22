'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { actionToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import { lessonSchema } from "../schema/lesson";
import { createLessonAction, updateLessonAction } from "../actions/lesson";
import VideoUpload from "@/components/cloudinaryUpload";
import { Button } from "@heroui/button";
import { X } from "lucide-react";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
export function LessonForm({ sections, defaultSectionId, lesson, onSuccess }:
    {   sections: { id: string, name: string, }[],
        defaultSectionId?: string,
        onSuccess?: () => void,
        lesson?: { id: string, name: string, status: LessonStatus, youtubeVideoId: string, videoUrl: string, description: string | null, sectionId: string }
    }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: lesson?.name ?? '',
            status: lesson?.status ?? 'public',
            youtubeVideoId: lesson?.youtubeVideoId ?? 'www.youtube.com',
            videoUrl: lesson?.videoUrl ?? '',
            description: lesson?.description ?? null,
            sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? ''
        },
    })

    async function onSubmit(values: z.infer<typeof lessonSchema>) {
        const action = lesson == null ? createLessonAction : updateLessonAction.bind(null, lesson.id, values)

        const result = await action(values)
        if (result.error === false)
            router.refresh()
        actionToast({ toastData: result });
        if (!result.error) onSuccess?.()
    }

    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-4 @container' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input variant="bordered" radius="sm" label='Name'
                                        placeholder="Enter Lesson Name" isRequired labelPlacement="outside"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">


                        {/* <FormField control={form.control} name="sectionId"
                            render={({ field }) => (
                                <FormItem>
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
                        /> */}

                        <FormField control={form.control} name="sectionId"
                            render={({ field }) => (
                                <FormItem>
                                    <Select isRequired variant="bordered" radius="sm" label="Status" labelPlacement="outside"
                                        placeholder="Select an status"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        selectedKeys={[field.value]}
                                    >
                                        {sections.map(section =>
                                            <SelectItem key={section.id} textValue={section.name}>{section.name}</SelectItem>
                                        )}

                                    </Select>
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
                                        {lessonStatuses.map((status) =>
                                            <SelectItem key={status}>
                                                {status}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <FormField control={form.control} name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea variant="bordered" radius="sm" label='Description'
                                        placeholder="Enter Lesson Name" isRequired labelPlacement="outside" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!form.getValues('videoUrl') ?
                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Video</FormLabel>
                                    <VideoUpload onUploadSuccess={(url) => field.onChange(url)} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> :
                        <div className=" relative">
                            {form.getValues('videoUrl') && (
                                <div>
                                    <Button isIconOnly={true} variant="ghost" size="sm"
                                        className="absolute top-2 right-2 z-50" onPress={() => { form.setValue('videoUrl', ''); form.trigger('videoUrl') }} >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <video width="100%" className="mt-4 rounded-lg shadow-md max-h-52" controls>
                                        <source src={form.getValues('videoUrl')} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                        </div>
                    }

                    <div className="self-end">
                        <Button disabled={form.formState.isSubmitting} type="submit">Save</Button>
                    </div>
                    {/* {videoId && <YouTubeVideoPlayer videoId={videoId} />} */}
                </form>
            </Form>
        </div>
    )
}

