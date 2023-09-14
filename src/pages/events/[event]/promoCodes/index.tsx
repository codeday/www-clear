import React from 'react';
import { Flex, Heading, Spinner } from '@codeday/topo/Atom';

import { useRouter } from 'next/router';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import NotFound from 'src/pages/404';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { Page } from '../../../../components/Page';
import { PromoCodeBox } from '../../../../components/PromoCode';
import { CreatePromoCode, CreateScholarshipCodeButton } from '../../../../components/forms/PromoCode';

const query = graphql(`
  query EventPromoCodes($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
        promoCodes {
          id
        }
      }
    }
  }
`);

export default function PromoCodes() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.event as string } } });
  const event = data?.clear?.event;
  if (event === null && !fetching) {
    return <NotFound />;
  }

  if (!event) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title="Promo Codes">
      <Breadcrumbs event={event} />
      <Heading>
        {event.name} ~ Promo Codes <CreatePromoCode />
        <CreateScholarshipCodeButton />
      </Heading>
      <Flex>
        {event.promoCodes.map((promoCode) => {
          return <PromoCodeBox promoCode={promoCode} as="a" href={`promoCodes/${promoCode.id}`} />;
        })}
      </Flex>
    </Page>
  );
}
