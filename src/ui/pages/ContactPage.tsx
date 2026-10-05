import { INQUIRY_PAGES } from '@/router/navigation';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';

const DETAILS = [
  { label: 'Email', value: 'To be confirmed' },
  { label: 'Studio', value: 'To be confirmed' },
  { label: 'Hours', value: 'To be confirmed' },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Let’s talk."
        accent="Good work starts with a conversation."
        lead="Choose the kind of conversation you’d like to have, or reach the studio directly."
      />
      <PageSection eyebrow="How can we help?" title="Start here.">
        <LinkCards items={INQUIRY_PAGES} label="Ways to get in touch" />
      </PageSection>
      <PageSection eyebrow="The studio" title="Contact details.">
        <dl className="contact-details">
          {DETAILS.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>
    </>
  );
}
