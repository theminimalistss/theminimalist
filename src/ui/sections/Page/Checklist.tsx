export function Checklist({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ol className="checklist" aria-label={label}>
      {items.map((item, index) => (
        <li key={item}>
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          {item}
        </li>
      ))}
    </ol>
  );
}
