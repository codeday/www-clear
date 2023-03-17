import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import {
  CreateEmailTemplateModal,
  DeleteEmailTemplateModal,
  UpdateEmailTemplateModal,
} from '../../../components/forms/EmailTemplate';
import Page from '../../../components/Page';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getFetcher } from '../../../fetch';
import { getEmailTemplatesQuery } from './index.gql';
import EmailTemplate from '../../../components/EmailTemplate';

export default function Index({ emailTemplates }) {
  return (
    <>
      <Breadcrumbs />
      <CreateEmailTemplateModal />
      <ResponsiveMasonry>
        <Masonry>
          {emailTemplates.map((e) => <EmailTemplate template={e} buttons={<><UpdateEmailTemplateModal emailtemplate={e} /> <DeleteEmailTemplateModal emailtemplate={e} /></>} />)}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const emailTemplateResults = await fetch(getEmailTemplatesQuery);
  return {
    props: {
      emailTemplates: emailTemplateResults.clear.emailTemplates,
    },
  };
}
