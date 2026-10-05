import { formatIndex } from '@/utils/format';

export function Checklist({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ol className="checklist" aria-label={label} data-reveal="stagger">
      {items.map((item, index) => (
        <li key={item}>
          <span aria-hidden="true">{formatIndex(index)}</span>
          {item}
        </li>
      ))}
    </ol>
  );
}
