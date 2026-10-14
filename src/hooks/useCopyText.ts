import { useCallback, useEffect, useState } from 'react';

export function useCopyText(text: string, reset = 2_000) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), reset);
    return () => window.clearTimeout(timer);
  }, [copied, reset]);
  const copy = useCallback(async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      return true;
    } catch {
      setCopied(false);
      setFailed(true);
      return false;
    }
  }, [text]);
  return { copied, failed, copy };
}
