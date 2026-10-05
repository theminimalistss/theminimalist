import { LOTUS_MARK } from '@/constants/brand';
import { useLoaderScene } from '@/hooks/useLoaderScene';
import { LotusMark } from '@/ui/components/LotusMark';

type Props = {
  ready: boolean;
  progress: number;
  animated: boolean;
  bloomDuration: number;
  onExited: () => void;
};

export function PageLoader({ ready, progress, animated, bloomDuration, onExited }: Props) {
  const { rootRef, canvasRef } = useLoaderScene({ ready, animated, bloomDuration, onExited });
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
      <div
        className="page-loader-progress"
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span className="page-loader-track">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className="page-loader-percent" aria-hidden="true">
          {String(Math.round(progress * 100)).padStart(2, '0')}
        </span>
      </div>
      <span className="sr-only">
        {ready ? 'The Minimalist is ready.' : 'Loading The Minimalist…'}
      </span>
    </div>
  );
}
