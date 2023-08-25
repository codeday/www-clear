import React from 'react';
import { IdCard, Email, DevicePhone } from '@codeday/topocons';
import { InfoBox, InfoBoxProps } from './InfoBox';

export type ContactBoxProps = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
} & InfoBoxProps;

export function ContactBox({ name, email, phone, children, ...props }: ContactBoxProps) {
  return (
    <InfoBox heading="Contact" {...props}>
      <IdCard /> {name}
      <br />
      <Email /> {email}
      <br />
      <DevicePhone /> {phone}
      {children ? <br /> : null}
      {children}
    </InfoBox>
  );
}
