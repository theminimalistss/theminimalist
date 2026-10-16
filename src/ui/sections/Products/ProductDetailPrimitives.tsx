import type { ReactNode } from 'react';
import type { ProductDetail, ProductNote } from '@/types/product';
import { useSiteContent } from '@/hooks/useSiteContent';
import { CONTACT_LINKS, PRODUCT_ROUTES, ROUTES, type RoutePath } from '@/router/paths';
import { PRODUCT_PAGES } from '@/router/navigation';
import { Icon } from '@/ui/components/Icon';
import { PageLink } from '@/ui/components/PageLink';

export function ProductIntro({
  detail,
  children,
}: {
  detail: ProductDetail;
  children?: ReactNode;
}) {
  const { status } = useSiteContent('products')[detail.key];
  return (
    <header className="pd-intro" data-reveal="item">
      <p className="eyebrow">
        Products · {status === 'available' ? 'Collection preview' : 'Coming soon'}
      </p>
      <h1>
        {detail.title} <em>{detail.accent}</em>
      </h1>
      <p className="pd-lead">{detail.lead}</p>
      {children}
    </header>
  );
}

export function ProductChoices<Id extends string>({
  label,
  choices,
  selected,
  choose,
}: {
  label: string;
  choices: readonly { id: Id; label: string }[];
  selected: Id;
  choose: (id: Id) => void;
}) {
  return (
    <div className="pd-choices" role="group" aria-label={label}>
      {choices.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={item.id === selected}
          onClick={() => choose(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function ProductNotes({ notes, label }: { notes: readonly ProductNote[]; label: string }) {
  return (
    <ol className="pd-notes" aria-label={label} data-reveal="stagger">
      {notes.map((note, index) => (
        <li key={note.title}>
          <span className="pd-note-number" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3>{note.title}</h3>
            <p>{note.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const BESPOKE_ROUTES: Record<ProductDetail['key'], RoutePath> = {
  software: ROUTES.softwareDevelopment,
  templates: ROUTES.websiteDevelopment,
  hardware: ROUTES.softwareDevelopment,
};
const BESPOKE_LABELS = {
  software: 'Explore custom software',
  templates: 'Explore website development',
  hardware: 'Explore connected systems',
};

export function ProductClosing({ detail }: { detail: ProductDetail }) {
  return (
    <footer className="pd-closing pd-pad">
      <div className="pd-closing-main" data-reveal="item">
        <div>
          <p className="eyebrow">A conversation starts here</p>
          <h2>{detail.closing.title}</h2>
          <p>{detail.closing.text}</p>
        </div>
        <div className="pd-actions">
          <PageLink to={CONTACT_LINKS.general} className="text-button">
            Ask about the collection <Icon name="arrow" className="inline-icon" />
          </PageLink>
          <PageLink to={BESPOKE_ROUTES[detail.key]} className="pd-related">
            {BESPOKE_LABELS[detail.key]} <Icon name="arrow" className="inline-icon" />
          </PageLink>
        </div>
      </div>
      <nav className="pd-related-products" aria-label="Explore other products">
        {PRODUCT_PAGES.filter((item) => item.to !== PRODUCT_ROUTES[detail.key]).map((item) => (
          <PageLink key={item.to} to={item.to}>
            {item.label}
            <Icon name="arrow" />
          </PageLink>
        ))}
      </nav>
    </footer>
  );
}
