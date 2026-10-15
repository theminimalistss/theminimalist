import { useId } from 'react';
import { useServiceProcess } from '@/hooks/useServiceProcess';
import { useServiceDrawing } from '@/hooks/useServiceDrawing';
import { SERVICE_DRAWINGS, SERVICE_FACES } from '@/utils/serviceDrawing';

export function ServiceProcess() {
  const id = useId();
  const { ref, stages, active, running, animate, reducedMotion, choose, setFocused, setHovered } =
    useServiceProcess();
  const drawingRef = useServiceDrawing(active, animate, reducedMotion);
  return (
    <section
      ref={ref}
      className="service-process"
      aria-label="Our process"
      data-running={running ? '' : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setFocused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div
        id={`${id}-panel`}
        className="service-process-panel"
        role="button"
        aria-labelledby={`${id}-stage-label ${id}-action`}
        aria-describedby={`${id}-stage-copy ${id}-keys`}
        aria-keyshortcuts="ArrowRight ArrowLeft Home End"
        tabIndex={0}
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          setHovered(false);
          choose((active + 1) % stages.length);
        }}
        onKeyDown={(event) => {
          if (!['Enter', ' ', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          choose(
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? stages.length - 1
                : (active + (event.key === 'ArrowLeft' ? stages.length - 1 : 1)) % stages.length,
          );
        }}
      >
        <div ref={drawingRef} className="service-drawing" aria-hidden="true">
          <svg viewBox="0 0 480 320" fill="none" stroke="currentColor" strokeWidth="1.2">
            <g className="service-drawing-guides" strokeDasharray="3 6">
              <path d="M74 252 240 306 410 248M104 58V290M375 60V287" />
            </g>
            <ellipse className="service-drawing-shadow" cx="240" cy="271" rx="111" ry="14" />
            <g className="service-drawing-anchors" strokeWidth="1">
              <path d="M75 252h10m-5-5v10M402 248h10m-5-5v10" />
            </g>
          </svg>
          <svg
            className="service-drawing-object"
            viewBox="0 0 480 320"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <defs>
              <mask
                id={`${id}-behind`}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="480"
                height="320"
              >
                <rect width="480" height="320" fill="#fff" />
                {SERVICE_FACES[active]!.filter((face) =>
                  SERVICE_DRAWINGS[active]!.some((stroke) =>
                    stroke.behind?.includes(face.part ?? -1),
                  ),
                ).map((face, index) => (
                  <polygon
                    key={index}
                    fill="#000"
                    points={face.points.map((point) => point.join(',')).join(' ')}
                  />
                ))}
              </mask>
            </defs>
            <g className="service-drawing-surfaces" stroke="none">
              {SERVICE_FACES[active]!.map((face, index) => (
                <polygon
                  key={index}
                  className={`service-drawing-face service-drawing-face--${face.tone}`}
                  points={face.points.map((point) => point.join(',')).join(' ')}
                />
              ))}
            </g>
            <g className="service-drawing-fallback" strokeLinecap="round" strokeLinejoin="round">
              {SERVICE_DRAWINGS[active]!.map((stroke, index) => (
                <polyline
                  key={index}
                  className={`service-drawing-stroke--${stroke.tone}`}
                  mask={stroke.behind ? `url(#${id}-behind)` : undefined}
                  points={stroke.points.map((point) => point.join(',')).join(' ')}
                />
              ))}
            </g>
          </svg>
          <canvas />
        </div>
        <div className="service-process-annotation service-process-label" key={`label-${active}`}>
          <div className="service-process-annotation-content">
            <span className="eyebrow">0{active + 1} / 04</span>
            <h3 id={`${id}-stage-label`} className="serif">
              {stages[active]!.title}.
            </h3>
          </div>
        </div>
        <div
          className="service-process-annotation service-process-description"
          key={`copy-${active}`}
        >
          <div className="service-process-annotation-content">
            <span className="service-process-caption-rule" aria-hidden="true" />
            <p id={`${id}-stage-copy`}>{stages[active]!.text}</p>
          </div>
        </div>
        <span id={`${id}-action`} className="sr-only">
          Next process stage
        </span>
        <span id={`${id}-keys`} className="sr-only">
          Use arrow keys to browse. Focus or hover holds the process for reading.
        </span>
      </div>
    </section>
  );
}
