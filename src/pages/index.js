import {Link} from '@codeday/topo/Atom/Text';
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
            </ul>
        </Page>
    );
}
