import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import Masonry from 'react-responsive-masonry';
import InfoBox from './InfoBox';
import {DeleteSponsorModal, UpdateSponsorModal} from './forms/Sponsor';
import ContactBox from './ContactBox';
import {SetSponsorNotesMutation} from './forms/Notes.gql';
import Notes from './forms/Notes';

export default function SponsorBox({sponsor, children, ...props}) {
    return (
        <InfoBox
            id={sponsor.id}
            heading={(
                <>
                    {sponsor.name}<Box d="inline-block"><UpdateSponsorModal sponsor={sponsor}/><DeleteSponsorModal
                    sponsor={sponsor}/></Box>
                </>
            )}
            {...props}
        >
            <Masonry columnsCount={2}>
                <InfoBox heading="Description">{sponsor.description}</InfoBox>
                <InfoBox heading="Contribution">
                    Amount: ${sponsor.amount}
                    <br/>
                    Perks: {sponsor.perks}
                </InfoBox>
                <ContactBox name={sponsor.contactName} email={sponsor.contactEmail} phone={sponsor.contactPhone}/>
                <Notes notes={sponsor.notes} updateId={sponsor.id} updateMutation={SetSponsorNotesMutation}/>
            </Masonry>
            {children}
        </InfoBox>
    );
}
