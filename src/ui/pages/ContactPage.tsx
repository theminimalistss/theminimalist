import contact from '@/constants/contact.json';
import { INQUIRY_PAGES } from '@/router/navigation';
import { PageOverview } from '@/ui/sections/Page/PageOverview';
import { PageDirectory, DirectoryArtwork } from '@/ui/sections/Page/PageDirectory';
import { EditorialSection } from '@/ui/sections/Page/EditorialSection';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { SocialLinks } from '@/ui/sections/Page/SocialLinks';

export default function ContactPage() {
  return (
    <>
      <PageOverview
        compactTitle
        intro={
          <PageIntro
            eyebrow="Contact"
            title="Let’s talk."
            accent="Good work starts with a conversation."
            lead="Choose the kind of conversation you’d like to have, or reach the studio directly."
          />
        }
      >
        <PageDirectory
          title="Start a conversation"
          label="Ways to get in touch"
          items={INQUIRY_PAGES.map((item, index) => ({
            ...item,
            category: ['Introduce', 'Plan', 'Meet'][index]!,
            dark: index === 1,
            artwork: (
              <DirectoryArtwork
                icon={index === 0 ? 'sprig' : index === 1 ? 'plus' : 'sun'}
                word={['Hello.', 'Ideas.', 'Meet.'][index]!}
              />
            ),
          }))}
        />
      </PageOverview>
      <EditorialSection
        id="contact-details-title"
        eyebrow="A direct line"
        statement="A conversation,"
        accent="then a possibility."
        footer="Design · Engineering · Collaboration"
        title="Contact details."
        titleAccent="Say hello to the studio."
        lead="Reach us directly for questions, introductions, or the start of a project."
      >
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
      </EditorialSection>
      <PageSection eyebrow="Follow the studio" title="Say hello on social.">
        <SocialLinks />
      </PageSection>
    </>
  );
}
