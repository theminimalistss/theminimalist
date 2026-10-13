type Item = { title: string; text: string };

export function EditorialList({
  items,
  label,
  ordered = false,
}: {
  items: readonly Item[];
  label: string;
  ordered?: boolean;
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <List className="editorial-list" aria-label={label} data-reveal="stagger">
      {items.map((item, index) => (
        <li key={item.title}>
          <span className="eyebrow">0{index + 1}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </List>
  );
}
