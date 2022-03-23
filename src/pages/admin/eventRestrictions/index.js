import {Link} from '@codeday/topo/Atom/Text';
import Page from '../../../components/Page';
import Breadcrumbs from "../../../components/Breadcrumbs";
import {getSession} from "next-auth/client";
import {useFetcher} from "../../../fetch";
import {print} from "graphql";
import getEventRestrictionsQuery from "./index.gql";
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import EventRestriction from "../../../components/EventRestriction";
import {CreateEventRestrictionModal} from "../../../components/forms/EventRestriction";

export default function Index({restrictions}) {
    return (
        <Page>
            <Breadcrumbs />
            <CreateEventRestrictionModal />
            <ResponsiveMasonry>
                <Masonry>
                    {restrictions.map((r) => (<EventRestriction eventRestriction={r} /> ))}
                </Masonry>
            </ResponsiveMasonry>

        </Page>
    );
}

export async function getServerSideProps({req, res, query}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const eventRestrictionResults = await fetch(getEventRestrictionsQuery);
    return {
        props: {
            restrictions: eventRestrictionResults.clear.eventRestrictions,
        },
    };
}
