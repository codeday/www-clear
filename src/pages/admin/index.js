import { Link } from '@codeday/topo/Atom';
import Page from '../../components/Page';

export default function Index() {
  return (
    <ul>
      <li>
        <Link href="admin/emailTemplates">Email templates</Link>
      </li>
    </ul>
  );
}

export function getStaticProps() {
  return { props: { slug: '/admin' } };
}
