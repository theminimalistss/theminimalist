import { useMediaPlayback } from '@/hooks/useMediaPlayback';
import type { VideoWork } from '@/types/work';
import { WorkImage } from '@/ui/components/WorkImage';

export function WorkVideo({ work, playing }: { work: VideoWork; playing: boolean }) {
  const { videoRef, unavailable, onError } = useMediaPlayback(playing);
  return (
    <div className="work-video">
      <WorkImage image={work.poster} alt={work.alt} preview />
      <video
        ref={videoRef}
        className={unavailable ? 'video-unavailable' : ''}
        muted
        loop
        playsInline
        preload="none"
        poster={work.poster.webpSmall}
        width={work.width}
        height={work.height}
        aria-hidden="true"
        onError={onError}
      >
        <source src={work.src} type="video/webm" />
        <source src={work.mp4} type="video/mp4" />
      </video>
    </div>
  );
}
