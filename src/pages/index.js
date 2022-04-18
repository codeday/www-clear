import {Link} from '@codeday/topo/Atom';
import Page from '../components/Page';

export default function Index() {
    return (
        <Page slug="/">
            <ul>
                <li>
                    <Link href="events">Events</Link>
                </li>
                <li>
                    <Link href="groups">Event Groups</Link>
                </li>
                <li>
                    <Link href="admin">Admin</Link>
                </li>
            </ul>
        </Page>
    );
}
