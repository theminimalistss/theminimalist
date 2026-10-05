import type { HeroWorks } from '@/hooks/useHeroWorks';

export function CollectionStatus({ state, className }: { state: HeroWorks; className: string }) {
  if (state.status === 'loading')
    return (
      <div className={className} role="status">
        <span className="loading-line" />
        Gathering a little inspiration…
      </div>
    );
  if (state.status === 'error')
    return (
      <div className={className} role="alert">
        <p>{state.message}</p>
        <button className="text-button" onClick={state.retry}>
          Try again ↗
        </button>
      </div>
    );
  if (state.works.length === 0)
    return (
      <div className={className}>
        <p>A new collection is taking shape.</p>
        <span>Come back soon for a little inspiration.</span>
      </div>
    );
  return null;
}
