import { ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';

const ESSENCE = [
  { icon: 'leaf', text: 'Rooted in deep forest green' },
  { icon: 'sun', text: 'Light and inviting' },
  { icon: 'diamond', text: 'Premium but approachable' },
  { icon: 'sprig', text: 'Warm editorial minimalism' },
] as const;

const DISCIPLINES = [
  { title: 'Brand', text: 'Identities with clarity and character, built to last.' },
  { title: 'Digital', text: 'Websites and products that feel calm, considered, and useful.' },
  { title: 'Experience', text: 'Spaces, motion, and moments that carry a brand into the world.' },
];

const NEXT = [
  { label: 'Founders', to: ROUTES.founders, description: 'The people behind the studio.' },
  {
    label: 'Testimonials',
    to: ROUTES.testimonials,
    description: 'Words from the people we work with.',
  },
  { label: 'Works', to: ROUTES.works, description: 'Selected studies from the studio.' },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About the studio"
        title="The Minimalist"
        documentTitle="About"
        accent="Design Studio."
        lead="We shape identities and digital experiences with clarity, character, and care. Less, but with feeling. Our full studio story is being written; here is where we begin."
      />
      <PageSection eyebrow="Brand essence" title="Warm, editorial, inviting, sophisticated.">
        <ul className="essence-list" data-reveal="stagger">
          {ESSENCE.map((item) => (
            <li key={item.text}>
              <Icon name={item.icon} />
              {item.text}
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection eyebrow="What we do" title="Brand. Digital. Experience.">
        <ul className="service-list" data-reveal="stagger">
          {DISCIPLINES.map((discipline) => (
            <li key={discipline.title}>
              <h3>{discipline.title}</h3>
              <p>{discipline.text}</p>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection eyebrow="Continue" title="Get to know the studio.">
        <LinkCards items={NEXT} label="More about the studio" />
      </PageSection>
    </>
  );
}
