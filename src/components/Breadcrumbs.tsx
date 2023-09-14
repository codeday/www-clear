import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { graphql } from 'generated/gql';
import { useQuery } from 'urql';
import { ClearEvent, ClearEventGroup, ClearPromoCode, ClearScheduleItem, ClearTicket } from 'generated/gql/graphql';

export type BreadcrumbsProps = Partial<{
  group: PropFor<ClearEventGroup> | null;
  event: PropFor<ClearEvent> | null;
  scheduleitem: PropFor<ClearScheduleItem> | null;
  ticket: PropFor<ClearTicket> | null;
  code: PropFor<ClearPromoCode> | null;
}>;

const query = graphql(`
  query Breadcrumbs(
    $groupId: String! = ""
    $group: Boolean!
    $eventId: String! = ""
    $event: Boolean!
    $scheduleItemId: String! = ""
    $scheduleItem: Boolean!
    $ticketId: String! = ""
    $ticket: Boolean!
    $codeId: String! = ""
    $code: Boolean!
  ) {
    clear {
      eventGroup(where: { id: $groupId }) @include(if: $group) {
        id
        name
      }
      event(where: { id: $eventId }) @include(if: $event) {
        id
        name
      }
      scheduleItem(where: { id: $scheduleItemId }) @include(if: $scheduleItem) {
        id
        name
      }
      ticket(where: { id: $ticketId }) @include(if: $ticket) {
        id
        firstName
        lastName
      }
      promoCode(where: { id: $codeId }) @include(if: $code) {
        id
        code
      }
    }
  }
`);

interface Crumb {
  breadcrumb: string;
  href: string;
}

export function Breadcrumbs({
  group: groupData,
  event: eventData,
  ticket: ticketData,
  scheduleitem: scheduleItemData,
  code: codeData,
}: BreadcrumbsProps) {
  const router = useRouter();
  const [{ data }] = useQuery({
    query,
    variables: {
      groupId: groupData?.id,
      group: Boolean(groupData),
      eventId: eventData?.id,
      event: Boolean(eventData),
      scheduleItemId: scheduleItemData?.id,
      scheduleItem: Boolean(scheduleItemData),
      ticketId: ticketData?.id,
      ticket: Boolean(ticketData),
      codeId: codeData?.id,
      code: Boolean(codeData),
    },
  });
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>();
  const group = data?.clear?.eventGroup;
  const event = data?.clear?.event;
  const ticket = data?.clear?.ticket;
  const scheduleItem = data?.clear?.scheduleItem;
  const code = data?.clear?.promoCode;
  const convertBreadcrumb = (string: string) => {
    if (group && string === group.id) return group.name;
    if (event && string === event.id) return event.name;
    if (ticket && string === ticket.id) return `${ticket.firstName} ${ticket.lastName}`;
    if (scheduleItem && string === scheduleItem.id) return scheduleItem.name;
    if (code && string === code.id) return code.code;
    // https://stackoverflow.com/a/4149393
    return string.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  useEffect(() => {
    const linkPath = router.asPath.split('/');
    linkPath.shift();
    const pathArray = linkPath.map((path, i) => ({
      breadcrumb: path,
      href: `/${linkPath.slice(0, i + 1).join('/')}`,
    }));
    setBreadcrumbs(pathArray);
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <Breadcrumb color="gray.500">
      {breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem key={`breadcrumb-${breadcrumb.breadcrumb}`}>
          <BreadcrumbLink href={breadcrumb.href}>{convertBreadcrumb(breadcrumb.breadcrumb)}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
