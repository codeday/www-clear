import { Link } from '@codeday/topo/Atom';
import { Page } from '../../components/Page';

export default function Index() {
  return (
    <Page slug="/admin">
      <ul>
        <li>
          <Link href="admin/emailTemplates">Email templates</Link>
        </li>
      </ul>
    </Page>
  );
}
