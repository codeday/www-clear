import React from 'react';
import {
    CreateEmailTemplateModal,
    DeleteEmailTemplateModal,
    UpdateEmailTemplateModal
} from "../../../components/forms/EmailTemplate";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {getSession} from "next-auth/react";
import {getFetcher} from "../../../fetch";

// @ts-expect-error TS(2307) FIXME: Cannot find module './index.gql' or its correspond... Remove this comment to see the full error message
import {getEmailTemplatesQuery} from "./index.gql"
import EmailTemplate from "../../../components/EmailTemplate";

export default function Index({
    emailTemplates
}: any) {
    return (
        <Page>
            <Breadcrumbs />
            <CreateEmailTemplateModal />
            <ResponsiveMasonry>
                <Masonry>
                    {emailTemplates.map((e: any) => <EmailTemplate template={e} buttons={<><UpdateEmailTemplateModal emailtemplate={e} /> <DeleteEmailTemplateModal emailtemplate={e} /></>}/> )}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    query
}: any) {
    const session = await getSession({req});

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = getFetcher(session);
    if (!session) return {props: {}};

    // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 1.
    const emailTemplateResults = await fetch(getEmailTemplatesQuery);
    return {
        props: {
            emailTemplates: emailTemplateResults.clear.emailTemplates,
        },
    };
}

