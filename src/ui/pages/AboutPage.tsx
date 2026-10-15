import { useSiteContent } from '@/hooks/useSiteContent';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageOverview } from '@/ui/sections/Page/PageOverview';
import { StudioApproach } from '@/ui/sections/Studio/StudioApproach';
import { StudioPortals } from '@/ui/sections/Studio/StudioPortals';
import '@/ui/styles/studio.css';

export default function AboutPage() {
  const copy = useSiteContent('pages').about;
  return (
    <>
      <PageOverview intro={<PageIntro {...copy} />}>
        <StudioPortals />
      </PageOverview>
      <StudioApproach />
    </>
  );
}
