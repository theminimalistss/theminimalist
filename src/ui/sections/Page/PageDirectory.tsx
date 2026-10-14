import { useId, type ReactNode } from 'react';
import type { LinkTarget } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { PageLink } from '@/ui/components/PageLink';
import '@/ui/styles/overview.css';

export type DirectoryItem = {
  to: LinkTarget;
  label: string;
  description: string;
  category: string;
  artwork: ReactNode;
  dark?: boolean;
};

export function PageDirectory({
  title,
  label,
  items,
}: {
  title: string;
  label: string;
  items: readonly DirectoryItem[];
}) {
  const id = useId();
  return (
    <section className="page-directory" aria-labelledby={`${id}-heading`}>
      <header className="page-directory-heading" data-reveal="item">
        <h2 id={`${id}-heading`} className="eyebrow">
          {title}
        </h2>
      </header>
      <nav aria-label={label}>
        <ul className="page-directory-list">
          {items.map((item, index) => (
            <li key={item.to} className="page-directory-item" data-reveal="item">
              <PageLink
                to={item.to}
                aria-labelledby={`${id}-${index}-title`}
                aria-describedby={`${id}-${index}-description`}
              >
                <div
                  className={`page-directory-art${item.dark ? ' page-directory-art--dark' : ''}`}
                  aria-hidden="true"
                >
                  {item.artwork}
                </div>
                <div className="page-directory-caption">
                  <span className="eyebrow">
                    0{index + 1} — {item.category}
                  </span>
                  <h3 id={`${id}-${index}-title`}>{item.label}</h3>
                  <p id={`${id}-${index}-description`}>{item.description}</p>
                  <span className="page-directory-arrow">
                    <Icon name="arrow" />
                  </span>
                </div>
              </PageLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
