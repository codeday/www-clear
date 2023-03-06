import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

export default function Breadcrumbs({
  group, event, ticket, scheduleitem, code,
}) {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const convertBreadcrumb = (string) => {
    if (group && string === group.id) return group.name;
    if (event && string === event.id) return event.name;
    if (ticket && string === ticket.id) return `${ticket.firstName} ${ticket.lastName}`;
    if (scheduleitem && string === scheduleitem.id) return scheduleitem.name;
    if (code && string === code.id) return code.code;
    // https://stackoverflow.com/a/4149393
    return string
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();
      const pathArray = linkPath.map((path, i) => ({
        breadcrumb: path,
        href: `/${linkPath.slice(0, i + 1).join('/')}`,
      }));

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <Breadcrumb color="gray.500">
      {/* <BreadcrumbItem> */}
      {/*    <BreadcrumbLink href="/" display="flex"> */}
      {/*        CLEAR */}
      {/*    </BreadcrumbLink> */}
      {/* </BreadcrumbItem> */}
      {breadcrumbs.map((breadcrumb, i) => (
        <BreadcrumbItem key={i}>
          <BreadcrumbLink href={breadcrumb.href}>
            {convertBreadcrumb(breadcrumb.breadcrumb)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
