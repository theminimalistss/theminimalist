import contact from '@/constants/contact.json';
import { INQUIRY_PAGES } from '@/router/navigation';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { SocialLinks } from '@/ui/sections/Page/SocialLinks';

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
      <PageSection eyebrow="Follow the studio" title="Say hello on social.">
        <SocialLinks />
      </PageSection>
      <PageSection eyebrow="The studio" title="Contact details.">
        <dl className="contact-details" data-reveal="stagger">
          <div>
            <dt>Email</dt>
            <dd>
              <a className="contact-email" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </dd>
          </div>
          <div>
            <dt>Hours</dt>
            <dd>{contact.hours}</dd>
          </div>
        </dl>
      </PageSection>
    </>
  );
}
