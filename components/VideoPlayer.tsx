'use client';

import { updateLessonCompleteStatus } from '@/features/lessons/actions/updateLessonStatusComplete';
import { useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import ReactPlayer from 'react-player';

export function VideoPlayer({ videoUrl, lessonId }: { videoUrl: string, lessonId: string }) {
    const [, startTransition] = useTransition();
    const router = useRouter()
    async function onvideoEnd() {
        startTransition(async () => {
            await updateLessonCompleteStatus(lessonId, true)
            router.refresh()
        });
    }
    if (videoUrl && lessonId)
        return (
            <div className="flex justify-center  h-[600px] min-h-[500px] ">
                <Suspense fallback={<div>...loading</div>} >
                    <ReactPlayer url={videoUrl} controls width='100%'
                        height='100%'

                        onEnded={onvideoEnd}
                    />

                </Suspense>
            </div>
        );
    else return <div>
        Loadng...
    </div>
}
