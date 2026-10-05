import { Link } from 'react-router';
import { INQUIRY_PAGES, PRODUCT_PAGES, STUDIO_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';

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
      <div className="site-footer-brand">
        <span className="established" aria-hidden="true">
          EST. <LotusMark className="established-mark" /> 2020
        </span>
        <p>
          Less, but <em className="serif">with feeling.</em>
        </p>
      </div>
      <nav className="site-footer-nav" aria-label="Footer">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="eyebrow">{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <p className="site-footer-note">
        The Minimalist — independent design studio. Brand · Digital · Experience.
      </p>
    </footer>
  );
}
