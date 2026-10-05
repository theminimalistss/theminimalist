import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WorkItem } from '@/ui/components/WorkItem';
import { imageWork } from '@/tests/fixtures';

describe('work preview', () => {
  it('presents meaningful metadata and opens the correct study', () => {
    const onSelect = vi.fn();
    render(<WorkItem work={imageWork} index={0} playing={false} onSelect={onSelect} />);
    const button = screen.getByRole('button', {
      name: 'Explore Test study — Brand identity, concept study',
    });
    expect(screen.getByAltText(imageWork.alt)).toHaveAttribute('width', '960');
    expect(screen.getByText('2026')).toBeInTheDocument();
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith(imageWork);
  });

  it('replaces broken imagery with an accessible local fallback', () => {
    render(<WorkItem work={imageWork} index={0} playing={false} onSelect={vi.fn()} />);
    fireEvent.error(screen.getByAltText(imageWork.alt));
    expect(screen.getByRole('img', { name: /Preview unavailable/ })).toBeInTheDocument();
  });
});
