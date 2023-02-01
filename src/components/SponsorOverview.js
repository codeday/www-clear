import React from 'react';
import {Heading, Text, Link} from "@codeday/topo/Atom";
import InfoBox from './InfoBox';
import DocsCallout from "./DocsCallout";

export default function SponsorOverview({sponsors, children, currencySymbol, ...props}) {
  let total = 0;
  sponsors.forEach((sponsor) => {
    total += sponsor.amount;
  });
  return (
    <InfoBox heading="Sponsors" {...props} headingSize="xl">
      <Heading p={4} align="center" size="4xl" color="green.500">{currencySymbol || '$'}{total}</Heading>
      <Text align="center">raised from a total of {sponsors.length} sponsors</Text>
      { sponsors.length === 0?
        <DocsCallout>
          Looking for help finding sponsors? Check out&nbsp;
          <Link color="brand" href="https://codeday.notion.site/searchSponsors-db-templates-perks-25c7ccf4f10d418da725b12433e4dd83">this page</Link>
          &nbsp;in the CodeDay Organizer Guide!
        </DocsCallout>
        : null}

      {children}
    </InfoBox>
  );
}
