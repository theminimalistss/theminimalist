import { useEffect, useState } from 'react';
import { getProductDetail } from '@/services/productDetails.service';
import type { ProductKey } from '@/types/content';
import type { ProductDetail } from '@/types/product';

type State =
  | { status: 'loading'; key: ProductKey }
  | { status: 'ready'; key: ProductKey; detail: ProductDetail }
  | { status: 'error'; key: ProductKey };

export function useProductDetail(key: ProductKey) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ status: 'loading', key });
  useEffect(() => {
    const controller = new AbortController();
    void getProductDetail(key, undefined, controller.signal).then(
      (detail) => {
        if (!controller.signal.aborted) setState({ status: 'ready', key, detail });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: 'error', key });
      },
    );
    return () => controller.abort();
  }, [key, attempt]);
  return {
    state: state.key === key ? state : { status: 'loading' as const, key },
    retry: () => {
      setState({ status: 'loading', key });
      setAttempt((value) => value + 1);
    },
  };
}
