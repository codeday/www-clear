import React from 'react';
import * as Icon from '@codeday/topocons/Icon';
import InfoBox from './InfoBox';

export default function ContactBox({
                                       name, email, phone, children, ...props
                                   }) {
    return (
        <InfoBox heading="Contact" {...props}>
            <Icon.IdCard/>{name}<br/>
            <Icon.Email/>{email}<br/>
            <Icon.DevicePhone/>{phone}{children ? <br/> : null}
            {children}
        </InfoBox>
    );
}
