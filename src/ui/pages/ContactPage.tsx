import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { ContactDirect } from '@/ui/sections/Contact/ContactDirect';
import { InquiryForm } from '@/ui/sections/Contact/InquiryForm';
import '@/ui/styles/contact.css';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <PageIntro
        eyebrow="Contact"
        title="Let’s talk."
        accent="Good work starts with a conversation."
        lead="Say hello, ask for a quote, or book a meeting, all from here. Or reach the studio directly."
      />
      <InquiryForm />
      <ContactDirect />
    </div>
  );
}
