import { useState } from 'react';
import { LOADER } from '@/constants/motion';
import { useIntro } from '@/hooks/useIntro';
import { usePageReady } from '@/hooks/usePageReady';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { PageLoader } from '@/ui/components/PageLoader';

export default function App() {
  const reducedMotion = useReducedMotion();
  const intro = useIntro();
  const ready = usePageReady(
    reducedMotion ? LOADER.reducedDuration : LOADER.minimumDuration[intro.mode],
    LOADER.maximumDuration,
  );
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
      <div className="app-shell" inert={!ready} data-entering={ready && loading ? '' : undefined}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <AppRouter />
      </div>
      {loading && (
        <PageLoader
          ready={ready}
          animated={!reducedMotion}
          bloomDuration={LOADER.bloomDuration[intro.mode]}
          onExited={() => {
            intro.complete();
            setLoading(false);
          }}
        />
      )}
    </ErrorBoundary>
  );
}
