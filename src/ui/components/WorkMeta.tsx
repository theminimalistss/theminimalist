import type { Work } from '@/types/work';

export function WorkMeta({ work, index }: { work: Work; index: number }) {
  return (
    <div className="work-meta">
      <span className="work-meta-top">
        <span data-work-part="category">{work.category}</span>
        <span>{work.year}</span>
      </span>
      <span className="work-artwork" aria-hidden="true">
        <span className="work-wordmark" data-work-part="title">
          {work.title}
        </span>
        <span className="work-tagline" data-work-part="tagline">
          {work.tagline}
        </span>
      </span>
      <span className="work-meta-bottom">
        <span>
          {String(index + 1).padStart(2, '0')} /{' '}
          {work.isConcept ? 'CONCEPT STUDY' : 'SELECTED WORK'}
        </span>
        <span>{work.mediaType === 'video' ? 'MOTION ↗' : 'EXPLORE ↗'}</span>
      </span>
    </div>
  );
}
