import { FOUNDERS } from '@/constants/founders';
import { useHeroWorks } from '@/hooks/useHeroWorks';
import { ROUTES } from '@/router/paths';
import { PageDirectory } from '@/ui/sections/Page/PageDirectory';
import { WorkImage } from '@/ui/components/WorkImage';

function FoundersArtwork() {
  return (
    <div className="studio-founder-pair">
      {FOUNDERS.map((founder) => (
        <div className="studio-founder" key={founder.slug}>
          <picture>
            <source
              type="image/avif"
              srcSet={`${founder.portrait.avifSmall} 480w, ${founder.portrait.avif} 960w`}
              sizes="80px"
            />
            <img
              src={founder.portrait.webpSmall}
              srcSet={`${founder.portrait.webpSmall} 480w, ${founder.portrait.webp} 960w`}
              sizes="80px"
              alt=""
              width="480"
              height="600"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      ))}
    </div>
  );
}

function WorksArtwork() {
  const state = useHeroWorks();
  const works = state.status === 'ready' ? state.works.slice(0, 2) : [];
  return (
    <div className="studio-studies">
      {works.length ? (
        works.map((work) => (
          <div className="studio-study" key={work.id}>
            <WorkImage
              image={work.mediaType === 'image' ? work.image : work.poster}
              alt=""
              sizes="80px"
            />
            <div className="studio-study-caption">
              <span className="serif">{work.title}</span>
            </div>
          </div>
        ))
      ) : (
        <span className="studio-studies-fallback serif">
          Brand.
          <br />
          Digital.
          <br />
          Experience.
        </span>
      )}
    </div>
  );
}

export function StudioPortals() {
  return (
    <PageDirectory
      title="Explore the studio"
      label="Studio destinations"
      items={[
        {
          to: ROUTES.founders,
          label: 'Founders',
          category: 'The people',
          description: 'A partnership between design and engineering.',
          artwork: <FoundersArtwork />,
        },
        {
          to: ROUTES.testimonials,
          label: 'Testimonials',
          category: 'The perspectives',
          description: 'Words from the people we work with.',
          dark: true,
          artwork: (
            <div className="studio-words">
              <span className="serif">
                Kind
                <br />
                <em>words.</em>
              </span>
            </div>
          ),
        },
        {
          to: ROUTES.works,
          label: 'Works',
          category: 'The work',
          description: 'Independent concept studies from the studio.',
          artwork: <WorksArtwork />,
        },
      ]}
    />
  );
}
