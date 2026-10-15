import { describe, expect, it, vi } from 'vitest';
import {
  composeInquiry,
  deliverInquiry,
  emptyInquiry,
  readInquiryReply,
  toInquiryKind,
  toInquiryPayload,
  validateInquiry,
} from '@/services/inquiry.service';
import type { InquiryRepository } from '@/types/inquiry';

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

  it('sends trimmed fields with the spam trap value', () => {
    const payload = toInquiryPayload({ ...filled, name: '  Ana Cruz ' }, 'bot');
    expect(payload).toMatchObject({ kind: 'quote', name: 'Ana Cruz', website: 'bot' });
  });

  it('reads the studio server reply', () => {
    expect(readInquiryReply({ status: 202, body: { ok: true } })).toEqual({ outcome: 'delivered' });
    expect(readInquiryReply({ status: 429, body: null })).toEqual({ outcome: 'limited' });
    expect(
      readInquiryReply({
        status: 422,
        body: { errors: { email: 'Please check your email address.', admin: 'x', name: 3 } },
      }),
    ).toEqual({ outcome: 'invalid', errors: { email: 'Please check your email address.' } });
    expect(readInquiryReply({ status: 422, body: 'oops' })).toEqual({ outcome: 'failed' });
    expect(readInquiryReply({ status: 502, body: null })).toEqual({ outcome: 'failed' });
  });

  it('treats network errors as failures but lets cancellations through', async () => {
    const offline: InquiryRepository = {
      available: true,
      send: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    };
    await expect(deliverInquiry(offline, filled, '')).resolves.toEqual({ outcome: 'failed' });
    const controller = new AbortController();
    controller.abort();
    await expect(deliverInquiry(offline, filled, '', controller.signal)).rejects.toThrow();
  });
});
