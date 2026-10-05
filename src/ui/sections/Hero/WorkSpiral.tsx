import { useSpiralLoop } from '@/hooks/useSpiralLoop';
import type { Work } from '@/types/work';
import { WorkItem } from '@/ui/components/WorkItem';

type Props = {
  works: Work[];
  paused: boolean;
  mediaPlaying: boolean;
  compact: boolean;
  onSelect: (work: Work) => void;
  onInspect: (inspecting: boolean) => void;
};

export function WorkSpiral({ works, paused, mediaPlaying, compact, onSelect, onInspect }: Props) {
  const ref = useSpiralLoop({ count: works.length, paused, compact });
  return (
    <div
      className="spiral-viewport"
      aria-label="Moving collection. Switch to gallery to browse every study."
      role="region"
    >
      <div
        ref={ref}
        className="spiral-stage"
        onFocusCapture={() => onInspect(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) onInspect(false);
        }}
      >
        {works.map((work, index) => (
          <div key={work.id} className="spiral-item" data-spiral-item>
            <WorkItem
              work={work}
              index={index}
              playing={mediaPlaying}
              onSelect={onSelect}
              priority={index === 0}
              sizes="(max-width: 767px) 59vw, (max-width: 1000px) 280px, (max-width: 1536px) 28vw, 430px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
