import { useId, type ReactNode } from 'react';

type Props = { eyebrow: string; title: string; children: ReactNode };

export function PageSection({ eyebrow, title, children }: Props) {
  const id = useId();
  return (
    <section className="page-section" aria-labelledby={id}>
      <div className="page-section-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={id}>{title}</h2>
      </div>
      <div className="page-section-body">{children}</div>
    </section>
  );
}
