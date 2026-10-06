import { useWorkHover } from '@/hooks/useWorkHover';
import type { Work } from '@/types/work';
import { TesseractStage } from '@/ui/sections/Works/TesseractStage';

type Props = {
  works: Work[];
  suspended: boolean;
  reducedMotion: boolean;
  onOpen: (work: Work) => void;
};

export function WorkExplorer({ works, suspended, reducedMotion, onOpen }: Props) {
  const { index, active, reveal, dismiss, leave } = useWorkHover();
  return (
    <section
      className="work-explorer"
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
      />
    </section>
  );
}
