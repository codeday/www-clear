import React from 'react';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from '@codeday/topocons/Icon';
import Badge from './Badge';
import {useColorModeValue} from "@codeday/topo/Theme";

export default function Alert({
    children,
    ...props
}: any) {
    return (
        <Badge
            bg={useColorModeValue("red.200", "darkred")}
            color={useColorModeValue("darkred", "red.200")}
            borderColor={useColorModeValue("darkred", undefined)}
            borderWidth={useColorModeValue(1, 0)}
            {...props}
        >
	    <Icon.UiError/>{' '}{children}
        </Badge>
    );
}


// @ts-expect-error TS(7031) FIXME: Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
export function InfoAlert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("gray.50", "gray.800")}
            color={useColorModeValue("gray.800", "gray.50")}
            borderColor={useColorModeValue("gray.800", undefined)}
            borderWidth={useColorModeValue(1, 0)}

            {...props}
        >
            <Icon.UiInfo/>{' '}{children}
        </Badge>
    );
}


// @ts-expect-error TS(7031) FIXME: Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
export function WarningAlert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("orange.50", "orange.800")}
            color={useColorModeValue("orange.800", "orange.50")}
            borderColor={useColorModeValue("orange.800", undefined)}
            borderWidth={useColorModeValue(1, 0)}
            {...props}
        >
            <Icon.UiWarning/>{' '}{children}
        </Badge>
    );
}


// @ts-expect-error TS(7031) FIXME: Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
export function GoodAlert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("green.50", "green.800")}
            color={useColorModeValue("green.800", "green.50")}
            borderColor={useColorModeValue("green.800", undefined)}
            borderWidth={useColorModeValue(1, 0)}
            {...props}
        >
            <Icon.UiOk/>{' '}{children}
        </Badge>
    );
}
