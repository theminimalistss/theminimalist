import { INQUIRY_PAGES, PRODUCT_PAGES, STUDIO_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';
import { PageLink } from '@/ui/components/PageLink';

const COLUMNS = [
  { title: 'Studio', links: STUDIO_PAGES },
  {
    title: 'Work',
    links: [
      { label: 'Works', to: ROUTES.works },
      { label: 'Collection in motion', to: ROUTES.home },
    ],
  },
  { title: 'Products', links: PRODUCT_PAGES },
  { title: 'Inquiries', links: [{ label: 'Contact', to: ROUTES.contact }, ...INQUIRY_PAGES] },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand" data-reveal="item">
        <span className="established" aria-hidden="true">
          EST. <LotusMark className="established-mark" /> 2020
        </span>
        <p>
          Less, but <em className="serif">with feeling.</em>
        </p>
      </div>
      <nav className="site-footer-nav" aria-label="Footer" data-reveal="stagger">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="eyebrow">{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <PageLink to={link.to}>{link.label}</PageLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <p className="site-footer-note" data-reveal="item">
        The Minimalist — Design Studio. Brand · Digital · Experience.
      </p>
    </footer>
  );
}
