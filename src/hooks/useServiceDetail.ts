import { useEffect, useState } from 'react';
import { getServiceDetail } from '@/services/serviceDetails.service';
import type { ServiceDetail, ServiceKey } from '@/types/service';

type State =
  | { status: 'loading'; key: ServiceKey }
  | { status: 'ready'; key: ServiceKey; detail: ServiceDetail }
  | { status: 'error'; key: ServiceKey };

export function useServiceDetail(key: ServiceKey) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ status: 'loading', key });
  useEffect(() => {
    const controller = new AbortController();
    void getServiceDetail(key, undefined, controller.signal).then(
      (detail) => {
        if (!controller.signal.aborted) setState({ status: 'ready', key, detail });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: 'error', key });
      },
    );
    return () => controller.abort();
  }, [key, attempt]);
  const retry = () => {
    setState({ status: 'loading', key });
    setAttempt((value) => value + 1);
  };
  return { state: state.key === key ? state : { status: 'loading' as const, key }, retry };
}
