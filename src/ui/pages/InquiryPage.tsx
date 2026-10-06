import contact from '@/constants/contact.json';
import { INQUIRY_COPY, type InquiryKey } from '@/constants/pages';
import { INQUIRY_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { Breadcrumbs } from '@/ui/sections/Page/Breadcrumbs';
import { Checklist } from '@/ui/sections/Page/Checklist';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { Placeholder } from '@/ui/sections/Page/Placeholder';
import { SectionTabs } from '@/ui/sections/Page/SectionTabs';
import { PageLink } from '@/ui/components/PageLink';

export default function InquiryPage({ inquiry }: { inquiry: InquiryKey }) {
  const copy = INQUIRY_COPY[inquiry];
  return (
    <>
      <Breadcrumbs trail={[{ label: 'Contact', to: ROUTES.contact }, { label: copy.title }]} />
      <SectionTabs items={INQUIRY_PAGES} label="Inquiry types" />
      <PageIntro eyebrow="Inquiries" title={copy.title} accent={copy.accent} lead={copy.lead} />
      <PageSection eyebrow="What we’ll ask" title="A few details to prepare.">
        <Checklist items={copy.checklist} label={`${copy.title} details`} />
        <Placeholder title="Online form coming soon">
          This form isn’t accepting submissions yet. Email{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> or{' '}
          <PageLink to={ROUTES.contact}>see the contact page</PageLink> for other ways to reach the
          studio.
        </Placeholder>
      </PageSection>
    </>
  );
}
