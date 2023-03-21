import React from 'react';
import { DevicePhone, Email, IdCard } from '@codeday/topocons';
import InfoBox from './InfoBox';

export default function ContactBox({
  name, email, phone, children, ...props
}) {
  return (
    <InfoBox heading="Contact" {...props}>
      <IdCard /> {name} <br />
      <Email /> {email} <br />
      <DevicePhone /> {phone}
      {children ? <br /> : null}
      {children}
    </InfoBox>
  );
}
