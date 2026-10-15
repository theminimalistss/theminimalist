import { useSiteContent } from '@/hooks/useSiteContent';
import { ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { PageLink } from '@/ui/components/PageLink';
import { EditorialSection } from '@/ui/sections/Page/EditorialSection';
import { EditorialList } from '@/ui/sections/Page/EditorialList';

export function StudioApproach() {
  const { approach, principles } = useSiteContent('studio');
  const { linkLabel, ...copy } = approach;
  return (
    <EditorialSection id="studio-approach-title" {...copy}>
      <EditorialList items={principles} label="Studio principles" />
      <PageLink className="text-button editorial-link" to={ROUTES.services}>
        {linkLabel} <Icon name="arrow" />
      </PageLink>
    </EditorialSection>
  );
}
