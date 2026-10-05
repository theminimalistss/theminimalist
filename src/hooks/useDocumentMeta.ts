import { useEffect } from 'react';
import { formatPageTitle, getPageMeta } from '@/router/pageMeta';

function setContent(selector: string, value: string) {
  document.head.querySelector(selector)?.setAttribute('content', value);
}

export function useDocumentMeta(pathname: string) {
  useEffect(() => {
    const page = getPageMeta(pathname);
    const title = formatPageTitle(pathname);
    document.title = title;
    setContent('meta[name="description"]', page.description);
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', page.description);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      const url = new URL(pathname, canonical.href).href;
      canonical.href = url;
      setContent('meta[property="og:url"]', url);
    }
  }, [pathname]);
}
