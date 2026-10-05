import { Link } from 'react-router';
import type { NavItem } from '@/router/navigation';
import { Icon } from '@/ui/components/Icon';

export function LinkCards({ items, label }: { items: readonly NavItem[]; label: string }) {
  return (
    <ul className="link-cards" aria-label={label}>
      {items.map((item, index) => (
        <li key={item.to}>
          <Link className="link-card" to={item.to}>
            <span className="link-card-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="link-card-title">{item.label}</span>
            <span className="link-card-text">{item.description}</span>
            <Icon name="arrow" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
