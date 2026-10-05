import { LOTUS_MARK } from '@/constants/brand';
import { useLoaderScene } from '@/hooks/useLoaderScene';
import { LotusMark } from '@/ui/components/LotusMark';

type Props = { ready: boolean; animated: boolean; onExited: () => void };

export function PageLoader({ ready, animated, onExited }: Props) {
  const { rootRef, canvasRef } = useLoaderScene({ ready, animated, onExited });
  const [before, after] = LOTUS_MARK.established;
  return (
    <div
      ref={rootRef}
      className="page-loader"
      data-renderer="pending"
      data-exiting={ready ? '' : undefined}
      role="status"
    >
      <canvas ref={canvasRef} className="page-loader-canvas" aria-hidden="true" />
      <div className="page-loader-mark" aria-hidden="true">
        <span>{before}</span>
        <LotusMark />
        <span>{after}</span>
      </div>
      <span className="sr-only">
        {ready ? 'The Minimalist is ready.' : 'Loading The Minimalist…'}
      </span>
    </div>
  );
}
