import type { ReactNode } from 'react';
import { FOUNDER_TITLE, type Founder } from '@/constants/founders';
import { useFounderShowcase } from '@/hooks/useFounderShowcase';
import { Icon } from '@/ui/components/Icon';
import { FounderPortrait } from './FounderPortrait';

type Props = { founders: readonly Founder[]; intro: ReactNode };

export function FounderShowcase({ founders, intro }: Props) {
  const {
    ref,
    tracksRef,
    active,
    select,
    go,
    paused,
    running,
    reducedMotion,
    holdPointer,
    holdFocus,
    togglePause,
  } = useFounderShowcase(founders.length);
  return (
    <section
      ref={ref}
      className="founder-showcase"
      aria-label="Founding partners"
      data-playing={running ? '' : undefined}
    >
      <div className="founder-intro">{intro}</div>
      <div ref={tracksRef} className="founder-stage">
        {founders.map((founder, index) => (
          <div
            key={founder.slug}
            className="founder-scene"
            data-scene=""
            data-active={index === active ? '' : undefined}
            aria-hidden={index !== active}
          >
            <div className="founder-marquee" aria-hidden="true">
              <div className="founder-name-track" data-name-track="">
                {Array.from({ length: 8 }, (_, copy) => (
                  <span key={copy}>— {founder.name} </span>
                ))}
              </div>
            </div>
            <FounderPortrait founder={founder} active={index === active} onHold={holdPointer} />
          </div>
        ))}
        {founders.length > 1 && (
          <div className="founder-steps">
            {([-1, 1] as const).map((step) => {
              const target = founders[(active + step + founders.length) % founders.length];
              const label = step > 0 ? 'Next' : 'Previous';
              return (
                <button
                  key={step}
                  className="founder-step"
                  data-step={step > 0 ? 'next' : 'previous'}
                  aria-label={`${label} founder: ${target?.name ?? ''}`}
                  onClick={() => go(step)}
                >
                  <span className="founder-step-icon" aria-hidden="true">
                    <Icon name={step > 0 ? 'arrow-right' : 'arrow-left'} className="inline-icon" />
                  </span>
                  <span className="founder-step-label" aria-hidden="true">
                    <span className="founder-step-text" key={target?.slug}>
                      <span>{label}</span>
                      {target?.name}
                    </span>
                  </span>
                </button>
              );
            })}
            <span className="founder-hint" aria-hidden="true">
              <span className="founder-hint-fine">Drag to swap</span>
              <span className="founder-hint-touch">Swipe to swap</span>
            </span>
          </div>
        )}
      </div>
      <div
        className="founder-details"
        onFocusCapture={() => holdFocus(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) holdFocus(false);
        }}
      >
        {founders.map((founder, index) => (
          <div
            key={founder.slug}
            className="founder-details-panel"
            data-active={index === active ? '' : undefined}
            aria-hidden={index !== active}
          >
            <span className="eyebrow">{FOUNDER_TITLE}</span>
            <h2>{founder.name}</h2>
            <p>{founder.role}</p>
            <a
              className="profile-link"
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={index === active ? 0 : -1}
            >
              <span className="social-badge" aria-hidden="true">
                <Icon name="linkedin" />
              </span>
              <span>
                <span className="sr-only">{founder.name} on </span>LinkedIn
              </span>
              <Icon name="arrow" className="profile-link-arrow" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        ))}
      </div>
      <div className="founder-controls">
        <div role="group" aria-label="Show a founder">
          {founders.map((founder, index) => (
            <button
              key={founder.slug}
              aria-pressed={index === active}
              onClick={() => select(index)}
            >
              {founder.name}
            </button>
          ))}
        </div>
        {!reducedMotion && (
          <button
            className="founder-playback"
            onClick={togglePause}
            aria-label={paused ? 'Play founder slideshow' : 'Pause founder slideshow'}
          >
            <Icon name={paused ? 'play' : 'pause'} />
            <span>{paused ? 'Play' : 'Pause'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
