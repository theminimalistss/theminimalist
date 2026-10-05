import { createContext, useContext } from 'react';

export type SiteMenu = { open: boolean; show: () => void; close: () => void };

export const SiteMenuContext = createContext<SiteMenu>({
  open: false,
  show: () => undefined,
  close: () => undefined,
});

export function useSiteMenu() {
  return useContext(SiteMenuContext);
}
