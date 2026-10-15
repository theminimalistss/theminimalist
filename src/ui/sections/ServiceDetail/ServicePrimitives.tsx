import { SERVICE_PAGES } from '@/router/navigation';
import { CONTACT_LINKS, SERVICE_ROUTES } from '@/router/paths';
import type { ServiceDetail } from '@/types/service';
import { Icon } from '@/ui/components/Icon';
import { PageLink } from '@/ui/components/PageLink';

export function ServiceActions() {
  return (
    <div className="sd-actions">
      <PageLink className="text-button" to={CONTACT_LINKS.quote}>
        Request a quote <Icon name="arrow" className="inline-icon" />
      </PageLink>
      <PageLink className="sd-secondary-link" to={CONTACT_LINKS.appointment}>
        Book an appointment <Icon name="arrow" className="inline-icon" />
      </PageLink>
    </div>
  );
}

export function ServiceTitle({ detail }: { detail: ServiceDetail }) {
  return (
    <header className="sd-intro" data-reveal="stagger">
      <span className="eyebrow">{detail.discipline}</span>
      <h1 className="sd-title">
        {detail.title},<em className="serif">{detail.accent}</em>
      </h1>
      <p className="sd-lead">{detail.lead}</p>
      <ServiceActions />
    </header>
  );
}

export function ServiceHeading({
  title,
  accent,
  text,
  eyebrow,
  id,
}: {
  title: string;
  accent: string;
  text?: string;
  eyebrow: string;
  id?: string;
}) {
  return (
    <header className="sd-section-heading" data-reveal="stagger">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>
        {title}
        <em className="serif">{accent}</em>
      </h2>
      {text && <p>{text}</p>}
    </header>
  );
}

export function ServiceClosing({ detail }: { detail: ServiceDetail }) {
  return (
    <>
      <section className="sd-closing" aria-labelledby="service-conversation" data-reveal="item">
        <span className="eyebrow">An idea starts a conversation</span>
        <h2 id="service-conversation">
          {detail.closing.title}
          <em className="serif">{detail.closing.accent}</em>
        </h2>
        <div>
          <p>{detail.closing.text}</p>
          <PageLink className="text-button" to={CONTACT_LINKS.quote}>
            Tell us about your project <Icon name="arrow" className="inline-icon" />
          </PageLink>
        </div>
      </section>
      <nav data-reveal="stagger" className="sd-other-services" aria-label="Explore other services">
        <span className="eyebrow">Another way we can help</span>
        {SERVICE_PAGES.filter((item) => item.to !== SERVICE_ROUTES[detail.key]).map((item) => (
          <PageLink to={item.to} key={item.to}>
            {item.label}
            <Icon name="arrow" />
          </PageLink>
        ))}
      </nav>
    </>
  );
}
