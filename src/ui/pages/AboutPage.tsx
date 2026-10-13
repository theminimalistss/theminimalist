import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageOverview } from '@/ui/sections/Page/PageOverview';
import { StudioApproach } from '@/ui/sections/Studio/StudioApproach';
import { StudioPortals } from '@/ui/sections/Studio/StudioPortals';
import '@/ui/styles/studio.css';

export default function AboutPage() {
  return (
    <>
      <PageOverview
        intro={
          <PageIntro
            eyebrow="About the studio"
            title="The Minimalist"
            accent="Design Studio."
            lead="We shape identities and digital experiences with clarity, character, and care. Less, but with feeling. Our full studio story is being written; here is where we begin."
          />
        }
      >
        <StudioPortals />
      </PageOverview>
      <StudioApproach />
    </>
  );
}
