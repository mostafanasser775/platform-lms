'use client';

import { updateLessonCompleteStatus } from '@/features/lessons/actions/updateLessonStatusComplete';
import { Suspense } from 'react';
import ReactPlayer from 'react-player';

export function VideoPlayer({ videoUrl, lessonId }: { videoUrl: string, lessonId: string }) {
    if (videoUrl && lessonId)
        return (
            <div className="flex justify-center  h-[600px] min-h-[500px] ">
                <Suspense fallback={<div>...loading</div>} >
                    <ReactPlayer url={videoUrl} controls width='100%'
                        height='100%'
                        onEnded={() => updateLessonCompleteStatus(lessonId, true)}
                    />

                </Suspense>
            </div>
        );
        else return <div>
            Loadng...
        </div>
}
