import type { ImageSources } from './work';

export const SERVICE_KEYS = ['software', 'websites', 'branding'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];
export type ServiceCapability = { title: string; text: string; items: readonly string[] };
export type ServiceStep = { title: string; text: string };
export const SOFTWARE_PLATFORMS = ['web', 'mobile', 'desktop', 'api', 'embedded'] as const;
export type SoftwarePlatform = (typeof SOFTWARE_PLATFORMS)[number];
export type SoftwarePlatformCopy = ServiceStep & {
  id: SoftwarePlatform;
  items: readonly string[];
};

type ServiceBase = {
  title: string;
  accent: string;
  lead: string;
  discipline: string;
  fit: string;
  capabilities: {
    title: string;
    accent: string;
    text: string;
    items: readonly ServiceCapability[];
  };
  process: { title: string; accent: string; steps: readonly ServiceStep[] };
  handover: { title: string; text: string; items: readonly string[] };
  closing: { title: string; accent: string; text: string };
};

export type SoftwareService = ServiceBase & {
  key: 'software';
  preview: { caption: string; name: string; platforms: readonly SoftwarePlatformCopy[] };
};
export type WebsiteService = ServiceBase & {
  key: 'websites';
  preview: { caption: string; name: string; headline: string; text: string; image: ImageSources };
};
export type BrandingService = ServiceBase & {
  key: 'branding';
  preview: { caption: string; name: string; monogram: string; tagline: string; note: string };
};
export type ServiceDetail = SoftwareService | WebsiteService | BrandingService;

export interface ServiceDetailsRepository {
  getService(key: ServiceKey, signal?: AbortSignal): Promise<unknown>;
}
