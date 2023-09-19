import React from 'react';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { Spinner, Flex } from '@codeday/topo/Atom';
import {
  CreateEmailTemplate,
  DeleteEmailTemplate,
  UpdateEmailTemplate,
} from '../../../components/forms/EmailTemplate';

import { Page } from '../../../components/Page';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

import { EmailTemplateBox } from '../../../components/EmailTemplate';

const query = graphql(`
  query EmailTemplatesPage {
    clear {
      emailTemplates {
        id
      }
    }
  }
`);

export default function Index() {
  const [{ data }] = useQuery({ query });
  const emailTemplates = data?.clear?.emailTemplates;
  if (emailTemplates === undefined) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page>
      <Breadcrumbs />
      <CreateEmailTemplate />
      <Flex>
        {emailTemplates.map((e) => (
          <EmailTemplateBox
            emailTemplate={e}
            buttons={
              <>
                <UpdateEmailTemplate emailTemplate={e} /> <DeleteEmailTemplate emailTemplate={e} />
              </>
            }
          />
        ))}
      </Flex>
    </Page>
  );
}
