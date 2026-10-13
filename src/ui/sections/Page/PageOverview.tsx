import type { ReactNode } from 'react';
import '@/ui/styles/overview.css';

export function PageOverview({
  intro,
  children,
  compactTitle = false,
}: {
  intro: ReactNode;
  children: ReactNode;
  compactTitle?: boolean;
}) {
  return (
    <div className={`page-overview${compactTitle ? ' page-overview--compact-title' : ''}`}>
      {intro}
      {children}
    </div>
  );
}
