import { describe, expect, it } from 'vitest';
import {
  composeInquiry,
  emptyInquiry,
  toInquiryKind,
  validateInquiry,
} from '@/services/inquiry.service';

const filled = {
  ...emptyInquiry('quote'),
  name: 'Ana Cruz',
  email: 'ana@example.com',
  service: 'Branding identity',
  timeline: 'Flexible',
  message: 'We are opening a café in Cebu and need a brand.',
};

describe('inquiries', () => {
  it('reads the inquiry kind from a link, defaulting to a general hello', () => {
    expect(toInquiryKind('quote')).toBe('quote');
    expect(toInquiryKind('appointment')).toBe('appointment');
    expect(toInquiryKind('anything')).toBe('general');
    expect(toInquiryKind(null)).toBe('general');
  });

  it('asks only for what each kind of inquiry needs', () => {
    expect(validateInquiry(filled, '2026-10-14')).toEqual({});
    expect(Object.keys(validateInquiry(emptyInquiry(), '2026-10-14')).sort()).toEqual([
      'email',
      'message',
      'name',
    ]);
    expect(validateInquiry({ ...filled, service: '' }, '2026-10-14').service).toBeDefined();
    expect(validateInquiry({ ...filled, email: 'ana@' }, '2026-10-14').email).toMatch(/check/u);
    const meeting = { ...filled, kind: 'appointment' as const, date: '2026-10-01' };
    const errors = validateInquiry(meeting, '2026-10-14');
    expect(errors.date).toMatch(/today/u);
    expect(errors.format).toBeDefined();
    expect(errors.service).toBeUndefined();
  });

  it('composes a ready-to-send email with only the details given', () => {
    const { subject, body, href } = composeInquiry(filled, 'studio@example.com');
    expect(subject).toBe('Quote request from Ana Cruz — Branding identity');
    expect(body).toContain('We are opening a café in Cebu');
    expect(body).toContain('Service: Branding identity');
    expect(body).not.toContain('Budget');
    expect(body).not.toContain('Preferred date');
    expect(href.startsWith('mailto:studio@example.com?subject=')).toBe(true);
    expect(decodeURIComponent(href.split('&body=')[1]!)).toBe(body);
  });

  it('validates dates even when a browser falls back to a text input', () => {
    const draft = { ...filled, kind: 'appointment' as const, format: 'Online' };
    for (const date of ['not-a-date', '2026-02-30', '2026-13-01', '2026-1-1']) {
      expect(validateInquiry({ ...draft, date }, '2026-01-01').date).toMatch(/valid date/u);
    }
    expect(validateInquiry({ ...draft, date: '2028-02-29' }, '2026-01-01')).toEqual({});
    expect(validateInquiry({ ...draft, date: '2026-01-01' }, '2026-01-01')).toEqual({});
  });
});
