import type { Work } from '@/types/work';
import { WorkImage } from '@/ui/components/WorkImage';
import { WorkVideo } from '@/ui/components/WorkVideo';
import { WorkMeta } from '@/ui/components/WorkMeta';

type Props = {
  work: Work;
  index: number;
  playing: boolean;
  onSelect: (work: Work) => void;
  priority?: boolean;
  sizes?: string;
};

export function WorkItem({ work, index, playing, onSelect, priority = false, sizes }: Props) {
  return (
    <article className={`work-item work-item--${work.artDirection}`} data-work-id={work.id}>
      {work.mediaType === 'image' ? (
        <WorkImage
          image={work.image}
          alt={work.alt}
          priority={priority}
          {...(sizes ? { sizes } : {})}
        />
      ) : (
        <WorkVideo work={work} playing={playing} />
      )}
      <WorkMeta work={work} index={index} />
      <button
        className="work-open"
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          onSelect(work);
        }}
        aria-label={`Explore ${work.title} — ${work.category}${work.isConcept ? ', concept study' : ''}`}
      >
        <span className="sr-only">Explore {work.title}</span>
      </button>
    </article>
  );
}
