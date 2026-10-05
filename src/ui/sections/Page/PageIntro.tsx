import type { ReactNode } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Props = {
  eyebrow: string;
  title: string;
  documentTitle?: string;
  accent: string;
  lead: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, documentTitle, accent, lead, children }: Props) {
  useDocumentTitle(documentTitle ?? title);
  return (
    <header className="page-intro" data-reveal="stagger">
      <span className="eyebrow">{eyebrow}</span>
      <h1>
        {title} <em className="serif">{accent}</em>
      </h1>
      <p className="page-lead">{lead}</p>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
