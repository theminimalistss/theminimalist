import { useKeyboardModality } from '@/hooks/useKeyboardModality';
import { useSpiralLoop } from '@/hooks/useSpiralLoop';
import type { Work } from '@/types/work';
import { WorkItem } from '@/ui/components/WorkItem';
import type { CollectionView } from '@/ui/sections/Hero/ViewControls';

const SPIRAL_SIZES =
  '(max-width: 767px) 59vw, (max-width: 1000px) 280px, (max-width: 1536px) 28vw, 430px';

type Props = {
  works: Work[];
  view: CollectionView;
  playing: boolean;
  onSelect: (work: Work) => void;
  paused?: boolean;
  frozen?: boolean;
  compact?: boolean;
  onInspect?: (inspecting: boolean) => void;
  reveal?: boolean;
};

export function WorkCollection({
  works,
  view,
  playing,
  onSelect,
  paused = true,
  frozen = false,
  compact = false,
  onInspect,
  reveal = false,
}: Props) {
  const spiral = view === 'spiral';
  const keyboard = useKeyboardModality();
  const stageRef = useSpiralLoop({
    count: works.length,
    paused,
    frozen,
    compact,
    enabled: spiral,
    keyboard,
  });
  return (
    <div
      className={spiral ? 'spiral-viewport' : 'gallery-viewport'}
      role={spiral ? 'region' : undefined}
      aria-label={
        spiral ? 'Moving collection. Switch to gallery to browse every study.' : undefined
      }
    >
      <ol
        ref={stageRef}
        className={spiral ? 'spiral-stage' : 'work-gallery'}
        aria-label="Selected design studies"
        onFocusCapture={
          spiral
            ? () => {
                if (keyboard.current) onInspect?.(true);
              }
            : undefined
        }
        onBlurCapture={
          spiral
            ? (event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) onInspect?.(false);
              }
            : undefined
        }
      >
        {works.map((work, index) => (
          <li
            key={work.id}
            data-spiral-item={spiral ? '' : undefined}
            data-reveal={reveal && !spiral ? 'item' : undefined}
          >
            <WorkItem
              work={work}
              index={index}
              playing={playing}
              onSelect={onSelect}
              priority={index === 0}
              {...(spiral ? { sizes: SPIRAL_SIZES } : {})}
            />
            {!spiral && (
              <div className="gallery-caption">
                <h2>{work.title}</h2>
                <span>{work.category}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
