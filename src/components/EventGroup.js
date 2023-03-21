import React from 'react';
import { Box, Text } from '@codeday/topo/Atom';
import moment from 'moment';
import InfoBox from './InfoBox';

export default function EventGroup({ group, ...props }) {
  return (
    <InfoBox as="a" href={`groups/${group.id}`} heading={group.name}>
      <Text>{group.displayDate}</Text>
      <Text>{group.events.length} Events</Text>
    </InfoBox>
  );
}
