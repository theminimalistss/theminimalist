import type { ReactNode } from 'react';
import { StudioSprig } from '@/ui/sections/Studio/StudioSprig';
import '@/ui/styles/editorial.css';

type Props = {
  id: string;
  eyebrow: string;
  statement: string;
  accent: string;
  footer: string;
  title: string;
  titleAccent: string;
  lead: string;
  children: ReactNode;
};

export function EditorialSection({
  id,
  eyebrow,
  statement,
  accent,
  footer,
  title,
  titleAccent,
  lead,
  children,
}: Props) {
  return (
    <section className="editorial-section" aria-labelledby={id}>
      <div className="editorial-panel" data-reveal="item">
        <span className="eyebrow">{eyebrow}</span>
        <p className="editorial-panel-title">
          {statement}
          <br />
          <em className="serif">{accent}</em>
        </p>
        <StudioSprig />
        <span className="editorial-panel-footer eyebrow">{footer}</span>
      </div>
      <div className="editorial-content">
        <header className="editorial-heading" data-reveal="stagger">
          <span className="eyebrow">{eyebrow}</span>
          <h2 id={id}>
            {title}
            <br />
            <em className="serif">{titleAccent}</em>
          </h2>
          <p>{lead}</p>
        </header>
        {children}
      </div>
    </section>
  );
}
