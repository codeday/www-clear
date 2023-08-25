import React from 'react';
import { Skeleton, Text } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ClearEmailTemplate } from 'generated/gql/graphql';
import { InfoBox, InfoBoxProps } from '../InfoBox';
import { GoodAlert, InfoAlert } from '../Alert';

const query = graphql(`
  query EmailTemplateBox($where: ClearEmailTemplateWhereUniqueInput!) {
    clear {
      emailTemplate(where: $where) {
        id
        name
        sendTo
        when
        whenFrom
        automatic
        sendParent
        marketing
        sendAfterEvent
        sendText
        sendInWorkHours
        sendLate
        fromName
        fromEmail
        replyTo
        subject
        template
        textMsg
      }
    }
  }
`);

export type EmailTemplateProps = {
  emailTemplate: PropFor<ClearEmailTemplate>;
} & InfoBoxProps;

export function EmailTemplate({ emailTemplate: emailTemplateData, children, ...props }: EmailTemplateProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: emailTemplateData.id } } });
  const emailTemplate = data?.clear?.emailTemplate;

  if (!emailTemplate) return <Skeleton />;
  return (
    <InfoBox heading={emailTemplate.name} {...props}>
      <Text>
        Sent to {emailTemplate.sendTo} {emailTemplate.when} {emailTemplate.whenFrom}
      </Text>
      <InfoBox nested heading="Flags">
        {emailTemplate.automatic ? <GoodAlert>Automatic</GoodAlert> : <InfoAlert>Manual</InfoAlert>}
        {emailTemplate.sendParent ? <InfoAlert>Sent to parents</InfoAlert> : null}
        {emailTemplate.marketing ? <InfoAlert>Marketing</InfoAlert> : null}
        {emailTemplate.sendAfterEvent ? <InfoAlert>Post-Event Email</InfoAlert> : null}
        {emailTemplate.sendText ? <GoodAlert>Has SMS alternative</GoodAlert> : <InfoAlert>Not sent as SMS</InfoAlert>}
        {emailTemplate.sendInWorkHours ? <InfoAlert>Only sent during work hours</InfoAlert> : null}
        {emailTemplate.sendLate ? <InfoAlert>Sent Retroactively</InfoAlert> : null}
      </InfoBox>
      <InfoBox nested heading="Preview">
        From: {emailTemplate.fromName} ({emailTemplate.fromEmail}) Reply To: {emailTemplate.replyTo}
        Subject: {emailTemplate.subject}
        <details>
          <summary>Body</summary>
          {emailTemplate.template}
        </details>
        {emailTemplate.sendText ? <>SMS: {emailTemplate.textMsg}</> : null}
      </InfoBox>
      {children}
    </InfoBox>
  );
}
