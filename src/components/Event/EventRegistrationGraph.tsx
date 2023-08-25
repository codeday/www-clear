import React from 'react';
import { Button, Box, Heading, Text, Spinner } from '@codeday/topo/Atom';

import { Eye } from '@codeday/topocons';
import { SizeMe } from 'react-sizeme';
import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts';
import { ClearEvent } from 'generated/gql/graphql';
import { DateTime } from 'luxon';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ImplicitLabelType } from 'recharts/types/component/Label';
import { InfoBox, InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query EventRegistrationGraph($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        endDate
        tickets {
          id
          type
          createdAt
        }
        venue {
          id
          capacity
        }
        interestedEmails {
          id
        }
      }
    }
  }
`);

interface GraphPoints {
  x: number;
  y: number;
}

export type EventRegistrationGraphProps = {
  event: PropFor<ClearEvent>;
} & InfoBoxProps;

const CapacityLabel: ImplicitLabelType = ({ cap, viewBox, ...props }) => {
  return (
    <text {...props} {...viewBox} fill="#ccc">
      {cap} cap
    </text>
  );
};

export default function RegistrationGraph({ event: eventData, children, ...props }: EventRegistrationGraphProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;
  const now = DateTime.min(DateTime.now(), event.endDate);
  const graphStart = now.minus({ days: 30 });
  const points: GraphPoints[] = [];

  const studentTickets = event.tickets.filter((t) => t.type === 'STUDENT');
  const staffTickets = event.tickets.filter((t) => t.type !== 'STUDENT');

  for (let current = graphStart; current < now; current = current.plus({ day: 1 })) {
    points.push({
      x: -1 * Math.floor(now.diff(current).as('days')),
      y: studentTickets.filter((t) => t.createdAt < current).length,
    });
  }
  return (
    <InfoBox heading="Registrations" headingSize="xl" {...props}>
      <Heading>{event.tickets.length} Registrations</Heading>
      <Text m={0} ml={0.5}>
        {`${studentTickets.length} students; ${staffTickets.length} staff`}
      </Text>
      {children}
      {studentTickets.length > 0 && (
        <SizeMe>
          {({ size }) =>
            !(size.width && size.width > 0) ? (
              <div />
            ) : (
              <Box>
                <AreaChart width={size.width} height={size.width * 0.66} data={points}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff686b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff686b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis type="number" dataKey="x" />
                  <YAxis
                    domain={event.venue?.capacity ? [0, event.venue.capacity] : undefined}
                    type="number"
                    dataKey="y"
                    mirror
                  />
                  <Area type="monotone" dataKey="y" yAxisId={0} stroke="#ff686b" fillOpacity={1} fill="url(#colorUv)" />
                  {event.venue?.capacity && event.tickets.length > event.venue.capacity && (
                    <ReferenceLine y={event.venue.capacity} stroke="#ccc" label={CapacityLabel} strokeDasharray="3 3" />
                  )}
                </AreaChart>
              </Box>
            )
          }
        </SizeMe>
      )}
      {event.interestedEmails.length} pre-registrations{' '}
      <Button as="a" href={`${event.id}/preRegistrations`} display="inline">
        <Eye />
      </Button>
    </InfoBox>
  );
}
