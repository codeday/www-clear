import React from 'react';
import { Box } from '@codeday/topo/Atom';
import InfoBox from './InfoBox';
import { InfoAlert } from './Alert';

export default function EventRestrictionBox({ restrictions, children, ...props }) {
  return (
    <InfoBox heading="Event Restrictions" headingSize="xl" {...props}>
      <Box pl={4}>
        {restrictions.length > 0
          ? (
            <ul>
              {restrictions.map((r) => <li>{r.name}</li>)}
            </ul>
          )
          : <InfoAlert>No Event restrictions</InfoAlert>}
      </Box>
      {children}
    </InfoBox>
  );
}
