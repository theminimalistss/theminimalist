import type { InquiryRepository } from '@/types/inquiry';

export function createInquiryRepository(endpoint: string): InquiryRepository {
  const url = endpoint.trim();
  return {
    available: url !== '',
    async send(payload, signal) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: signal ?? null,
      });
      const body: unknown = await response.json().catch(() => null);
      return { status: response.status, body };
    },
  };
}

export const inquiryRepository = createInquiryRepository(
  String(import.meta.env.VITE_CONTACT_ENDPOINT ?? ''),
);
