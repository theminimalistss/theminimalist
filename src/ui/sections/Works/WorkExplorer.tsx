import { useWorkHover } from '@/hooks/useWorkHover';
import type { Work } from '@/types/work';
import { TesseractStage } from '@/ui/sections/Works/TesseractStage';

type Props = {
  works: Work[];
  suspended: boolean;
  reducedMotion: boolean;
  onOpen: (work: Work) => void;
  leaving?: boolean;
  onLeft?: () => void;
};

export function WorkExplorer({
  works,
  suspended,
  reducedMotion,
  onOpen,
  leaving = false,
  onLeft,
}: Props) {
  const { index, active, reveal, dismiss, leave } = useWorkHover();
  return (
    <section
      className="work-explorer"
      data-leaving={leaving ? '' : undefined}
      inert={leaving}
      aria-hidden={leaving || undefined}
      aria-label="Interactive work collection"
      onKeyDown={(event) => {
        if (event.key === 'Escape') dismiss();
      }}
    >
      <TesseractStage
        works={works}
        selected={index}
        active={active}
        onSelect={reveal}
        onDismiss={dismiss}
        onLeave={leave}
        onOpen={onOpen}
        suspended={suspended}
        reducedMotion={reducedMotion}
        leaving={leaving}
        {...(onLeft ? { onLeft } : {})}
      />
    </section>
  );
}
