import { describe, expect, it } from 'vitest';
import { isNavGroupActive, PRIMARY_NAVIGATION } from '@/router/navigation';
import { ROUTES } from '@/router/paths';

const [works, studio, products, contact] = PRIMARY_NAVIGATION;

describe('site navigation', () => {
  it('reaches every route except home from the primary groups', () => {
    const reachable = new Set(
      PRIMARY_NAVIGATION.flatMap((group) => [group.to, ...group.children.map((item) => item.to)]),
    );
    const pages = Object.values(ROUTES).filter((path) => path !== ROUTES.home);
    expect(pages.filter((path) => !reachable.has(path))).toEqual([]);
  });

  it('marks a group active for its own pages and their descendants only', () => {
    expect(studio && isNavGroupActive(studio, ROUTES.founders)).toBe(true);
    expect(products && isNavGroupActive(products, ROUTES.hardware)).toBe(true);
    expect(contact && isNavGroupActive(contact, ROUTES.quote)).toBe(true);
    expect(works && isNavGroupActive(works, ROUTES.home)).toBe(false);
    expect(works && isNavGroupActive(works, '/worksheet')).toBe(false);
  });
});
