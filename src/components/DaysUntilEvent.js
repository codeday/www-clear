import React from 'react';
import { Text } from '@codeday/topo/Atom';
import moment from 'moment-timezone';
import InfoBox from './InfoBox';

function DayDisplay({
  text, redText, children, ...props
}) {
  return (
    <InfoBox {...props}>
      <Text mb={0} fontSize="3xl" fontWeight="bold">{text}{text && redText && <>&nbsp;</>}
        {redText && (
        <Text as="span" color="brand">
          {redText}
        </Text>
        )}
      </Text>
      {children}
    </InfoBox>
  );
}

export default function DaysUntilEvent({ event, ...props }) {
  const now = moment().utc(false);
  const eventStart = moment(event.startDate).utc();
  const daysUntil = Math.ceil(moment.duration(eventStart.diff(now)).as('days'));

  if (daysUntil < 0) return <DayDisplay text="CodeDay is over. :(" {...props} />;
  if (daysUntil === 0) return <DayDisplay redText="It's CodeDay!" {...props} />;
  if (daysUntil === 1) return <DayDisplay text="CodeDay is" redText="tomorrow." {...props} />;
  return <DayDisplay text="CodeDay is" redText={`in ${daysUntil} days.`} {...props} />;
}
