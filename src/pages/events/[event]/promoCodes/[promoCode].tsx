import React from 'react';
import { Flex, Heading, Spinner } from '@codeday/topo/Atom';

import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import NotFound from 'src/pages/404';
import { EditMetadata } from 'src/components/forms';
import { Page } from '../../../../components/Page';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { DeletePromoCode, UpdatePromoCode } from '../../../../components/forms/PromoCode';

import { PromoCodeBox } from '../../../../components/PromoCode';

import { TicketBox } from '../../../../components/Ticket';
import { MetadataBox } from '../../../../components/MetadataBox';

const query = graphql(`
  query PromoCodePage($where: ClearPromoCodeWhereUniqueInput!) {
    clear {
      promoCode(where: $where) {
        id
        code
        __typename
        metadata
        event {
          id
        }
        tickets {
          id
        }
      }
    }
  }
`);

export default function PromoCode() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.promoCode as string } } });
  const code = data?.clear?.promoCode;
  if (code === null && !fetching) {
    return <NotFound />;
  }
  if (!code) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title="Promo Code">
      <Breadcrumbs event={code.event} code={code} />
      <Heading>
        Promo Code ~ {code.code} <UpdatePromoCode /> <DeletePromoCode />
      </Heading>
      <Flex>
        <PromoCodeBox promoCode={code} heading="details" />
        <EditMetadata of={code} mKey="notes" />
        <MetadataBox metadata={code.metadata} />
      </Flex>
      Registrations using this code:
      <Flex>
        {code.tickets.map((ticket) => {
          return <TicketBox ticket={ticket} />;
        })}
      </Flex>
    </Page>
  );
}