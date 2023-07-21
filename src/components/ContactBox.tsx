import React from 'react';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from '@codeday/topocons/Icon';
import InfoBox from './InfoBox';

export default function ContactBox({
    name,
    email,
    phone,
    children,
    ...props
}: any) {
    return (
        <InfoBox heading="Contact" {...props}>
            <Icon.IdCard/> {name}<br/>
            <Icon.Email/> {email}<br/>
            <Icon.DevicePhone/> {phone}{children ? <br/> : null}
            {children}
        </InfoBox>
    );
}
