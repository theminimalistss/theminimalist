import { useState } from 'react';
import { LOADER } from '@/constants/motion';
import { usePageReady } from '@/hooks/usePageReady';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { PageLoader } from '@/ui/components/PageLoader';

export default function App() {
  const reducedMotion = useReducedMotion();
  const ready = usePageReady(
    reducedMotion ? LOADER.reducedDuration : LOADER.minimumDuration,
    LOADER.maximumDuration,
  );
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
      <div className="app-shell" inert={!ready} data-entering={ready && loading ? '' : undefined}>
        <a className="skip-link" href="#main-content">
          Skip to selected works
        </a>
        <AppRouter />
      </div>
      {loading && (
        <PageLoader ready={ready} animated={!reducedMotion} onExited={() => setLoading(false)} />
      )}
    </ErrorBoundary>
  );
}
