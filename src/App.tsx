import { useEffect, useState } from 'react';
import { LOADER } from '@/constants/motion';
import { markAppEntered } from '@/hooks/useAppEntered';
import { useIntro } from '@/hooks/useIntro';
import { usePageLoad } from '@/hooks/usePageLoad';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { PageLoader } from '@/ui/components/PageLoader';

export default function App() {
  const reducedMotion = useReducedMotion();
  const intro = useIntro();
  const { ready, progress } = usePageLoad({
    minimum: reducedMotion ? LOADER.reducedDuration : LOADER.minimumDuration[intro.mode],
    maximum: LOADER.maximumDuration,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready) markAppEntered();
  }, [ready]);

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
          progress={progress}
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
