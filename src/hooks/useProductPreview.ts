import { useState } from 'react';
import type { HardwarePart, ProductLayout, SoftwareView } from '@/types/product';

/** Product studies are explored on input; no automatic selection timers. */
export function useProductPreview() {
  const [workspace, setWorkspace] = useState<SoftwareView>('organise');
  const [layout, setLayout] = useState<ProductLayout>('portfolio');
  const [part, setPart] = useState<HardwarePart>('shell');
  const [exploded, setExploded] = useState(true);
  return { workspace, setWorkspace, layout, setLayout, part, setPart, exploded, setExploded };
}
