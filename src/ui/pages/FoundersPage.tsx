import { FOUNDER_TITLE, FOUNDERS } from '@/constants/founders';
import { ROUTES } from '@/router/paths';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';

const PORTRAIT_SIZES = '(max-width: 767px) calc(100vw - 48px), (max-width: 1099px) 30vw, 26vw';

const NEXT = [
  { label: 'About', to: ROUTES.about, description: 'Who we are and how we work.' },
  { label: 'Book an appointment', to: ROUTES.appointment, description: 'Meet the studio.' },
] as const;

export default function FoundersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Studio — Founders"
        title="The people"
        accent="behind the studio."
        lead="The Minimalist is a partnership between design and engineering: two founding partners sharing one belief, that good design should feel calm, honest, and a little personal."
      />
      <PageSection eyebrow="Founding partners" title="Design and engineering, side by side.">
        <ul className="profile-cards" data-reveal="stagger">
          {FOUNDERS.map((founder) => (
            <li key={founder.slug}>
              <picture className="profile-portrait">
                <source
                  type="image/avif"
                  srcSet={`${founder.portrait.avifSmall} 480w, ${founder.portrait.avif} 960w`}
                  sizes={PORTRAIT_SIZES}
                />
                <img
                  src={founder.portrait.webp}
                  srcSet={`${founder.portrait.webpSmall} 480w, ${founder.portrait.webp} 960w`}
                  sizes={PORTRAIT_SIZES}
                  alt={`Portrait of ${founder.name}`}
                  width="960"
                  height="1200"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <span className="eyebrow profile-title">{FOUNDER_TITLE}</span>
              <h3>{founder.name}</h3>
              <p>{founder.role}</p>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection eyebrow="Continue" title="Say hello.">
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
