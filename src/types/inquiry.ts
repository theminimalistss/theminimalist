export const INQUIRY_KINDS = ['general', 'quote', 'appointment'] as const;

export type InquiryKind = (typeof INQUIRY_KINDS)[number];

export type InquiryDraft = {
  kind: InquiryKind;
  name: string;
  email: string;
  organisation: string;
  service: string;
  timeline: string;
  budget: string;
  date: string;
  time: string;
  format: string;
  message: string;
};

export type InquiryField = Exclude<keyof InquiryDraft, 'kind'>;

export type InquiryErrors = Partial<Record<InquiryField, string>>;

export type InquiryPayload = InquiryDraft & { website: string };

export type InquiryReply = { status: number; body: unknown };

export type InquiryDelivery =
  | { outcome: 'delivered' }
  | { outcome: 'invalid'; errors: InquiryErrors }
  | { outcome: 'limited' }
  | { outcome: 'failed' };

export type InquiryRepository = {
  readonly available: boolean;
  send(payload: InquiryPayload, signal?: AbortSignal): Promise<InquiryReply>;
};
