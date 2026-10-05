import lotus from '@/constants/lotus.json';

export const LOTUS_MARK = {
  ...lotus,
  base: { x: 356, y: 600 },
  textLine: 458,
  established: ['EST.', '2020'],
} as const;
