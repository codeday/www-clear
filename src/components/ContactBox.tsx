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
      <IdCard /> &nbsp;{name}
      <br />
      <Email /> &nbsp;{email}
      <br />
      <DevicePhone /> &nbsp; {phone}
      {children ? <br /> : null}
      {children}
    </InfoBox>
  );
}
