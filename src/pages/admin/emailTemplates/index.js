import React from 'react';
import {
    CreateEmailTemplateModal,
    DeleteEmailTemplateModal,
    UpdateEmailTemplateModal
} from "../../../components/forms/EmailTemplate";
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import Page from "../../../components/Page";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {getSession} from "next-auth/react";
import {useFetcher} from "../../../fetch";
import {print} from "graphql";
import getEmailTemplatesQuery from "./index.gql"
import EmailTemplate from "../../../components/EmailTemplate";

export default function Index({emailTemplates}) {
    return (
        <Page>
            <Breadcrumbs />
            <CreateEmailTemplateModal />
            <ResponsiveMasonry>
                <Masonry>
                    {emailTemplates.map((e) => <EmailTemplate template={e} buttons={<><UpdateEmailTemplateModal emailtemplate={e} /> <DeleteEmailTemplateModal emailtemplate={e} /></>}/> )}
                </Masonry>
            </ResponsiveMasonry>
        </Page>
    )
}

export async function getServerSideProps({req, res, query}) {
    const session = await getSession({req});
    const fetch = useFetcher(session);
    if (!session) return {props: {}};
    const emailTemplateResults = await fetch(print(getEmailTemplatesQuery));
    return {
        props: {
            emailTemplates: emailTemplateResults.clear.emailTemplates,
        },
    };
}

