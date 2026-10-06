import type { RefObject } from 'react';
import { useParticlePreview } from '@/hooks/useParticlePreview';
import type { PreviewAnchor } from '@/utils/particlePreview';
import type { Work } from '@/types/work';
import { WorkImage } from '@/ui/components/WorkImage';
import { WorkVideo } from '@/ui/components/WorkVideo';
import { Icon } from '@/ui/components/Icon';

type Props = {
  work: Work;
  index: number;
  active: boolean;
  docked: boolean;
  /** The user chose this study; automatic focus changes stay silent for screen readers. */
  chosen: boolean;
  suspended: boolean;
  reducedMotion: boolean;
  anchorsRef: RefObject<PreviewAnchor[]>;
  onOpen: (work: Work) => void;
  onPin: (index: number) => void;
  onLeave: () => void;
  onDismiss: () => void;
};

export function ParticlePreview({
  work,
  index,
  active,
  docked,
  chosen,
  suspended,
  reducedMotion,
  anchorsRef,
  onOpen,
  onPin,
  onLeave,
  onDismiss,
}: Props) {
  const { canvasRef, cardRef, shown, phase, assembled } = useParticlePreview({
    work,
    index,
    active,
    docked,
    suspended,
    reducedMotion,
    anchorsRef,
  });
  const visible = active && shown.work.id === work.id;
  const study = shown.work;
  return (
    <div
      className="particle-preview"
      data-phase={phase}
      data-active={visible ? '' : undefined}
      data-docked={docked ? '' : undefined}
    >
      <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
      <div
        ref={cardRef}
        className="particle-card"
        inert={!visible}
        aria-hidden={!visible}
        onPointerEnter={() => onPin(shown.index)}
        onPointerLeave={onLeave}
        onFocusCapture={() => onPin(shown.index)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) onLeave();
        }}
      >
        <div className="particle-media" data-resolved={assembled ? '' : undefined}>
          {study.mediaType === 'image' ? (
            <WorkImage key={study.id} image={study.image} alt={study.alt} sizes="280px" priority />
          ) : (
            <WorkVideo
              key={study.id}
              work={study}
              playing={visible && assembled && !suspended && !reducedMotion}
            />
          )}
        </div>
        <button
          className="particle-open"
          aria-label={`Explore ${study.title}`}
          onClick={() => onOpen(study)}
        >
          <span className="sr-only">Explore {study.title}</span>
        </button>
        {!docked && (
          <button
            className="particle-close icon-button"
            aria-label="Dismiss preview"
            onClick={onDismiss}
          >
            <Icon name="close" />
          </button>
        )}
        <div className="particle-copy" aria-live={chosen ? 'polite' : 'off'}>
          <span className="eyebrow">
            {study.category} · {study.year}
            {study.isConcept ? ' / Concept study' : ''}
          </span>
          <h2>
            {study.title}
            <span aria-hidden="true">↗</span>
          </h2>
          <p className="serif">{study.tagline}</p>
        </div>
      </div>
    </div>
  );
}
