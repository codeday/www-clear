import React from 'react';
import { Text } from '@codeday/topo/Atom';
import InfoBox from './InfoBox';
import { GoodAlert, InfoAlert } from './Alert';

export default function EmailTemplate({ template, children, ...props }) {
  return (
    <InfoBox heading={template.name} {...props}>
      <Text>
        Sent to {template.sendTo} {template.when} {template.whenFrom}
      </Text>
      <InfoBox nested heading="Flags">
        {template.automatic ? <GoodAlert>Automatic</GoodAlert> : <InfoAlert>Manual</InfoAlert>}
        {template.sendParent ? <InfoAlert>Sent to parents</InfoAlert> : null}
        {template.marketing ? <InfoAlert>Marketing</InfoAlert> : null }
        {template.sendAfterEvent ? <InfoAlert>Post-Event Email</InfoAlert> : null}
        {template.sendText ? <GoodAlert>Has SMS alternative</GoodAlert> : <InfoAlert>Not sent as SMS</InfoAlert>}
        {template.sendInWorkHours ? <InfoAlert>Only sent during work hours</InfoAlert> : null}
        {template.sendLate ? <InfoAlert>Sent Retroactively</InfoAlert> : null}
      </InfoBox>
      <InfoBox nested heading="Preview">
        From: {template.fromName} ({template.fromEmail})
        Reply To: {template.replyTo}
        Subject: {template.subject}
        <details>
          <summary>Body</summary>
          {template.template}
        </details>
        {template.sendText ? <>SMS: {template.textMsg}</> : null}
      </InfoBox>
      {children}
    </InfoBox>
  );
}
