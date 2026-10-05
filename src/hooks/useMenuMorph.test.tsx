import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMenuMorph } from '@/hooks/useMenuMorph';

function Harness({ open, reducedMotion = false }: { open: boolean; reducedMotion?: boolean }) {
  const { phase, rendered, canvasRef, originRef, settle } = useMenuMorph(open, reducedMotion);
  return (
    <>
      <canvas ref={canvasRef} />
      <button ref={originRef} onClick={settle}>
        Settle
      </button>
      <output>{`${phase}:${rendered ? 'shown' : 'hidden'}`}</output>
    </>
  );
}

const state = () => screen.getByRole('status').textContent;

describe('menu morph', () => {
  beforeEach(() =>
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'],
    }),
  );
  afterEach(() => vi.useRealTimers());

  it('keeps the menu rendered until the morph finishes in both directions', async () => {
    const { rerender } = render(<Harness open={false} />);
    expect(state()).toBe('closed:hidden');
    rerender(<Harness open />);
    expect(state()).toBe('opening:shown');
    await act(() => vi.advanceTimersByTimeAsync(1_500));
    expect(state()).toBe('open:shown');
    rerender(<Harness open={false} />);
    expect(state()).toBe('closing:shown');
    await act(() => vi.advanceTimersByTimeAsync(1_500));
    expect(state()).toBe('closed:hidden');
  });

  it('prepares the renderer when idle and falls back to a CSS reveal without WebGL', async () => {
    const { container, rerender } = render(<Harness open={false} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toHaveAttribute('data-renderer');
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    expect(canvas).toHaveAttribute('data-renderer', 'css');
    rerender(<Harness open />);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(canvas?.style.clipPath).toMatch(/^circle\(\d/);
  });

  it('switches instantly with reduced motion', () => {
    const { rerender } = render(<Harness open={false} reducedMotion />);
    rerender(<Harness open reducedMotion />);
    expect(state()).toBe('open:shown');
    rerender(<Harness open={false} reducedMotion />);
    expect(state()).toBe('closed:hidden');
  });

  it('settles immediately when the browser closes the dialog itself', () => {
    const { rerender } = render(<Harness open={false} />);
    rerender(<Harness open />);
    act(() => screen.getByRole('button', { name: 'Settle' }).click());
    rerender(<Harness open={false} />);
    expect(state()).toBe('closed:hidden');
  });
});
