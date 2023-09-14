import React from 'react';
import { Flex, Heading, Link, Spinner } from '@codeday/topo/Atom';
import { IdCard, Email } from '@codeday/topocons';
import { graphql } from 'generated/gql';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import NotFound from 'src/pages/404';
import { EditMetadata } from 'src/components/forms';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { Page } from '../../../../components/Page';
import { InfoBox } from '../../../../components/InfoBox';
import { DeleteScheduleItem, UpdateScheduleItem } from '../../../../components/forms/ScheduleItem';
import { ContactBox } from '../../../../components/ContactBox';

const query = graphql(`
  query ScheduleItemPage($where: ClearScheduleItemWhereUniqueInput!) {
    clear {
      scheduleItem(where: $where) {
        id
        __typename
        name
        link
        displayTimeWithDate
        hostName
        hostPronoun
        type
        hostEmail
        description
        organizerEmail
        organizerName
        organizerPhone
        event {
          id
        }
      }
    }
  }
`);

export default function ScheduleItem() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.scheduleitem as string } } });
  const scheduleitem = data?.clear?.scheduleItem;

  if (scheduleitem === null && !fetching) {
    return <NotFound />;
  }
  if (!scheduleitem) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }
  return (
    <Page title={scheduleitem.name}>
      <Breadcrumbs event={scheduleitem.event} scheduleitem={scheduleitem} />
      <Heading>
        {scheduleitem.type ? `${scheduleitem.type}: ` : null} {scheduleitem.name}
        <UpdateScheduleItem />
        <DeleteScheduleItem />
      </Heading>
      <Heading size="md">{scheduleitem.displayTimeWithDate}</Heading>
      {scheduleitem.link && <Link href={scheduleitem.link}>{scheduleitem.link}</Link>}
      <Flex>
        <InfoBox heading="Description">{scheduleitem.description}</InfoBox>
        <InfoBox heading="Host">
          <IdCard />
          {scheduleitem.hostName} ({scheduleitem.hostPronoun}) <br />
          <Email />
          {scheduleitem.hostEmail}
        </InfoBox>
        <InfoBox heading="Internal">
          <ContactBox
            heading="Organizer"
            name={scheduleitem.organizerName}
            email={scheduleitem.organizerEmail}
            phone={scheduleitem.organizerPhone}
          />
          <EditMetadata of={scheduleitem} mKey="notes" />
        </InfoBox>
      </Flex>
    </Page>
  );
}
