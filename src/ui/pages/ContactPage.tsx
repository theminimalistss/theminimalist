import { useSiteContent } from '@/hooks/useSiteContent';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { ContactDirect } from '@/ui/sections/Contact/ContactDirect';
import { InquiryForm } from '@/ui/sections/Contact/InquiryForm';
import '@/ui/styles/contact.css';

export default function ContactPage() {
  const copy = useSiteContent('pages').contact;
  return (
    <div className="contact-page">
      <PageIntro {...copy} />
      <InquiryForm />
      <ContactDirect />
    </div>
  );
}
