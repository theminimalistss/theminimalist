import { PageLink } from '@/ui/components/PageLink';

type Crumb = { label: string; to?: string };

export function Breadcrumbs({ trail }: { trail: readonly Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb" data-reveal="item">
      <ol>
        {trail.map((crumb, index) => (
          <li key={crumb.label}>
            {crumb.to && index < trail.length - 1 ? (
              <PageLink to={crumb.to}>{crumb.label}</PageLink>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
