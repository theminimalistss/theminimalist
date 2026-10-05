import { useLocation } from 'react-router';
import type { NavItem } from '@/router/navigation';
import { PageLink } from '@/ui/components/PageLink';

export function SectionTabs({ items, label }: { items: readonly NavItem[]; label: string }) {
  const { pathname } = useLocation();
  return (
    <nav className="section-tabs" aria-label={label} data-reveal="item">
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <PageLink to={item.to} aria-current={pathname === item.to ? 'page' : undefined}>
              {item.label}
            </PageLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
