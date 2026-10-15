import { Link } from 'react-router';
import type { ComponentProps } from 'react';

export function PageLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />;
}
