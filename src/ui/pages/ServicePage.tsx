import { useServiceDetail } from '@/hooks/useServiceDetail';
import { useServiceMotion } from '@/hooks/useServiceMotion';
import { Icon } from '@/ui/components/Icon';
import { SERVICE_PAGES } from '@/router/navigation';
import { ROUTES, SERVICE_ROUTES } from '@/router/paths';
import type { ServiceKey } from '@/types/service';
import { Breadcrumbs } from '@/ui/sections/Page/Breadcrumbs';
import { SectionTabs } from '@/ui/sections/Page/SectionTabs';
import { SoftwareDetail } from '@/ui/sections/ServiceDetail/SoftwareDetail';
import { WebsiteDetail } from '@/ui/sections/ServiceDetail/WebsiteDetail';
import { BrandingDetail } from '@/ui/sections/ServiceDetail/BrandingDetail';
import { ServiceClosing } from '@/ui/sections/ServiceDetail/ServicePrimitives';
import '@/ui/styles/service-detail.css';

export default function ServicePage({ service }: { service: ServiceKey }) {
  const { state, retry } = useServiceDetail(service);
  const { ref, paused, reduced, running, toggle } = useServiceMotion(state.status === 'ready');
  const title = SERVICE_PAGES.find((item) => item.to === SERVICE_ROUTES[service])!.label;
  return (
    <div
      ref={ref}
      className={`service-detail service-detail--${service}`}
      data-motion={running ? 'running' : 'paused'}
    >
      <Breadcrumbs trail={[{ label: 'Services', to: ROUTES.services }, { label: title }]} />
      <SectionTabs items={SERVICE_PAGES} label="Services" />
      {state.status === 'ready' && !reduced && (
        <div className="sd-motion-tools sd-pad">
          <button type="button" aria-pressed={paused} onClick={toggle}>
            <Icon name={paused ? 'play' : 'pause'} />
            {paused ? 'Play' : 'Pause'} illustrations
          </button>
        </div>
      )}
      {state.status === 'loading' && (
        <p className="sd-status" role="status">
          Gathering the details…
        </p>
      )}
      {state.status === 'error' && (
        <div className="sd-status" role="alert">
          <h1>{title}</h1>
          <p>The service details couldn’t be loaded.</p>
          <button type="button" className="text-button" onClick={retry}>
            Try again
          </button>
        </div>
      )}
      {state.status === 'ready' && (
        <>
          {state.detail.key === 'software' && <SoftwareDetail detail={state.detail} />}
          {state.detail.key === 'websites' && <WebsiteDetail detail={state.detail} />}
          {state.detail.key === 'branding' && <BrandingDetail detail={state.detail} />}
          <ServiceClosing detail={state.detail} />
        </>
      )}
    </div>
  );
}
