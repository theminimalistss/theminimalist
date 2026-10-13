import { ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { PageLink } from '@/ui/components/PageLink';
import { EditorialSection } from '@/ui/sections/Page/EditorialSection';
import { EditorialList } from '@/ui/sections/Page/EditorialList';

const PRINCIPLES = [
  { title: 'Clarity', text: 'Focus on what matters. Let the rest breathe.' },
  { title: 'Warmth', text: 'An inviting presence. A human touch.' },
  { title: 'Character', text: 'Distinct identities, shaped with intention.' },
  { title: 'Care', text: 'The small details that make the whole feel right.' },
] as const;

export function StudioApproach() {
  return (
    <EditorialSection
      id="studio-approach-title"
      eyebrow="Our point of view"
      statement="Less,"
      accent="but with feeling."
      footer="Brand · Digital · Experience"
      title="Thoughtfully made."
      titleAccent="Naturally felt."
      lead="We bring together brand, digital, and experience with a warm, editorial sensibility. Clear identities, considered websites, and details that make the whole feel personal."
    >
      <EditorialList items={PRINCIPLES} label="Studio principles" />
      <PageLink className="text-button editorial-link" to={ROUTES.services}>
        Discover our services <Icon name="arrow" />
      </PageLink>
    </EditorialSection>
  );
}
