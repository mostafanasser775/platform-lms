'use client'
import Youtube from 'react-youtube';

export function YouTubeVideoPlayer({ videoId, onFinishedVideo }: { videoId: string, onFinishedVideo?: () => void }) {
    return (<div className="aspect-video mt-4">
        <Youtube className='w-full h-full rounded-md' opts={{width:'100%',height:'100%'}} videoId={videoId} onEnd={onFinishedVideo} />
    </div>
    )
}