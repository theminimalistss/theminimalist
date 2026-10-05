import type { ReactNode } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Props = {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, accent, lead, children }: Props) {
  useDocumentTitle(title);
  return (
    <header className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>
        {title} <em className="serif">{accent}</em>
      </h1>
      <p className="page-lead">{lead}</p>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
