import { NextLink } from '@codeday/topo/Atom';
import Page from '../../components/Page';

export default function Index() {
  return (
    <ul>
      <li>
        <NextLink href="admin/emailTemplates">Email templates</NextLink>
      </li>
    </ul>
  );
}

export function getStaticProps() {
  return { props: { slug: '/admin' } };
}
