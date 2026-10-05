import { Link, useLocation } from 'react-router';
import type { NavItem } from '@/router/navigation';

export function SectionTabs({ items, label }: { items: readonly NavItem[]; label: string }) {
  const { pathname } = useLocation();
  return (
    <nav className="section-tabs" aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <Link to={item.to} aria-current={pathname === item.to ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
