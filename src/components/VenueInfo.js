import React from 'react';
import { Heading, NextLink, Text } from '@codeday/topo/Atom';
import { FileDoc } from '@codeday/topocons';
import InfoBox from './InfoBox';
import { DeleteVenueModal, UpdateVenueModal } from './forms/Venue';
import ContactBox from './ContactBox';
import DocsCallout from './DocsCallout';

export default function VenueInfo({
  venue, children, buttons, ...props
}) {
  if (!venue) {
    return (
      <InfoBox heading="Venue" buttons={buttons} {...props}>
        No venue... yet! <br />
        <DocsCallout>
          <NextLink color="brand" href="https://codeday.notion.site/searchVenue-db-templates-criteria-bd376b4bd5324bf68614f3089069ca98">
            Click here
          </NextLink>
          &nbsp;to read tips on finding a venue in the CodeDay Organizer Guide!
        </DocsCallout>
        {children}
      </InfoBox>
    );
  }
  return (
    <InfoBox
      id={venue.id}
      headingSize="xl"
      heading="Venue"
      buttons={(
        <>
          <UpdateVenueModal
            venue={venue}
          />
                    &nbsp;
          <DeleteVenueModal
            venue={venue}
          />
          {buttons && <>&nbsp;{buttons}</>}
        </>
              )}
      {...props}
    >
      <Heading size="md">{venue.name}</Heading>
      <Text mb={0}>
        <NextLink href={venue.mapLink}>{venue.address}</NextLink>
      </Text>
      <Text mb={0}>Capacity: {venue.capacity}</Text>
      <ContactBox nested name={venue.contactName} email={venue.contactEmail} phone={venue.contactPhone} />
      {children}
    </InfoBox>
  );
}
