import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { Placeholder } from '@/ui/sections/Page/Placeholder';

const PROFILES = ['Founder', 'Co-founder'];

const NEXT = [
  { label: 'About', to: ROUTES.about, description: 'Who we are and how we work.' },
  { label: 'Book an appointment', to: ROUTES.appointment, description: 'Meet the studio.' },
] as const;

export default function FoundersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Studio — Founders"
        documentTitle="Founders"
        title="The people"
        accent="behind the studio."
        lead="A small team with a shared belief: good design should feel calm, honest, and a little personal."
      />
      <PageSection eyebrow="Founders" title="Profiles in progress.">
        <ul className="profile-cards" data-reveal="stagger">
          {PROFILES.map((role) => (
            <li key={role}>
              <div className="profile-portrait">
                <LotusMark />
              </div>
              <h3>{role}</h3>
              <p>Portrait and biography coming soon.</p>
            </li>
          ))}
        </ul>
        <Placeholder title="Coming soon">
          Founder portraits, stories, and roles will be published here once they are approved.
        </Placeholder>
      </PageSection>
      <PageSection eyebrow="Continue" title="Say hello.">
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
