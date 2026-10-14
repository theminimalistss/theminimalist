import { useId, useState, type CSSProperties } from 'react';
import { MORE_SOCIAL, PRIMARY_SOCIAL, type SocialLink } from '@/constants/social';
import { Icon } from '@/ui/components/Icon';

function Channel({
  link,
  index,
  hidden = false,
}: {
  link: SocialLink;
  index: number;
  hidden?: boolean;
}) {
  return (
    <li style={{ '--i': index } as CSSProperties}>
      <a
        className="social-tile"
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hidden ? -1 : undefined}
      >
        <span className="social-badge" aria-hidden="true">
          <Icon name={link.platform} />
        </span>
        <span className="social-name">{link.label}</span>
        <span className="social-handle">{link.handle}</span>
        <Icon name="arrow" className="social-arrow" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}

export function ContactChannels() {
  const [open, setOpen] = useState(false);
  const moreId = useId();
  return (
    <div className="contact-channels" data-open={open ? '' : undefined}>
      <span className="eyebrow">Follow the studio</span>
      <ul className="contact-channel-list" aria-label="Main social channels">
        {PRIMARY_SOCIAL.map((link, index) => (
          <Channel key={link.platform} link={link} index={index} />
        ))}
      </ul>
      {MORE_SOCIAL.length > 0 && (
        <>
          <div className="contact-more" id={moreId} inert={!open} aria-hidden={!open}>
            <div>
              <ul className="contact-channel-list" aria-label="More social channels">
                {MORE_SOCIAL.map((link, index) => (
                  <Channel key={link.platform} link={link} index={index} hidden={!open} />
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            className="contact-more-toggle"
            aria-expanded={open}
            aria-controls={moreId}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name="plus" className="contact-more-icon" />
            <span>{open ? 'Less' : 'More'}</span>
          </button>
        </>
      )}
    </div>
  );
}
