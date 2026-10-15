import { useSiteContent } from '@/hooks/useSiteContent';
import { useCopyText } from '@/hooks/useCopyText';
import { ContactChannels } from './ContactChannels';

export function ContactDirect() {
  const contact = useSiteContent('contact');
  const { copied, failed, copy } = useCopyText(contact.email);
  return (
    <div className="contact-direct">
      <dl className="contact-details">
        <div>
          <dt>Email</dt>
          <dd>
            <a className="contact-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <button type="button" className="contact-copy" onClick={() => void copy()}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            <span className="contact-copy-status" role="status">
              {failed
                ? 'Select the email address to copy it manually.'
                : copied
                  ? 'Email copied.'
                  : ''}
            </span>
          </dd>
        </div>
        <div>
          <dt>Hours</dt>
          <dd>{contact.hours}</dd>
        </div>
        <div>
          <dt>Replies</dt>
          <dd>{contact.replies}</dd>
        </div>
      </dl>
      <ContactChannels />
    </div>
  );
}
