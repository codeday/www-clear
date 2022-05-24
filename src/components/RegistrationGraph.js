import React from 'react';
import moment from 'moment';
import {Button, Box, Heading, Text} from '@codeday/topo/Atom';
import InfoBox from './InfoBox';
import {Eye} from '@codeday/topocons/Icon';
import { AspectRatio } from '@chakra-ui/react';
import { SizeMe } from 'react-sizeme';
import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts';

export default function RegistrationGraph({ event, children, ...props }) {
    const now = moment.min(moment(), moment(event.endDate));
    const DAYS = 30;
    const graphStart = now.clone().subtract(DAYS, 'days');
    const data = [];
    const ticketsWithDate = event.tickets.map((e) => ({ ...e, createdAt: moment(e.createdAt) }));

    for (let current = graphStart.clone(); current < now; current = current.add({ day: 1 })) {
      data.push({
        x: -1 * Math.floor(now.diff(current, 'days')),
        y: ticketsWithDate.filter(t => t.createdAt < current).length,
      });
    }
    return (
        <InfoBox heading="Registrations" headingSize="xl" {...props}>
            <Heading>{event.tickets.length} Registrations</Heading>
            <Text m={0} ml={.5} size="sm">{event.soldTickets} students; {event.tickets.length - event.soldTickets} staff</Text>
            {children}
            {event.soldTickets > 0 && (
                <SizeMe>{({ size }) => !(size.width && size.width > 0) ? <div></div> : (
                  <Box>
                    <AreaChart
                      width={size.width}
                      height={size.width * 0.66}
                      data={data}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff686b" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ff686b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                          type="number"
                          dataKey="x"
                        />
                        <YAxis
                          domain={event.venue?.capacity ? [0, event.venue.capacity] : undefined}
                          type="number"
                          dataKey="y"
                          mirror={true}
                        />
                        <Area
                          type="monotone"
                          dataKey="y"
                          yAxisId={0}
                          stroke="#ff686b"
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                        {event.venue?.capacity && event.tickets.length > event.venue.capacity && (
                          <ReferenceLine
                            y={event.venue.capacity}
                            stroke="#ccc"
                            label={({ viewBox, ...props }) => (
                              <text {...props} {...viewBox} fill="#ccc">{event.venue.capacity} cap</text>
                            )}
                            strokeDasharray="3 3"
                          />
                        )}
                    </AreaChart>
                  </Box>
                )}</SizeMe>
            )}
            {event.interestedEmails.length} pre-registrations <Button as="a" href={`${event.id}/preRegistrations`} d="inline"><Eye /></Button>
        </InfoBox>
    );
}
