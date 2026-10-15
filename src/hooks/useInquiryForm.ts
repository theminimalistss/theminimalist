import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { useSiteContent } from '@/hooks/useSiteContent';
import { inquiryRepository } from '@/repositories/inquiry.repository';
import {
  composeInquiry,
  deliverInquiry,
  emptyInquiry,
  toInquiryKind,
  validateInquiry,
} from '@/services/inquiry.service';
import type { InquiryErrors, InquiryField, InquiryKind } from '@/types/inquiry';
import { useCopyText } from '@/hooks/useCopyText';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAppEntered } from '@/hooks/useAppEntered';

export type InquiryStatus =
  'editing' | 'sending' | 'delivered' | 'failed' | 'limited' | 'sent' | 'copied' | 'copy-error';

const today = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export function useInquiryForm() {
  const contact = useSiteContent('contact');
  const content = useSiteContent('inquiry');
  const [params] = useSearchParams();
  const requested = params.get('inquiry');
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState(() => emptyInquiry(toInquiryKind(requested)));
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<InquiryStatus>('editing');
  const [kindFromLink, setKindFromLink] = useState(requested);
  const [engaged, setEngaged] = useState(false);
  const visible = usePageVisibility();
  const reduced = useReducedMotion();
  const entered = useAppEntered();
  const [inView, setInView] = useState(() => typeof IntersectionObserver !== 'function');
  const motionEnabled = entered && visible && !reduced;
  const animate = motionEnabled && inView;
  const composed = composeInquiry(draft, contact.email);
  const emailText = `To: ${contact.email}\nSubject: ${composed.subject}\n\n${composed.body}`;
  const { copy: copyText } = useCopyText(emailText);
  const request = useRef<AbortController | null>(null);

  if (requested !== kindFromLink) {
    setKindFromLink(requested);
    if (requested) setDraft((value) => ({ ...value, kind: toInquiryKind(requested) }));
    setErrors({});
    setStatus('editing');
  }

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    const interaction = (event: Event) => {
      setEngaged(event.target instanceof Node && !!formRef.current?.contains(event.target));
    };
    document.addEventListener('pointerdown', interaction, { passive: true });
    document.addEventListener('focusin', interaction);
    return () => {
      document.removeEventListener('pointerdown', interaction);
      document.removeEventListener('focusin', interaction);
    };
  }, []);

  useEffect(() => {
    const artwork = formRef.current?.querySelector('.envelope');
    if (!artwork || typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting));
    observer.observe(artwork);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!requested) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    formRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [requested]);

  const height = useRef(0);
  const resizeAnimation = useRef<Animation | null>(null);
  const shape = `${draft.kind}|${Object.keys(errors).join()}|${status}`;
  useLayoutEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const previous =
      resizeAnimation.current && resizeAnimation.current.playState !== 'finished'
        ? form.getBoundingClientRect().height
        : height.current;
    resizeAnimation.current?.cancel();
    resizeAnimation.current = null;
    const next = form.offsetHeight;
    height.current = next;
    if (!motionEnabled || !previous || Math.abs(previous - next) < 2 || !form.animate) return;
    resizeAnimation.current = form.animate(
      [
        { height: `${previous}px`, overflow: 'hidden' },
        { height: `${next}px`, overflow: 'hidden' },
      ],
      { duration: 620, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)' },
    );
  }, [shape, motionEnabled]);
  useEffect(() => () => resizeAnimation.current?.cancel(), []);

  const setKind = useCallback((kind: InquiryKind) => {
    setEngaged(true);
    setDraft((value) => ({ ...value, kind }));
    setErrors({});
    setStatus('editing');
  }, []);

  const setField = useCallback((field: InquiryField, value: string) => {
    setEngaged(true);
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus((current) => (current === 'sending' ? current : 'editing'));
  }, []);

  const focusFirstError = useCallback((found: InquiryErrors) => {
    const first = Object.keys(found)[0];
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]:not([type="hidden"])`)?.focus();
    return !!first;
  }, []);

  const openEmailApp = useCallback(() => {
    window.location.href = composeInquiry(draft, contact.email).href;
    setStatus('sent');
  }, [draft, contact.email]);

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === 'sending') return;
      const found = validateInquiry(draft, today());
      setErrors(found);
      if (focusFirstError(found)) return;
      if (!inquiryRepository.available) {
        openEmailApp();
        return;
      }
      const website = new FormData(event.currentTarget).get('website');
      const controller = new AbortController();
      request.current = controller;
      setStatus('sending');
      deliverInquiry(
        inquiryRepository,
        draft,
        typeof website === 'string' ? website : '',
        controller.signal,
      ).then(
        (result) => {
          if (result.outcome === 'delivered') setDraft(emptyInquiry(draft.kind));
          if (result.outcome === 'invalid') {
            setErrors(result.errors);
            setStatus('editing');
            focusFirstError(result.errors);
            return;
          }
          setStatus(result.outcome);
        },
        () => undefined,
      );
    },
    [draft, status, openEmailApp, focusFirstError],
  );

  const copy = useCallback(async () => {
    setStatus((await copyText()) ? 'copied' : 'copy-error');
  }, [copyText]);

  return {
    formRef,
    content,
    draft,
    errors,
    status,
    animate,
    engaged,
    emailText,
    today: today(),
    email: contact.email,
    delivers: inquiryRepository.available,
    setKind,
    setField,
    submit,
    copy,
    openEmailApp,
  };
}
