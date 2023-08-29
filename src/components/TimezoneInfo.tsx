import { Text, Tooltip, BoxProps, Box } from '@codeday/topo/Atom';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { DeviceWatch } from '@codeday/topocons'

export type TimezoneInfoProps = {
  zone: string;
} & BoxProps;

export function TimezoneInfo({ zone }: TimezoneInfoProps) {
  const [date, setDate] = useState(DateTime.now().setZone(zone));
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(DateTime.now().setZone(zone));
    }, 10 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [zone]);

  return (
    <Box p={1} display="inline-flex" color="GrayText" fontSize="sm">
      <DeviceWatch p={0} my={1} />
      Times displayed in&nbsp;
      <Tooltip label={`(UTC ${date.offset / 60}) Currently ${date.toLocaleString(DateTime.DATETIME_SHORT)}`}>
        {date.offsetNameShort}
      </Tooltip>
    </Box>
  );
}
