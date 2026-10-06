import { useId, useState } from 'react';
import { MORE_SOCIAL, PRIMARY_SOCIAL, type SocialLink } from '@/constants/social';
import { Icon } from '@/ui/components/Icon';

function SocialAnchor({ link, className }: { link: SocialLink; className: string }) {
  return (
    <a className={className} href={link.url} target="_blank" rel="noopener noreferrer">
      <span className="social-badge" aria-hidden="true">
        <Icon name={link.platform} />
      </span>
      <span className="social-name">{link.label}</span>
      <span className="social-handle">{link.handle}</span>
      <Icon name="arrow" className="social-arrow" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function SocialLinks() {
  const [open, setOpen] = useState(false);
  const trayId = useId();
  return (
    <div className="social">
      <ul className="social-links" aria-label="Main social channels" data-reveal="stagger">
        {PRIMARY_SOCIAL.map((link) => (
          <li key={link.platform}>
            <SocialAnchor link={link} className="social-tile" />
          </li>
        ))}
      </ul>
      {MORE_SOCIAL.length > 0 && (
        <div data-reveal="item">
          <div className="social-more" data-open={open ? '' : undefined}>
            <button
              className="social-more-toggle"
              aria-expanded={open}
              aria-controls={trayId}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name="plus" className="social-more-icon" />
              <span className="social-more-label">{open ? 'Less' : 'More'}</span>
            </button>
            <div className="social-more-tray" id={trayId} inert={!open}>
              <ul className="social-more-list" aria-label="More social channels">
                {MORE_SOCIAL.map((link) => (
                  <li key={link.platform}>
                    <SocialAnchor link={link} className="social-chip" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
