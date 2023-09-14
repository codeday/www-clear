import React from 'react';
import { Heading, Spinner, Text } from '@codeday/topo/Atom';
import { UiInfo } from '@codeday/topocons';
import { EditMetadata } from 'src/components/forms';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import NotFound from 'src/pages/404';
import { Page } from '../../../components/Page';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

const query = graphql(`
  query EventAdvancedConfig($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        __typename
        id
        name
      }
    }
  }
`);

export default function AdvancedConfig() {
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
    <Page title={`Advanced Config - ${event.name}`}>
      <Breadcrumbs event={event} />
      <Heading>{event.name} ~ Advanced Config</Heading>
      <Text mb={4}>
        <UiInfo /> These settings tweak how other apps and sites display your event. They only need to be changed in
        rare circumstances, so consult your CodeDay staff contact before making changes.
      </Text>
      <EditMetadata
      w="100%"
        of={event}
        mKey="date.display"
        name="Event date/time string"
        description="Override this text for events which are not 24-hour, noon-to-noon."
        placeholder="January 1-2, noon to noon"
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="notice.hero"
        name="Alert: Word"
        description="A word displayed in a large red box above the event name."
        placeholder="CANCELED"
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="notice.top"
        name="Alert: Bar"
        description="Short sentence displayed at the very top of the page in a full-width red bar."
        placeholder="This event has been canceled."
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="notice.box"
        name="Alert: Box"
        description="Paragraph with more details about an alert, displayed in a red box below the header."
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="registration.collect-org"
        name="Collect school/club during registration?"
        description="(Designed for free events which can't use promo codes.) Set this to 1 to require all participants to specify which school/club they're registering with."
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="registration.contact-and"
        name="Require both phone AND email?"
        description="By default events require either a phone OR an email. Set this to 1 if you want your event to require both."
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="registration.external.name"
        name="External Registration Name"
        description="If External Registration URL is also set, sets the display name of where to register."
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="registration.external.url"
        name="External Registration URL"
        description="Redirects registration to use a third-party page."
      />
      <EditMetadata
      w="100%"
        of={event}
        mKey="legal"
        name="Legal text"
        description="Sponsor trademark notice or other required legal text."
      />
    </Page>
  );
}
