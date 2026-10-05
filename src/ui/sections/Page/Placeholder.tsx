import type { ReactNode } from 'react';
import { LotusMark } from '@/ui/components/LotusMark';

export function Placeholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="placeholder" aria-label={title} data-reveal="item">
      <LotusMark className="placeholder-mark" />
      <p className="placeholder-title">{title}</p>
      <p>{children}</p>
    </aside>
  );
}
