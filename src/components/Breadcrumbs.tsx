import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink,} from '@chakra-ui/react';

export default function Breadcrumbs({
    group,
    event,
    ticket,
    scheduleitem,
    code
}: any) {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState(null);
    const convertBreadcrumb = (string: any) => {
        if (group && string === group.id) return group.name;
        if (event && string === event.id) return event.name;
        if (ticket && string === ticket.id) return `${ticket.firstName} ${ticket.lastName}`;
        if (scheduleitem && string === scheduleitem.id) return scheduleitem.name;
        if (code && string === code.id) return code.code
        // https://stackoverflow.com/a/4149393
        return string
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str: any) => str.toUpperCase());
    };

    useEffect(() => {
        if (router) {
            const linkPath = router.asPath.split('/');
            linkPath.shift();
            const pathArray = linkPath.map((path, i) => ({
                breadcrumb: path,
                href: `/${linkPath.slice(0, i + 1).join('/')}`
            }));


            // @ts-expect-error TS(2345) FIXME: Argument of type '{ breadcrumb: string; href: stri... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2339): Property 'map' does not exist on type 'never'.
            // @ts-expect-error TS(2339) FIXME: Property 'map' does not exist on type 'never'.
            {breadcrumbs.map((breadcrumb: any, i: any) => (
                <BreadcrumbItem key={i}>
                    <BreadcrumbLink href={breadcrumb.href}>
                        {convertBreadcrumb(breadcrumb.breadcrumb)}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            ))}
        </Breadcrumb>
    );
}
