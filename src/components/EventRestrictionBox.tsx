import React from 'react';
import InfoBox from "./InfoBox";
import {InfoAlert} from "./Alert";
import {Box} from "@codeday/topo/Atom";

export default function EventRestrictionBox({
    restrictions,
    children,
    ...props
}: any) {
    return (
        <InfoBox heading="Event Restrictions" headingSize="xl" {...props}>
            <Box pl={4}>
                {restrictions.length > 0?
                    <ul>
                        {restrictions.map((r: any) => <li>{r.name}</li>)}
                    </ul>:
                    <InfoAlert>No Event restrictions</InfoAlert>
                }
            </Box>
            {children}
        </InfoBox>
    );
}
