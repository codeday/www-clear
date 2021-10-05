import React from 'react';
import {Heading} from '@codeday/topo/Atom/Text';
import moment from 'moment-timezone';
import InfoBox from './InfoBox';

export default function DaysUntilEvent({event, children, ...props}) {
    const now = moment().utc(false);
    const eventStart = moment(event.startDate).utc();
    const daysUntil = Math.ceil(moment.duration(eventStart.diff(now)).as('days'));
    return (
        <InfoBox {...props}>
            <Heading pb={3} size="2xl">CodeDay is&nbsp;
                <Heading size="3xl" color="brand" d="inline">
                    {daysUntil === 1 ? 'tomorrow' : daysUntil === 0 ? 'today' : `in ${daysUntil} days`}
                </Heading>.
            </Heading>
            {children}
        </InfoBox>
    );
}
