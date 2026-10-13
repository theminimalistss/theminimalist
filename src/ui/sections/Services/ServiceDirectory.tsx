import { SERVICE_IMAGES } from '@/constants/serviceImages';
import { SERVICE_PAGES } from '@/router/navigation';
import { PageDirectory } from '@/ui/sections/Page/PageDirectory';
import { WorkImage } from '@/ui/components/WorkImage';

const CATEGORIES = ['Engineering', 'Digital', 'Identity'] as const;

export function ServiceDirectory() {
  return (
    <div className="service-directory">
      <PageDirectory
        title="Choose a service"
        label="Services"
        items={SERVICE_PAGES.map((item, index) => {
          const image = SERVICE_IMAGES[index];
          return {
            ...item,
            category: CATEGORIES[index]!,
            artwork: image ? (
              <WorkImage image={image} alt="" sizes="(max-width: 767px) calc(100vw - 48px), 30vw" />
            ) : (
              <div className="service-image-placeholder" />
            ),
          };
        })}
      />
    </div>
  );
}
