import React from 'react';
import { Box, BoxProps, Spinner } from '@codeday/topo/Atom';
import seed from 'random-seed';
import { useTheme as codedayTheme } from '@codeday/topo/utils';
import { DateTime, Interval } from 'luxon';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import Calendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import luxonPlugin from '@fullcalendar/luxon2';

import { EventInput } from '@fullcalendar/core';
import { WarningAlert } from '../Alert';
import { TimezoneInfo } from '../TimezoneInfo';

const query = graphql(`
  query EventCalendar($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        name
        startDate
        endDate
        timezone
        region {
          timezone
        }
        schedule {
          id
          name
          internal
          finalized
          type
          start
          end
          description
          displayTime
          hostName
          hostEmail
          hostPronoun
        }
      }
    }
  }
`);

export const eventColors: { [key: string]: string } = {
  Meal: 'green',
  Special: 'yellow',
  Event: 'gray',
  Workshop: 'orange',
  Livestream: 'purple',
  Deadline: 'red',
  'Gaming Tournament': 'pink',
};

export type EventCalendarProps = {
  event: PropFor<ClearEvent>;
} & BoxProps;

// TODO: Make this better (interactive scheduling, no need to click through to edit, show more details)
export function EventCalendar({ event: eventData }: EventCalendarProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;

  function scheduleItemToCalendarEvent(
    scheduleItem: NonNullable<typeof event>['schedule'] extends Array<infer A> ? A : never,
  ): EventInput {
    const { colors } = codedayTheme();
    const colorHues = Object.keys(colors);
    const baseColor =
      eventColors[scheduleItem.type || 'Event'] ||
      colorHues[seed.create(scheduleItem.type.toLowerCase()).intBetween(0, colorHues.length)];
    return {
      start: scheduleItem.start.toJSDate(),
      end: scheduleItem.end?.toJSDate(),
      title: scheduleItem.internal ? `${scheduleItem.name} (internal)` : scheduleItem.name,
      color: `var(--chakra-colors-${baseColor}-500)`,
      textColor: `var(--chakra-colors-${baseColor}-50)`,
      url: `/events/${event?.id}/schedule/${scheduleItem.id}`,
    };
  }
  const start = DateTime.min(...event.schedule.map((e) => e.start)).toJSDate();
  const timezone = event.timezone || event.region?.timezone;
  return (
    <Box>
      {/* TODO: Add "click here to update event timezone" */}
      {!timezone ? <WarningAlert>Event has no timezone set</WarningAlert> : <></>}
      <TimezoneInfo zone={timezone || 'local'} />
      <Calendar
        plugins={[luxonPlugin, timeGridPlugin]}
        initialView="dayOf"
        timeZone={timezone || 'local'}
        contentHeight="auto"
        initialDate={start}
        firstDay={1}
        headerToolbar={false}
        nowIndicator
        views={{
          dayOf: {
            type: 'timeGrid',
            timeHint: 'test',
            allDaySlot: false,
            dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
            duration: {
              days: Interval.fromDateTimes(event.startDate.startOf('day'), event.endDate.endOf('day')).count('days'),
            },
          },
        }}
        events={event.schedule.map(scheduleItemToCalendarEvent)}
      />
    </Box>
  );
}
