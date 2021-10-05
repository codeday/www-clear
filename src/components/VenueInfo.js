import React from 'react';
import Text, {Heading, Link} from '@codeday/topo/Atom/Text';
import {Flex} from '@codeday/topo/Atom/Box';
import InfoBox from './InfoBox';
import Notes from './forms/Notes';
import {SetVenueNotesMutation} from './forms/Notes.gql';
import {DeleteVenueModal, UpdateVenueModal} from './forms/Venue';
import ContactBox from './ContactBox';

export default function VenueInfo({venue, children, ...props}) {
    if (!venue) return (<InfoBox heading="Venue" {...props}>{children}</InfoBox>);
    return (
        <InfoBox
            id={venue.id}
            heading={(
                <>Venue
                    <UpdateVenueModal
                        venue={venue}
                    />
                    <DeleteVenueModal
                        venue={venue}
                    />
                </>
            )}
            {...props}
        >
            <Heading size="md">{venue.name}</Heading>
            <Text>
                <Link href={venue.mapLink}>{venue.address}</Link>
            </Text>
            <Text>Capacity: {venue.capacity}</Text>
            <Flex>
                <ContactBox name={venue.contactName} email={venue.contactEmail} phone={venue.contactPhone}/>
                <Notes notes={venue.notes} updateMutation={SetVenueNotesMutation} updateId={venue.id}/>
            </Flex>
            {children}
        </InfoBox>
    );
}
