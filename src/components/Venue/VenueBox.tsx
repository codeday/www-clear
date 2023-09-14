import React from 'react';
import { Heading, Link, Text, Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ClearVenue } from 'generated/gql/graphql';
import { InfoBox, InfoBoxProps } from '../InfoBox';
import { DeleteVenue, UpdateVenue } from '../forms/Venue';
import { ContactBox } from '../ContactBox';
import DocsCallout from '../DocsCallout';

const query = graphql(`
  query VenueBox($where: ClearVenueWhereUniqueInput!) {
    clear {
      venue(where: $where) {
        id
        addressLine1
        name
        mapLink
        address
        contactName
        contactEmail
        contactPhone
        capacity
      }
    }
  }
`);

export type VenueBoxProps = {
  venue: PropFor<ClearVenue> | undefined | null;
} & InfoBoxProps;

export function VenueBox({ venue: venueData, children, buttons, ...props }: VenueBoxProps) {
  const [{ data }] = useQuery({
    query,
    variables: { where: { id: venueData?.id || 'null' } },
    pause: !venueData,
  });
  const venue = data?.clear?.venue;
  if (venue === null || !venueData) {
    return (
      <InfoBox heading="Venue" {...props}>
        No venue... yet! <br />
        <DocsCallout>
          <Link
            color="brand"
            // eslint-disable-next-line no-secrets/no-secrets
            href="https://codeday.notion.site/searchVenue-db-templates-criteria-bd376b4bd5324bf68614f3089069ca98"
          >
            Click here
          </Link>
          &nbsp;to read tips on finding a venue in the CodeDay Organizer Guide!
        </DocsCallout>
        {children}
      </InfoBox>
    );
  }
  if (venue === undefined) return <Spinner />;
  return (
    <InfoBox
      id={venue.id}
      headingSize="xl"
      heading="Venue"
      buttons={
        <>
          <UpdateVenue venue={venue} />
          &nbsp;
          <DeleteVenue />
          {buttons && <>&nbsp;{buttons}</>}
        </>
      }
      {...props}
    >
      <Heading size="md">{venue.name}</Heading>
      <Text mb={0}>
        <Link href={venue.mapLink || undefined}>{venue.address}</Link>
      </Text>
      <Text mb={0}>Capacity: {venue.capacity}</Text>
      <ContactBox nested name={venue.contactName} email={venue.contactEmail} phone={venue.contactPhone} />
      {children}
    </InfoBox>
  );
}
