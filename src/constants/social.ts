import social from '@/constants/social.json';

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'behance';
export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  handle: string;
  url: string;
  primary: boolean;
};

export const SOCIAL_LINKS = social as readonly SocialLink[];
export const PRIMARY_SOCIAL = SOCIAL_LINKS.filter((link) => link.primary);
export const MORE_SOCIAL = SOCIAL_LINKS.filter((link) => !link.primary);
