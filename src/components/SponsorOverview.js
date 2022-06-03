import React from 'react';
import {Heading, Text} from "@codeday/topo/Atom";
import InfoBox from './InfoBox';

export default function SponsorOverview({sponsors, children, currencySymbol, ...props}) {
    let total = 0;
    sponsors.forEach((sponsor) => {
        total += sponsor.amount;
    });
    return (
        <InfoBox heading="Sponsors" {...props} headingSize="xl">
            <Heading p={4} align="center" size="4xl" color="green.500">{currencySymbol || '$'}{total}</Heading>
            <Text align="center">raised from a total of {sponsors.length} sponsors
            </Text>
            {children}
        </InfoBox>
    );
}
