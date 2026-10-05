import { Link, type LinkProps } from 'react-router';

export function PageLink(props: LinkProps) {
  return <Link viewTransition {...props} />;
}
