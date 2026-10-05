import type { Work } from '@/types/work';
import { WorkItem } from '@/ui/components/WorkItem';

type Props = { works: Work[]; playing: boolean; onSelect: (work: Work) => void };

export function WorkGallery({ works, playing, onSelect }: Props) {
  return (
    <ol className="work-gallery" aria-label="Selected design studies">
      {works.map((work, index) => (
        <li key={work.id}>
          <WorkItem
            work={work}
            index={index}
            playing={playing}
            onSelect={onSelect}
            priority={index === 0}
          />
          <div className="gallery-caption">
            <h2>{work.title}</h2>
            <span>{work.category}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
