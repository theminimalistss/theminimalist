import { useId } from 'react';
import { useAppEntered } from '@/hooks/useAppEntered';
import { useSound } from '@/hooks/useSound';
import { useTesseract } from '@/hooks/useTesseract';
import type { Work } from '@/types/work';
import { Icon } from '@/ui/components/Icon';
import { FocusStepper } from '@/ui/sections/Works/FocusStepper';
import { ParticlePreview } from '@/ui/sections/Works/ParticlePreview';

type Props = {
  works: readonly Work[];
  selected: number | null;
  active: boolean;
  onSelect: (index: number) => void;
  onDismiss: () => void;
  onLeave: () => void;
  onOpen: (work: Work) => void;
  suspended: boolean;
  reducedMotion: boolean;
};

export function TesseractStage({
  works,
  selected,
  active,
  onSelect,
  onDismiss,
  onLeave,
  onOpen,
  suspended,
  reducedMotion,
}: Props) {
  const { note } = useSound();
  const entered = useAppEntered();
  const {
    viewportRef,
    canvasRef,
    orbitRef,
    anchorsRef,
    status,
    paused,
    focus,
    docked,
    traced,
    toggle,
    reset,
    steer,
  } = useTesseract({
    count: works.length,
    holding: active,
    suspended,
    reducedMotion,
    entered,
  });
  const instructions = useId();
  const chosen = active && selected !== null;
  const shownIndex = chosen ? selected : focus;
  const work = works[shownIndex];
  const pick = (index: number) => {
    if (!chosen || selected !== index) note(index, 'hover');
    onSelect(index);
  };
  const step = (direction: 1 | -1) => {
    onDismiss();
    steer((shownIndex + direction + works.length) % works.length);
  };
  return (
    <div className="tesseract-stage" data-scene-status={status}>
      <div className="tesseract-viewport" ref={viewportRef}>
        <div className="tesseract-orbit-ring" aria-hidden="true" />
        <div className="tesseract-grid" aria-hidden="true" />
        <canvas ref={canvasRef} className="tesseract-canvas" aria-hidden="true" />
        {status !== 'ready' && (
          <svg className="tesseract-fallback" viewBox="0 0 300 300" fill="none" aria-hidden="true">
            <path d="M150 30 254 90v120l-104 60-104-60V90Zm0 0v70m104-10-62 36m62 84-62-36m-42 96v-70M46 210l62-36M46 90l62 36m42-26 42 26v48l-42 26-42-26v-48Zm0 0v50m42-24-42 24-42-24m42 24v50" />
          </svg>
        )}
        <button
          ref={orbitRef}
          className="tesseract-orbit-control"
          aria-label="Rotate the collection"
          aria-describedby={instructions}
          disabled={status !== 'ready'}
          data-sound="off"
        />
        <div className="tesseract-nodes" role="group" aria-label="Choose a study in the sculpture">
          {works.map((study, index) => (
            <button
              key={study.id}
              className="tesseract-node"
              data-work-node=""
              data-sound="off"
              aria-label={`Select ${study.title}`}
              aria-pressed={chosen && selected === index}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') pick(index);
              }}
              onPointerLeave={onLeave}
              onFocus={() => pick(index)}
              onBlur={onLeave}
              onClick={() => pick(index)}
            >
              <span className="tesseract-node-core" aria-hidden="true" />
              <span className="tesseract-node-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="tesseract-node-label" aria-hidden="true">
                {study.title}
              </span>
            </button>
          ))}
        </div>
        {work && (
          <ParticlePreview
            work={work}
            index={shownIndex}
            active={chosen || (docked && traced)}
            docked={docked}
            chosen={chosen}
            suspended={suspended}
            reducedMotion={reducedMotion}
            anchorsRef={anchorsRef}
            onPin={(index) => onSelect(index)}
            onLeave={onLeave}
            onDismiss={() => {
              onDismiss();
              orbitRef.current?.focus({ preventScroll: true });
            }}
            onOpen={onOpen}
          />
        )}
      </div>
      <div className="tesseract-tools">
        <p className="tesseract-hint" id={instructions}>
          {status === 'unavailable' ? (
            'Choose a point to discover a study.'
          ) : (
            <>
              <span aria-hidden="true">
                Drag to explore. <span className="hint-fine">Hover</span>
                <span className="hint-coarse">Tap</span> a point to discover.
              </span>
              <span className="sr-only">
                Drag to explore. Hover, tap, or focus a point to preview its study. Arrow keys
                rotate; Home resets.
              </span>
            </>
          )}
        </p>
        {work && (
          <FocusStepper
            works={works}
            index={shownIndex}
            onStep={step}
            onOpen={onOpen}
            showThumbnail={!docked}
          />
        )}
        <div className="tesseract-actions">
          {!reducedMotion && status === 'ready' && (
            <button
              className="icon-button"
              aria-label={paused ? 'Resume sculpture motion' : 'Pause sculpture motion'}
              onClick={toggle}
            >
              <Icon name={paused ? 'play' : 'pause'} />
            </button>
          )}
          <button className="tesseract-reset" onClick={reset} disabled={status !== 'ready'}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
}
