import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <a className="skip-link" href="#main-content">
        Skip to selected works
      </a>
      <AppRouter />
    </ErrorBoundary>
  );
}
