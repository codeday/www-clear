import React, { useEffect } from 'react';
import { Box, Divider, Text } from '@codeday/topo/Atom';
import moment from 'moment-timezone';
import seed from 'random-seed';
import { useTheme } from '@codeday/topo/utils';
import { GoodAlert, InfoAlert, WarningAlert } from './Alert';

export const eventColors = {
  Meal: 'green',
  Special: 'yellow',
  Event: 'gray',
  Workshop: 'orange',
  Livestream: 'purple',
  Deadline: 'red',
  'Gaming Tournament': 'pink',
};

export default function Calendar({
  event, border, children, ...props
}) {
  const schedule = event.schedule.sort((a, b) => (moment(a.start).isAfter(moment(b.start)) ? 1 : -1));
  if (schedule.length === 0) return <></>;
  const displayStarts = moment(schedule[0].start);
  const displayEnds = moment(schedule[schedule.length - 1].start);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      moment.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [typeof window]);
  const eventsByDay = {};
  schedule.forEach((e) => {
    const day = moment(e.start).startOf('day').format('YYYY-MM-DD');
    if (!(day in eventsByDay)) eventsByDay[day] = [];
    eventsByDay[day].push(e);
  });

  const drawDays = [];
  let day = displayStarts.clone();
  while (day.isSameOrBefore(displayEnds)) {
    drawDays.push(day.startOf('day'));
    day = day.clone().add(1, 'day');
  }
  return (
    <Box>
      {drawDays.map((date) => (
        <>
          <Divider />
          <Text
            fontSize="sm"
            color="gray.500"
            ml={5}
            mb={2}
            textAlign="left"
          >{date.format('dddd, MMM Do')}
          </Text>
          <Box>
            {(date.format('YYYY-MM-DD') in eventsByDay)
              ? eventsByDay[date.format('YYYY-MM-DD')].sort((a, b) => (moment(a.start).isAfter(moment(b.start)) ? 1 : -1)).map((e) => {
                const { colors } = useTheme();
                const colorHues = Object.keys(colors);
                const baseColor = eventColors[e.type || 'Event'] || colorHues[seed(e.type.toLowerCase()).intBetween(0, colorHues.length)];
                return (
                  <Box
                    as="a"
                    display="block"
                    href={`schedule/${e.id}`}
                    m={1}
                    ml={10}
                    borderWidth={1}
                    borderRadius="sm"
                    borderColor={`${baseColor}.200`}
                    backgroundColor={`${baseColor}.50`}
                  >
                    <Box
                      display="inline-block"
                      p={2}
                      pb={1}
                      color={`${baseColor}.800`}
                      fontSize="sm"
                      fontWeight="bold"
                      backgroundColor={`${baseColor}.200`}
                                            // marginBottom={2}
                      borderBottomWidth={1}
                    >
                      {e.type || 'Event'}
                    </Box>
                    <Box
                      display="inline-block"
                      pl={2}
                      pr={2}
                      pb={1}
                      fontSize="md"
                      fontWeight="bold"
                      color={`${baseColor}.900`}
                      textDecoration="underline"
                    >
                      {e.name || 'TBA'}
                    </Box>
                    <Text display="inline" m={2} color="black">{e.displayTime}</Text>
                    <Box m={4}>
                      <Box color="black"><b>{e.hostName}</b>{e.hostPronoun ? `(${e.hostPronoun})` : null}</Box>
                      {e.internal ? <InfoAlert>Internal</InfoAlert> : e.finalized
                        ? <GoodAlert>Finalized</GoodAlert>
                        : <WarningAlert>Not Finalized</WarningAlert>}
                      <Box color="black">{e.description}</Box>
                    </Box>
                  </Box>
                );
              }) : null}
          </Box>
        </>
      ))}
    </Box>
  );
}
