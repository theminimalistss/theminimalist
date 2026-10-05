import { useEffect } from 'react';

const SELECTOR = '[data-reveal]:not([data-revealed])';

function reveal(element: Element) {
  element.setAttribute('data-revealed', '');
}

export function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(SELECTOR).forEach(reveal);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll(SELECTOR).forEach((element) => observer.observe(element));
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observer.observe(node);
          watch(node);
        }
      }
    });
    watch(document);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
}
