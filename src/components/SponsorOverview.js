import React from 'react';
import Text, {Heading} from '@codeday/topo/Atom/Text';
import InfoBox from './InfoBox';

export default function SponsorOverview({sponsors, children, ...props}) {
    let total = 0;
    sponsors.forEach((sponsor) => {
        total += sponsor.amount;
    });
    return (
        <InfoBox heading="Sponsors" {...props} headingSize="xl">
            <Heading p={4} align="center" size="4xl" color="green.500">${total}</Heading>
            <Text align="center">raised of $500 goal
                <br/>
                From a total of {sponsors.length} sponsors
            </Text>
            {children}
        </InfoBox>
    );
}
