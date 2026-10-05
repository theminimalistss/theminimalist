import type { NavItem } from '@/router/navigation';
import { Icon } from '@/ui/components/Icon';
import { formatIndex } from '@/utils/format';
import { PageLink } from '@/ui/components/PageLink';

export function LinkCards({ items, label }: { items: readonly NavItem[]; label: string }) {
  return (
    <ul className="link-cards" aria-label={label} data-reveal="stagger">
      {items.map((item, index) => (
        <li key={item.to}>
          <PageLink className="link-card" to={item.to}>
            <span className="link-card-index">{formatIndex(index)}</span>
            <span className="link-card-title">{item.label}</span>
            <span className="link-card-text">{item.description}</span>
            <Icon name="arrow" />
          </PageLink>
        </li>
      ))}
    </ul>
  );
}
