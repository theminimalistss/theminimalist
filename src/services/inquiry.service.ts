import type { InquiryDraft, InquiryErrors, InquiryKind } from '@/types/inquiry';
import { INQUIRY_KINDS } from '@/types/inquiry';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function toInquiryKind(value: string | null | undefined): InquiryKind {
  return INQUIRY_KINDS.includes(value as InquiryKind) ? (value as InquiryKind) : 'general';
}

export function emptyInquiry(kind: InquiryKind = 'general'): InquiryDraft {
  return {
    kind,
    name: '',
    email: '',
    organisation: '',
    service: '',
    timeline: '',
    budget: '',
    date: '',
    time: '',
    format: '',
    message: '',
  };
}

export function validateInquiry(draft: InquiryDraft, today: string): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!draft.name.trim()) errors.name = 'Please add your name.';
  if (!draft.email.trim()) errors.email = 'Please add your email.';
  else if (!EMAIL.test(draft.email.trim())) errors.email = 'Please check your email address.';
  if (draft.message.trim().length < 10) errors.message = 'Please write a few words about it.';
  if (draft.kind === 'quote' && !draft.service) errors.service = 'Please choose a service.';
  if (draft.kind === 'appointment') {
    if (!draft.date) errors.date = 'Please choose a date.';
    else if (!isCalendarDate(draft.date)) errors.date = 'Please choose a valid date.';
    else if (draft.date < today) errors.date = 'Please choose a date from today onward.';
    if (!draft.format) errors.format = 'Please choose online or in person.';
  }
  return errors;
}

const SUBJECTS: Record<InquiryKind, string> = {
  general: 'Hello from',
  quote: 'Quote request from',
  appointment: 'Meeting request from',
};

export function composeInquiry(draft: InquiryDraft, recipient: string) {
  const name = draft.name.trim();
  const detail =
    draft.kind === 'quote' && draft.service
      ? ` — ${draft.service}`
      : draft.kind === 'appointment' && draft.date
        ? ` — ${draft.date}`
        : '';
  const subject = `${SUBJECTS[draft.kind]} ${name}${detail}`;
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', draft.email.trim()],
    ['Organisation', draft.organisation.trim()],
  ];
  if (draft.kind === 'quote')
    rows.push(
      ['Service', draft.service],
      ['Timeline', draft.timeline],
      ['Budget', draft.budget.trim()],
    );
  if (draft.kind === 'appointment')
    rows.push(
      ['Preferred date', draft.date],
      ['Preferred time', draft.time],
      ['Meeting', draft.format],
    );
  const details = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
  const body = `${draft.message.trim()}\n\n—\n${details}`;
  const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { subject, body, href };
}
