import type { InquiryKind } from '@/types/inquiry';

export const INQUIRY_INTENTS: readonly {
  kind: InquiryKind;
  label: string;
  hint: string;
  prompt: string;
}[] = [
  {
    kind: 'general',
    label: 'Say hello',
    hint: 'Questions, ideas, introductions.',
    prompt: 'What would you like to talk about?',
  },
  {
    kind: 'quote',
    label: 'Request a quote',
    hint: 'Scope and pricing for a project.',
    prompt: 'Tell us about the project: goals, audience, and anything you already have.',
  },
  {
    kind: 'appointment',
    label: 'Book a meeting',
    hint: 'Talk it through, in person or online.',
    prompt: 'What would you like to discuss when we meet?',
  },
];

export const INQUIRY_OPTIONS = {
  services: [
    'Branding identity',
    'Website development',
    'Software development',
    'Website template',
    'Not sure yet',
  ],
  timelines: ['As soon as possible', 'Within 1–3 months', 'In 3+ months', 'Flexible'],
  times: ['Early morning', 'Late morning', 'Any time in studio hours'],
  formats: ['Online', 'In person'],
} as const;
